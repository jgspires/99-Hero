const express = require('express');
const Hero = require('../models/hero');
const {CIDADES, DESASTRES, HTTP_OK, HTTP_CREATED, HTTP_NO_CONTENT, HTTP_BAD_REQUEST, HTTP_NOT_FOUND, HTTP_CONFLICT, HTTP_INT_SERVER_ERROR, TRAB_EQUIPE} =  require('../constants');

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
    let nomeReal = body.nomeReal;
    let codinome = body.codinome;
    let nomeDesastres = DESASTRES.map(({ nome }) => nome);
    nomeReal = nomeReal.trim().toLowerCase();
    codinome = codinome.trim().toLowerCase();

    if(nomeReal === codinome)
        error = error.concat('Nome real precisa ser diferente do codinome. ');
    if(typeof body.nomeReal != "string")
        error = error.concat('Nome real precisa ser uma string. ');
    if(typeof body.codinome != "string")
        error = error.concat('Codinome precisa ser uma string. ');
    for(let i = 0; i < body.desastres.length; i++) {
        if(nomeDesastres.includes(body.desastres[i]) == false)
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

/**
 * Retorna a quantidade de heróis necessária para um tipo de desastre determinado.
 * @param  {Desastre} desastre O desastre anunciado.
 * @return {Integer} A quantidade de heróis a ser alocada para o desastre provido ou zero caso o desastre não tenha sido encontrado.
 */
const qtdHeroisDesastre = async (desastre) => {
    let nomeDesastres = DESASTRES.map(({nome}) => nome);

    let index = nomeDesastres.indexOf(desastre);
    if(index == -1)
        return 0;
    else {
        return (Math.floor(Math.random() * (DESASTRES[index].qtdHerois[1] - DESASTRES[index].qtdHerois[0] + 1))) + DESASTRES[index].qtdHerois[0];
    }
}

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

        return res.status(HTTP_NO_CONTENT).send();
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
    var nomeDesastres = DESASTRES.map(({ nome }) => nome);

    try {
        // Deleta as chaves undefined dos parâmetros da query.
        // "find" não perece funcionar com chaves undefined?
        deleteUndefProps(qParams);

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

            if(qParams.desastres !== undefined && !nomeDesastres.includes(qParams.desastres))
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

// Nick Fury - Buscar heróis para anúncio de desastre.
router.get(`${COLLECTION}/anuncio`, async (req, res) => {
    var qParams = {
        desastre: req.query.desastre,
        cidade: req.query.cidade,
    };
    // Mapeia os nomes dos desastres em um vetor
    var nomeDesastres = DESASTRES.map(({ nome }) => nome);

    try {
        // Ambos local e desastre precisam ser recebidos
        if(qParams.desastre == undefined || qParams.cidade == undefined)
            return res.status(HTTP_BAD_REQUEST).send({error: "Favor inserir um desastre e um local."});
        
        // E desastre precisa ser válido
        if(!nomeDesastres.includes(qParams.desastre))
            return res.status(HTTP_BAD_REQUEST).send({error: `Desastre inválido: "${qParams.desastres}"`})

        // Retorna uma quantidade aleatória de heróis baseada em qual desastre fora anunciado.
        var qtdNecessaria = await qtdHeroisDesastre(qParams.desastre);
        var qtdAtual = 0;

        // Agrega os resultados.
        var heroes = await Hero.aggregate([
            { $match: { desastres: qParams.desastre, cidades: qParams.cidade, trabEquipe: { $ne: "nao"} } },
            { $limit: qtdNecessaria},
            { $project: {nomeReal: 0} } // Nome real não pode ser exibido.
        ])
        
        qtdAtual += heroes.length;

        // Adiciona o restante dos heróis, mesmo que ele não gostem de trabalhar em equipe, se não houver heróis suficientes p/ o desastre.
        if(qtdAtual < qtdNecessaria) {
        heroes = heroes.concat(
                await Hero.aggregate([
                    { $match: { desastres: qParams.desastre, cidades: qParams.cidade, trabEquipe: { $eq: "nao"} } },
                    { $limit: (qtdNecessaria-qtdAtual)},
                    { $project: {nomeReal: 0} } // Nome real não pode ser exibido.
                ])
            )
        }

        return res.send({heroes});
    } catch (err) {
        return res.status(HTTP_INT_SERVER_ERROR).send({error: 'Falha ao buscar heróis para desastre: ' + err});
    }
});

module.exports = app => app.use(STORE, router);