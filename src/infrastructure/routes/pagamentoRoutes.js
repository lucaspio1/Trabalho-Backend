const express = require('express');
const Pagamento = require('../../domain/entities/pagamento');
const Assinatura = require('../../domain/entities/Assinatura');
const router = express.Router();

// Registrar pagamento de assinatura
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
        res.status(500).json({ error: error.message });
    }
});

// Listar pagamentos de uma assinatura
router.get('/assinatura/:assinaturaId', async (req, res) => {
    try {
        const { assinaturaId } = req.params;
        
        // Verificar se a assinatura existe
        const assinatura = await Assinatura.findByPk(assinaturaId);
        if (!assinatura) return res.status(404).json({ mensagem: 'Assinatura não encontrada' });
        
        const pagamentos = await Pagamento.findAll({ 
            where: { codAss: assinaturaId },
            order: [['dataPagamento', 'DESC']]
        });

        if (pagamentos.length === 0) {
            return res.status(404).json({ mensagem: 'Nenhum pagamento encontrado para esta assinatura' });
        }

        res.json(pagamentos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;