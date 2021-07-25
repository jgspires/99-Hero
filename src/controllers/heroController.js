const express = require('express');
const Hero = require('../models/hero');

// Prepara o router para a definição de rotas.
const router = express.Router();

const COLLECTION = '/heroes';
const STORE = '/99Hero';


// Pequena função para checar se codinome já existe.
const codinomeJaExiste  = async (codinome) => {    
    try {
        if(codinome)
            if (await Hero.findOne({ codinome: codinome }) ) {
                return true;
            }
            else return false;
        return false;
    } catch (err) {
        return res.status(400).send({error: 'Falha ao checar existência de codinome: ' + err});
    }
};

/** Definição de Endpoints e Rotas **/

// Adicionar um Herói
router.post(COLLECTION, async (req, res) => {
    
    try {
        
        // Se codinome de herói já existir, não adicionar e lançar um erro.
        if(await codinomeJaExiste(req.body.codinome) == true) {
            return res.status(400).send({error: 'Codinome de herói já existente.'});
        }

        // Cria o documento no banco de dados.
        const hero = await Hero.create(req.body);

        // Remove o nome real da resposta enviada, uma vez que é somente interno.
        hero.nomeReal = undefined;

        return res.send({hero});
    } catch (err) {
        return res.status(400).send({error: 'Falha no registro de herói: ' + err});
    }
});

// Buscar todos os heróis.
router.get(COLLECTION, async (req, res) => {
    
    try {
        const heroes = await Hero.find({});

        return res.send({heroes});
    } catch (err) {
        return res.status(400).send({error: 'Falha ao buscar heróis: ' + err});
    }
});

module.exports = app => app.use(STORE, router);