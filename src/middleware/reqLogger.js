const moment = require('moment');

// Função para logar todas as requisições feitas.
const reqLogger = (req, res, next) => {
    const loggingTxt = `Requisição recebida: ${req.protocol}://${req.get('host')}${req.originalUrl}: ${moment().format("MMMM Do YYYY, h:mm:ss a")}`;
    console.log(loggingTxt);
    next();
};

module.exports = reqLogger;