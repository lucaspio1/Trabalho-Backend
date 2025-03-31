const express = require('express');
const router = express.Router();
const { Cliente, Pagamento } = require('../models');

// Registrar pagamento
router.post('/pagamento', async (req, res) => {
    try {
        const { clienteId, valor, dataPagamento } = req.body;

        const cliente = await Cliente.findByPk(clienteId);
        if (!cliente) return res.status(404).json({ mensagem: 'Cliente não encontrado' });

        const pagamento = await Pagamento.create({ clienteId, valor, dataPagamento });
        res.status(201).json(pagamento);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao registrar pagamento', detalhe: error.message });
    }
});

// Consultar pagamentos de um cliente
router.get('/pagamento/:clienteId', async (req, res) => {
    try {
        const { clienteId } = req.params;
        const pagamentos = await Pagamento.findAll({ where: { clienteId } });

        if (pagamentos.length === 0) return res.status(404).json({ mensagem: 'Nenhum pagamento encontrado' });

        res.json(pagamentos);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar pagamentos', detalhe: error.message });
    }
});

module.exports = router;
