/** Constantes */

/** Usadas para operações relacionadas a heróis. */
const CIDADES = ["New York", "Rio de Janeiro", "Tóquio"];
const DESASTRES = [
    {nome: "assalto a banco", qtdHerois: [1,3]},
    {nome: "monstro gigante", qtdHerois: [2,5]},
    {nome: "desastre natural", qtdHerois: [3,6]}
];
const TRAB_EQUIPE = ['sim', 'nao', 'indiferente'];

/** Usadas para esclarecer códigos HTTP comuns. */

const HTTP_OK = 200;
const HTTP_CREATED = 201;
const HTTP_NO_CONTENT = 204;
const HTTP_BAD_REQUEST = 400;
const HTTP_NOT_FOUND = 404;
const HTTP_CONFLICT = 409;
const HTTP_INT_SERVER_ERROR = 500;

exports.CIDADES = CIDADES;
exports.DESASTRES = DESASTRES;
exports.TRAB_EQUIPE = TRAB_EQUIPE;

exports.HTTP_OK = HTTP_OK;
exports.HTTP_CREATED = HTTP_CREATED;
exports.HTTP_NO_CONTENT = HTTP_NO_CONTENT;
exports.HTTP_BAD_REQUEST = HTTP_BAD_REQUEST;
exports.HTTP_NOT_FOUND = HTTP_NOT_FOUND;
exports.HTTP_CONFLICT = HTTP_CONFLICT;
exports.HTTP_INT_SERVER_ERROR = HTTP_INT_SERVER_ERROR;