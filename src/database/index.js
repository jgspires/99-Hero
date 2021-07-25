const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/99Hero', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).catch(err => handleError(err));

// Em caso de problemas na conexão inicial.
function handleError(err) {
    logError("Falha ao se conectar ao banco de dados: " + err);
}

// Em caso de problemas após o estabelecimento da conexão.
mongoose.connection.on('error', err => {
    logError(err);
});

mongoose.Promise = global.Promise;

module.exports = mongoose;