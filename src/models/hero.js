const mongoose = require('../database');

// Schema para Hérois
const HeroSchema = new mongoose.Schema({

    nomeReal: {
        type: String,
        require: true,
        
        // nome real é somente para uso interno.
        select: false,
    },
    codinome: {
        type: String,
        require: true,
        unique: true,
    },
    desastres: [{
        type: String,
        require: true,
    }],
    cidades: [{
        type: String,
        require: true,
    }],
    trabEquipe: {
        type: String,
        enum: ['sim', 'nao', 'indiferente'],
        default: 'indiferente',
    },
    CreatedAt: {
        type: Date,
        default: Date.now(),
    }
})

// Cria o modelo baseado no Schema acima
const Hero = mongoose.model("Hero", HeroSchema);

// E então o exporta
module.exports = Hero;