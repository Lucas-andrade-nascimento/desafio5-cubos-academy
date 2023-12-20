const express = require("express");
const rotas = express();
const usuarioRotas = require("./rotasUsuarios");
const rotaLogin = require("./rotaLogin");
const rotaCategoria = require("./rotaCategorias");
const rotaCliente = require("./rotasCliente");
const rotaProduto = require("./rotasProdutos");
const rotaPedidos = require("./rotaPedidos");
const { autenticaUsuario } = require("../intermediarios/autenticacao");

rotas.use("/usuario", usuarioRotas);
rotas.use("/login", rotaLogin);
rotas.use("/categoria", rotaCategoria);

rotas.use(autenticaUsuario);
rotas.use("/cliente", rotaCliente);
rotas.use("/produto", rotaProduto);
rotas.use("/pedido", rotaPedidos);

module.exports = rotas;
