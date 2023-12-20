const listarCategorias = require("../controladores/categorias");
const rotaCategoria = require("express").Router();

rotaCategoria.get("/", listarCategorias);

module.exports = rotaCategoria;