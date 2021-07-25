const mongoose = require('mongoose');

const dbURI = "mongodb://localhost:27017/99Hero";

mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).catch(err => handleError(err));

// Exibe uma mensagem ao conectar ao DB.
mongoose.connection.on('connected', () => {
    console.log("Conexão com banco de dados estabelecida.");
});

// Em caso de problemas na conexão inicial.
function handleError(err) {
    console.error("Falha ao se conectar ao banco de dados: " + err);
}

// Em caso de problemas após o estabelecimento da conexão.
mongoose.connection.on('error', err => {
    console.error(err);
});

mongoose.Promise = global.Promise;

module.exports = mongoose;