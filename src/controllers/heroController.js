const express = require('express');
const Hero = require('../models/hero');
const {CIDADES, DESASTRES, HTTP_OK, HTTP_CREATED, HTTP_BAD_REQUEST, HTTP_NOT_FOUND, HTTP_CONFLICT, HTTP_INT_SERVER_ERROR} =  require('../constants');

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
        return res.status(HTTP_INT_SERVER_ERROR).send({error: 'Falha ao checar existência de codinome: ' + err});
    }
};

/**
 * Valida os dados do herói antes de adicioná-lo.
 * @param  {Object} body O corpo da requisição que contém os dados do herói a ser adicionado
 * @return {Promise}      A string de erro caso a validação falhe. Ou nulo caso contrário.
 */
const validarHeroi = async (body) => {
    let error = "";

    if(typeof body.nomeReal != "string")
        error = error.concat('Nome real precisa ser uma string. ');
    if(typeof body.codinome != "string")
        error = error.concat('Codinome precisa ser uma string. ');
    for(let i = 0; i < body.desastres.length; i++) {
        if(DESASTRES.includes(body.desastres[i]) == false)
            error = error.concat(`Desastre: "${body.desastres[i]}" inválido. `);
    }
    for(let i = 0; i < body.cidades.length; i++) {
        if(CIDADES.includes(body.cidades[i]) == false)
            error = error.concat(`Cidade: "${body.cidades[i]}" inválida.`);
    }

    if(error == "")
        return null;
    else return error;
    
}

/**
 * Deleta as propriedades "undefined" do objeto passado.
 * @param  {Object} obj O objeto do qual as propriedades undefined serão removidas.
 * @return {undefined} Nada.
 */
const deleteUndefProps = async (obj) => {
    Object.keys(obj).forEach(key => {
        if (obj[key] === undefined) {
            delete obj[key];
        }
    });
};

/** Definição de Endpoints e Rotas **/

// Adicionar um Herói
router.post(COLLECTION, async (req, res) => {
    
    try {
        let erro = await validarHeroi(req.body);
        if(erro != null)
            return res.status(HTTP_BAD_REQUEST).send({error: erro});
        
        // Se codinome de herói já existir, não adicionar e lançar um erro.
        if(await codinomeJaExiste(req.body.codinome) == true) {
            return res.status(HTTP_CONFLICT).send({error: 'Codinome de herói já existente.'});
        }

        // Cria o documento no banco de dados.
        const hero = await Hero.create(req.body);

        // Remove o nome real da resposta enviada, uma vez que é somente interno.
        hero.nomeReal = undefined;

        return res.status(HTTP_CREATED).send({hero});
    } catch (err) {
        return res.status(HTTP_INT_SERVER_ERROR).send({error: 'Falha no registro de herói: ' + err});
    }
});

// Modificar um Herói a partir de seu codinome.
router.put(COLLECTION, async (req, res) => {
    var atualCodinome = req.query.codinome;
    var novoCodinome = req.body.codinome;

    try {
        if(atualCodinome === undefined)
            return res.status(HTTP_BAD_REQUEST).send({error: "Favor inserir um codinome."});
        
        let erro = await validarHeroi(req.body);
        if(erro != null)
            return res.status(HTTP_BAD_REQUEST).send({error: erro});
        
        // Se codinome de herói não existir, não atualizar e lançar um erro.
        if(await codinomeJaExiste(atualCodinome) == false) {
            return res.status(HTTP_NOT_FOUND).send({error: `Codinome não existente: ${atualCodinome}`});
        }

        // Cria o documento no banco de dados.
        const hero = await Hero.findOneAndUpdate({codinome: atualCodinome}, req.body);

        // Remove o nome real da resposta enviada, uma vez que é somente interno.
        hero.nomeReal = undefined;

        return res.send();
    } catch (err) {
        return res.status(HTTP_INT_SERVER_ERROR).send({error: 'Falha no registro de herói: ' + err});
    }
});

// Buscar Heróis
router.get(COLLECTION, async (req, res) => {
    var qParams = {
        codinome: req.query.codinome,
        desastres: req.query.desastre,
        cidades: req.query.cidade,
    };

    try {
        // Se houver codinome, busca somente um com aquele codinome.
        if(qParams.codinome) {
            const hero = await Hero.findOne(qParams);

            // Se herói não existir, avisar ao usuário.
            if(hero == null)
                return res.status(HTTP_NOT_FOUND).send({error: "Nenhum herói encontrado."});
            else return res.send({hero});
        }
        // Como não há codinome, busca todos de acordo com os parâmetros.
        else {
            // Deleta as chaves undefined dos parâmetros da query.
            // "find" não perece funcionar com chaves undefined?
            deleteUndefProps(qParams);

            if(qParams.desastres !== undefined && !DESASTRES.includes(qParams.desastres))
                return res.status(HTTP_BAD_REQUEST).send({error: `Desastre inválido: "${qParams.desastres}"`})

            if(qParams.cidades !== undefined && !CIDADES.includes(qParams.cidades))
                return res.status(HTTP_BAD_REQUEST).send({error: `Cidade inválida: "${qParams.cidades}"`})

            const heroes = await Hero.find(qParams);

            if(heroes == null)
                return res.status(HTTP_NOT_FOUND).send({error: "Nenhum herói encontrado."});
            return res.send({heroes});
        }
    } catch (err) {
        return res.status(HTTP_INT_SERVER_ERROR).send({error: 'Falha ao buscar herói: ' + err});
    }
});

// Deletar um herói.
router.delete(COLLECTION, async (req, res) => {
    var codinome = req.query.codinome;
    
    try {
        if(codinome === undefined)
            return res.status(HTTP_BAD_REQUEST).send({error: "Favor inserir um codinome."});

        const hero = await Hero.deleteOne({codinome: codinome});

        // Se herói não existir, avisar ao usuário.
        if(hero.deletedCount == 0)
            return res.status(HTTP_NOT_FOUND).send({error: "Codinome não encontrado."});

        return res.send({hero});
    } catch (err) {
        return res.status(HTTP_INT_SERVER_ERROR).send({error: 'Falha ao deletar herói: ' + err});
    }
});

module.exports = app => app.use(STORE, router);