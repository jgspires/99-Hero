const mongoose = require('../database');
const {CIDADES, DESASTRES, TRAB_EQUIPE} =  require('../constants');

// Schema para Hérois
const HeroSchema = new mongoose.Schema({

    nomeReal: {
        type: String,
        required: true,
        
        // nome real é somente para uso interno.
        select: false,
    },
    codinome: {
        type: String,
        required: true,
        unique: true,
    },
    desastres: [{
        type: String,
        enum: DESASTRES,
        required: true,
    }],
    cidades: [{
        type: String,
        enum: CIDADES,
        required: true,
    }],
    trabEquipe: {
        type: String,
        enum: TRAB_EQUIPE,
        default: 'indiferente',
        lowercase: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,

        // Como esse path é uma timestamp, ele não deve ser modificado uma vez criado.
        immutable: true,
    }
})

// Cria o modelo baseado no Schema acima
const Hero = mongoose.model("Hero", HeroSchema);

// E então o exporta
module.exports = Hero;