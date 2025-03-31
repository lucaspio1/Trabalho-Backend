const express = require('express');
const Assinatura = require('../../domain/entities/Assinatura');
const router = express.Router();

// Criar uma nova assinatura
router.post('/', async (req, res) => {
    try {
        const { codPlano, codCli, inicioFidelidade, fimFidelidade, custoFinal, descricao } = req.body;
        const assinatura = await Assinatura.create({ codPlano, codCli, inicioFidelidade, fimFidelidade, custoFinal, descricao });
        res.status(201).json(assinatura);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Listar todas as assinaturas
router.get('/', async (req, res) => {
    try {
        const assinaturas = await Assinatura.findAll();
        res.json(assinaturas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
