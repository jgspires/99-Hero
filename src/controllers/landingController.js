const express = require('express');

const router = express.Router();

// Um controller simples só caso o tester queira checar se o webserver está ON.
// Para fins de teste, evidentemente.

router.get('/', async (req, res) => {
    return res.send("<h1>Tô funcionando ;)</h1>");
});

module.exports = app => app.use('/', router);