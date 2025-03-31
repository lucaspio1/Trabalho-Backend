const express = require('express');
const Cliente = require('../../domain/entities/Cliente');
const router = express.Router();

router.get('/', async (req, res) => {
    const clientes = await Cliente.findAll();
    res.json(clientes);
});

module.exports = router;
