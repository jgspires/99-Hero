const express = require('express');
const reqLogger = require('./middleware/reqLogger'); // Logger de requisições

/** Há dois scripts para executar essa aplicação: start e dev.
 * start somente executa a aplicação normalmente, para "produção".
 * dev, por outro lado, utiliza o nodemon para ouvir alterações em tempo real.
 * Para executar um deles, basta escrever  "npm run NOME_DO_SCRIPT" */

const PORT = process.env.PORT || 3000;

// Cria uma aplicação Express.
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(reqLogger);

// Chama o controller com a aplicação express como parâmetro.
require('./controllers/heroController')(app);

// Controller de teste na rota base '/' para lançar um "Olá Mundo".
require('./controllers/landingController')(app);

app.listen(PORT, () => {console.log(`Servidor iniciado na porta ${PORT}.`)});