const knex = require("../conexao");
const excluirImagemDoProduto = require("../servicos/delete");
const { uploadImagem } = require("../servicos/upload");

const controladoresProduto = {
  async cadastrarProduto(req, res) {
    try {
      const { descricao, quantidade_estoque, valor, categoria_id } = req.body;

      const categoria = await knex("categorias")
        .where({ id: categoria_id })
        .first();

      if (!categoria) {
        return res.status(404).json("Categoria não existe.");
      }

      let produto = await knex("produtos")
        .insert({
          descricao,
          quantidade_estoque,
          valor,
          categoria_id,
        })
        .returning("*");

      if (produto.length === 0) {
        return res.status(404).json("Produto não foi cadastrado.");
      }

      if (req.file) {
        const { originalname, mimetype, buffer } = req.file;
        const id = produto[0].id;

        const imagem = await uploadImagem(
          `produtos/${id}/${originalname}`,
          buffer,
          mimetype
        );

        produto = await knex("produtos")
          .update({
            produto_imagem: imagem.path,
          })
          .where({ id })
          .returning("*");

        produto[0].produto_imagem = imagem.url;
      }

      return res.status(201).json(produto[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async editarDadosDoProduto(req, res) {
    try {
      const produtoId = req.params.id;
      const { descricao, quantidade_estoque, valor, categoria_id } = req.body;

      const categoria = await knex("categorias")
        .where({ id: categoria_id })
        .first();

      if (!categoria) {
        return res.status(404).json("Categoria não existe.");
      }

      let produto = await knex("produtos").select("*").where({ id: produtoId });

      if (produto.length === 0) {
        return res.status(404).json("Produto não existe");
      }

      produto = await knex("produtos")
        .update({ descricao, quantidade_estoque, valor, categoria_id, produto_imagem: null })
        .where({ id: produtoId })
        .returning("*");

      if (req.file) {
        const { originalname, mimetype, buffer } = req.file;
        const id = produto[0].id;

        if (produto[0].produto_imagem !== null) {
          await excluirImagemDoProduto(produto[0].produto_imagem);
        }

        const imagem = await uploadImagem(
          `produtos/${id}/${originalname}`,
          buffer,
          mimetype
        );

        await knex("produtos")
          .update({
            produto_imagem: imagem.path,
          })
          .where({ id });

        produto[0].produto_imagem = imagem.url;
      }

      return res.status(201).json(produto[0]);
    } catch (error) {
      return res.status(500).json({ Error: error.message });
    }
  },
  async listarProdutos(req, res) {
    try {
      const { categoria_id } = req.query;
      let listaProdutos;
      if (categoria_id != undefined) {
        listaProdutos = await knex("produtos as p")
          .innerJoin("categorias as c", "p.categoria_id", "c.id")
          .select(
            "p.id",
            "p.descricao",
            "p.quantidade_estoque",
            "p.valor",
            "c.id as categoria_id",
            "c.descricao as categoria"
          )
          .where("c.id", parseInt(req.query.categoria_id));
      } else {
        listaProdutos = await knex("produtos as p")
          .innerJoin("categorias as c", "p.categoria_id", "c.id")
          .select(
            "p.id",
            "p.descricao",
            "p.quantidade_estoque",
            "p.valor",
            "c.id as categoria_id",
            "c.descricao as categoria"
          );
      }
      if (listaProdutos < 1) {
        const naoEncontrado = `não há nenhum produto na categoria id: ${categoria_id}`;
        return res.status(404).json({ erro: naoEncontrado });
      }
      return res.status(200).json(listaProdutos);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  async detalharProduto(req, res) {
    try {
      const { id } = req.params;

      const produtoExiste = await knex("produtos as p")
        .innerJoin("categorias as c", "p.categoria_id", "c.id")
        .select(
          "p.id",
          "p.descricao",
          "p.quantidade_estoque",
          "p.valor",
          "c.descricao as categoria"
        )
        .where("p.id", id)
        .first();

      if (!produtoExiste) {
        return res.status(404).json("Não existe produto para o id informado.");
      }

      res.status(200).json(produtoExiste);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async excluirProduto(req, res) {
    try {
      const { id } = req.params;

      const produtoExiste = await knex("produtos").where({ id }).first();

      if (!produtoExiste) {
        return res.status(404).json("Não existe produto para o id informado.");
      }

      const produtoEmPedido = await knex("pedido_produtos")
        .where("produto_id", id)
        .returning("*");

      if (produtoEmPedido[0]) {
        return res.status(403).json({
          mensagem:
            "não é possivel excluir o produto pois o mesmo está em um pedido",
        });
      }

      await excluirImagemDoProduto(produtoExiste.produto_imagem);

      await knex("produtos").where({ id }).del();

      res.status(204).json();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = controladoresProduto;
