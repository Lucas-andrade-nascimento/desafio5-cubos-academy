const rotaCliente = require("express").Router();
const validarCampos = require("../intermediarios/validarCampos");
const schemaCliente = require("../validacoes/schemaCliente");
const controladoresCliente = require("../controladores/clientes");

rotaCliente.post(
  "/",
  validarCampos(schemaCliente),
  controladoresCliente.cadastrarCliente
);

rotaCliente.put(
  "/:id",
  validarCampos(schemaCliente),
  controladoresCliente.editarCliente
);

rotaCliente.get("/", controladoresCliente.listarClientes);

rotaCliente.get("/:id", controladoresCliente.detalharCliente);

module.exports = rotaCliente;
