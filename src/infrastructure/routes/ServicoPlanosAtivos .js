const express = require('express');
const router = express.Router();
const { Cliente, Plano, Assinatura } = require('../models');

// Consultar planos ativos de um cliente
router.get('/planos/:clienteId', async (req, res) => {
    try {
        const { clienteId } = req.params;

        const cliente = await Cliente.findByPk(clienteId, {
            include: {
                model: Assinatura,
                where: { status: 'ativo' },
                include: [{ model: Plano }]
            }
        });

        if (!cliente || cliente.Assinaturas.length === 0) {
            return res.status(404).json({ mensagem: 'Nenhum plano ativo encontrado para este cliente' });
        }

        res.json(cliente.Assinaturas.map(a => a.Plano));
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar planos ativos', detalhe: error.message });
    }
});

module.exports = router;
