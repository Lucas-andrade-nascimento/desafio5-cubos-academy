const login = require("../controladores/login");
const validarCampos = require("../intermediarios/validarCampos");
const { schemaLoginUsuario } = require("../validacoes/schemaUsuario");
const rotaLogin = require("express").Router()

rotaLogin.post(
    "/",
    validarCampos(schemaLoginUsuario),
    login
);

module.exports = rotaLogin;

