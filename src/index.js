const express = require('express');

const PORT = 3000;

// Cria uma aplicação Express.
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Chama o controller com a aplicação express como parâmetro.
require('./controllers/heroController')(app);

app.listen(PORT);