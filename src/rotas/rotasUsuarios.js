const validarCampos = require("../intermediarios/validarCampos");
const { schemaUsuario } = require("../validacoes/schemaUsuario");
const usuariosControladores = require("../controladores/usuarios");
const { autenticaUsuario } = require("../intermediarios/autenticacao");
const usuarioRotas = require("express").Router();

usuarioRotas.post(
  "/",
  validarCampos(schemaUsuario),
  usuariosControladores.cadastrarUsuario
);

usuarioRotas.use(autenticaUsuario);

usuarioRotas.get("/", usuariosControladores.detalharUsuario);

usuarioRotas.put(
  "/",
  validarCampos(schemaUsuario),
  usuariosControladores.editarUsuario
);

module.exports = usuarioRotas;
