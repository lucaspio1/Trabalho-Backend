const express = require('express');
const router = express.Router();
const Assinatura = require('../../domain/entities/Assinatura');
const Cliente = require('../../domain/entities/Cliente');

// Modelo de Pagamento (precisamos criar esta entidade)
const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const Pagamento = sequelize.define('Pagamento', {
    codigo: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    codAss: { type: DataTypes.INTEGER, allowNull: false },
    valorPago: { type: DataTypes.FLOAT, allowNull: false },
    dataPagamento: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
});

// Registrar pagamento
router.post('/', async (req, res) => {
    try {
        const { codAss, valorPago, dataPagamento } = req.body;

        // Verificar se a assinatura existe
        const assinatura = await Assinatura.findByPk(codAss);
        if (!assinatura) return res.status(404).json({ mensagem: 'Assinatura não encontrada' });

        // Criar o pagamento
        const pagamento = await Pagamento.create({ 
            codAss, 
            valorPago, 
            dataPagamento: dataPagamento || new Date() 
        });

        // Atualizar a data do último pagamento na assinatura
        await assinatura.update({ dataUltimoPagamento: dataPagamento || new Date() });

        res.status(201).json(pagamento);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao registrar pagamento', detalhe: error.message });
    }
});

// Consultar pagamentos de uma assinatura
router.get('/assinatura/:assinaturaId', async (req, res) => {
    try {
        const { assinaturaId } = req.params;
        
        // Verificar se a assinatura existe
        const assinatura = await Assinatura.findByPk(assinaturaId);
        if (!assinatura) return res.status(404).json({ mensagem: 'Assinatura não encontrada' });
        
        const pagamentos = await Pagamento.findAll({ where: { codAss: assinaturaId } });

        if (pagamentos.length === 0) return res.status(404).json({ mensagem: 'Nenhum pagamento encontrado para esta assinatura' });

        res.json(pagamentos);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar pagamentos', detalhe: error.message });
    }
});

// Gerar relatório de faturamento por cliente
router.get('/relatorio/cliente/:clienteId', async (req, res) => {
    try {
        const { clienteId } = req.params;
        
        // Verificar se o cliente existe
        const cliente = await Cliente.findByPk(clienteId);
        if (!cliente) return res.status(404).json({ mensagem: 'Cliente não encontrado' });
        
        // Buscar assinaturas do cliente
        const assinaturas = await Assinatura.findAll({ where: { codCli: clienteId } });
        
        if (assinaturas.length === 0) return res.status(404).json({ mensagem: 'Nenhuma assinatura encontrada para este cliente' });
        
        // Buscar pagamentos de todas as assinaturas do cliente
        const assinaturasIds = assinaturas.map(a => a.codigo);
        const pagamentos = await Pagamento.findAll({ 
            where: { 
                codAss: assinaturasIds 
            },
            order: [['dataPagamento', 'DESC']]
        });
        
        // Calcular totais
        const totalPago = pagamentos.reduce((sum, pag) => sum + pag.valorPago, 0);
        
        res.json({
            cliente: cliente.nome,
            totalPago,
            quantidadeAssinaturas: assinaturas.length,
            ultimosPagamentos: pagamentos.slice(0, 5)
        });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao gerar relatório', detalhe: error.message });
    }
});

module.exports = { router, Pagamento };