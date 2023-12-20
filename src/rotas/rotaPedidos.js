const rotaPedidos = require("express").Router();
const controladoresPedidos = require("../controladores/pedidos");
const listarPedidos = require("../controladores/pedidos");
const validarCampos = require("../intermediarios/validarCampos");
const schemaPedidos = require("../validacoes/schemaPedidos");

rotaPedidos.post(
  "/",
  validarCampos(schemaPedidos),
  controladoresPedidos.cadastrarPedido
);
rotaPedidos.get("/", controladoresPedidos.listarPedidos);

module.exports = rotaPedidos;
