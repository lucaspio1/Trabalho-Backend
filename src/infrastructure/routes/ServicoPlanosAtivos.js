const express = require('express');
const router = express.Router();
const Cliente = require('../../domain/entities/Cliente');
const Plano = require('../../domain/entities/Plano');
const Assinatura = require('../../domain/entities/Assinatura');

// Consultar planos ativos de um cliente
router.get('/cliente/:clienteId', async (req, res) => {
    try {
        const { clienteId } = req.params;

        // Verificar se o cliente existe
        const cliente = await Cliente.findByPk(clienteId);
        if (!cliente) return res.status(404).json({ mensagem: 'Cliente não encontrado' });

        // Buscar assinaturas do cliente
        const assinaturas = await Assinatura.findAll({
            where: { codCli: clienteId }
        });

        if (assinaturas.length === 0) {
            return res.status(404).json({ mensagem: 'Nenhum plano ativo encontrado para este cliente' });
        }

        // Buscar os planos associados às assinaturas
        const planoIds = assinaturas.map(a => a.codPlano);
        const planos = await Plano.findAll({
            where: { codigo: planoIds }
        });

        // Montar o objeto de resposta com planos e detalhes da assinatura
        const planosAtivos = assinaturas.map(assinatura => {
            const plano = planos.find(p => p.codigo === assinatura.codPlano);
            return {
                plano: {
                    codigo: plano.codigo,
                    nome: plano.nome,
                    descricao: plano.descricao,
                    custoMensal: plano.custoMensal
                },
                assinatura: {
                    codigo: assinatura.codigo,
                    inicioFidelidade: assinatura.inicioFidelidade,
                    fimFidelidade: assinatura.fimFidelidade,
                    custoFinal: assinatura.custoFinal,
                    descricao: assinatura.descricao,
                    ultimoPagamento: assinatura.dataUltimoPagamento
                }
            };
        });

        res.json({
            cliente: {
                codigo: cliente.codigo,
                nome: cliente.nome,
                email: cliente.email
            },
            planosAtivos
        });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar planos ativos', detalhe: error.message });
    }
});

// Listar todos os planos ativos no sistema
router.get('/', async (req, res) => {
    try {
        // Buscar todas as assinaturas
        const assinaturas = await Assinatura.findAll();
        
        if (assinaturas.length === 0) {
            return res.status(404).json({ mensagem: 'Nenhum plano ativo encontrado no sistema' });
        }
        
        // Obter IDs únicos de planos e clientes
        const planoIds = [...new Set(assinaturas.map(a => a.codPlano))];
        const clienteIds = [...new Set(assinaturas.map(a => a.codCli))];
        
        // Buscar planos e clientes
        const planos = await Plano.findAll({ where: { codigo: planoIds } });
        const clientes = await Cliente.findAll({ where: { codigo: clienteIds } });
        
        // Contar quantas assinaturas existem para cada plano
        const planosComContagem = planos.map(plano => {
            const assinaturasDoPlano = assinaturas.filter(a => a.codPlano === plano.codigo);
            return {
                codigo: plano.codigo,
                nome: plano.nome,
                descricao: plano.descricao,
                custoMensal: plano.custoMensal,
                totalAssinaturas: assinaturasDoPlano.length
            };
        });
        
        res.json({
            totalPlanos: planos.length,
            totalAssinaturas: assinaturas.length,
            totalClientes: clientes.length,
            planos: planosComContagem
        });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao listar planos ativos', detalhe: error.message });
    }
});

// Verificar status da fidelidade do cliente
router.get('/fidelidade/:clienteId', async (req, res) => {
    try {
        const { clienteId } = req.params;
        
        // Verificar se o cliente existe
        const cliente = await Cliente.findByPk(clienteId);
        if (!cliente) return res.status(404).json({ mensagem: 'Cliente não encontrado' });
        
        // Buscar assinaturas do cliente
        const assinaturas = await Assinatura.findAll({
            where: { codCli: clienteId }
        });
        
        if (assinaturas.length === 0) {
            return res.status(404).json({ 
                mensagem: 'Nenhuma assinatura encontrada para este cliente' 
            });
        }
        
        const hoje = new Date();
        
        // Verificar status de fidelidade de cada assinatura
        const statusFidelidade = assinaturas.map(assinatura => {
            const fimFidelidade = new Date(assinatura.fimFidelidade);
            const inicioFidelidade = new Date(assinatura.inicioFidelidade);
            
            // Calcular dias restantes
            const diasRestantes = Math.ceil((fimFidelidade - hoje) / (1000 * 60 * 60 * 24));
            const statusTexto = diasRestantes > 0 ? 'Em fidelidade' : 'Fidelidade concluída';
            
            return {
                codigoAssinatura: assinatura.codigo,
                inicioFidelidade: inicioFidelidade,
                fimFidelidade: fimFidelidade,
                status: statusTexto,
                diasRestantes: diasRestantes > 0 ? diasRestantes : 0
            };
        });
        
        res.json({
            cliente: {
                codigo: cliente.codigo,
                nome: cliente.nome,
                email: cliente.email
            },
            statusFidelidade
        });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao verificar status de fidelidade', detalhe: error.message });
    }
});

module.exports = router;