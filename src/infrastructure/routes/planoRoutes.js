const express = require('express');
const Plano = require('../../domain/entities/Plano');
const router = express.Router();

router.get('/', async (req, res) => {
    const planos = await Plano.findAll();
    res.json(planos);
});

module.exports = router;
