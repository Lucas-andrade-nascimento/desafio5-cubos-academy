const rotaProduto = require("express").Router();
const validarCampos = require("../intermediarios/validarCampos");
const schemaProduto = require("../validacoes/schemaProdutos");
const controladoresProduto = require("../controladores/produtos");
const multer = require("../intermediarios/multer");

rotaProduto.post(
  "/",
  multer.single("produto_imagem"),
  validarCampos(schemaProduto),
  controladoresProduto.cadastrarProduto
);

rotaProduto.put(
  "/:id",
  multer.single("produto_imagem"),
  validarCampos(schemaProduto),
  controladoresProduto.editarDadosDoProduto
);
rotaProduto.get("/", controladoresProduto.listarProdutos);
rotaProduto.get("/:id", controladoresProduto.detalharProduto);
rotaProduto.delete("/:id", controladoresProduto.excluirProduto);

module.exports = rotaProduto;
