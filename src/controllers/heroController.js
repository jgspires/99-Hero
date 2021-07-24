const express = require('express');
const Hero = require('../models/hero');

// Prepara o router para a definição de rotas.
const router = express.Router();

const COLLECTION = '/heroes';
const STORE = '/99Hero';

router.post(COLLECTION, async (req, res) => {
    try {
        const hero = await Hero.create(req.body);

        return res.send({hero});
    } catch (err) {
        return res.status(400).send({error: 'Falha no registro de herói: ' + err});
    }
});

module.exports = app => app.use(STORE, router);