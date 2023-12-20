const knex = require("../conexao");
const transportador = require("../email");
const compiladorHtml = require("../utils/compiladorHtml");

const controladoresPedidos = {
  async cadastrarPedido(req, res) {
    try {
      const { cliente_id, observacao, pedido_produtos } = req.body;

      const clienteExiste = await knex("clientes")
        .where({ id: cliente_id })
        .first();

      if (!clienteExiste) {
        return res.status(404).json("Cliente inexistente.");
      }

      for (const pedido_produto of pedido_produtos) {
        const { produto_id, quantidade_produto } = pedido_produto;
        const produtoExiste = await knex("produtos")
          .where({ id: produto_id })
          .first();

        if (!produtoExiste) {
          return res.status(400).json("Um ou mais produtos não existe.");
        }
        if (produtoExiste.quantidade_estoque < quantidade_produto) {
          return res
            .status(400)
            .json("Quantidade em estoque não é suficiente.");
        }
      }
      const produtos = await knex("produtos");

      const valorTotal = pedido_produtos.reduce((total, pedido_produto) => {
        const { produto_id, quantidade_produto } = pedido_produto;
        const produto = produtos.find((p) => p.id === produto_id);
        return total + produto.valor * quantidade_produto;
      }, 0);

      const pedido = await knex("pedidos")
        .insert({
          cliente_id,
          observacao,
          valor_total: valorTotal,
        })
        .returning("*");

      if (!pedido) {
        return res.status(400).json("Pedido não foi cadastrado.");
      }

      await Promise.all(
        pedido_produtos.map(async (pedido_produto) => {
          const { produto_id, quantidade_produto } = pedido_produto;
          const produto = produtos.find((p) => p.id === produto_id);

          await knex("pedido_produtos").insert({
            pedido_id: pedido[0].id,
            produto_id,
            quantidade_produto,
            valor_produto: produto.valor,
          });

          await knex("produtos").where({ id: produto_id }).decrement({
            quantidade_estoque: quantidade_produto,
          });
        })
      );

      const html = await compiladorHtml("./src/templates/email.html", {
        clienteNome: clienteExiste.nome,
      });
      transportador.sendMail({
        from: `${process.env.MAIL_NAME}, < ${process.env.MAIL_FROM}>`,
        to: `${clienteExiste.nome},  < ${clienteExiste.email}>`,
        subject: "Pedido confirmado",
        html,
      });

      return res.status(200).json(pedido);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  },
  async listarPedidos(req, res) {
    try {
      const { cliente_id } = req.query;
      let listaPedidos;
      if (cliente_id != undefined) {
        listaPedidos = await knex("pedidos as p")
          .innerJoin("pedido_produtos as prod", "p.id", "prod.pedido_id")
          .select(
            "p.id",
            "p.valor_total",
            "p.observacao",
            "p.cliente_id",
            "prod.id as item_id",
            "prod.quantidade_produto",
            "prod.valor_produto",
            "prod.pedido_id",
            "prod.produto_id"
          )
          .where("p.cliente_id", parseInt(req.query.cliente_id));
      } else {
        listaPedidos = await knex("pedidos as p")
          .innerJoin("pedido_produtos as prod", "p.id", "prod.pedido_id")
          .select(
            "p.id",
            "p.valor_total",
            "p.observacao",
            "p.cliente_id",
            "prod.id as item_id",
            "prod.quantidade_produto",
            "prod.valor_produto",
            "prod.pedido_id",
            "prod.produto_id"
          );
      }

      const listaFormatada = [];

      listaPedidos.forEach((pedido) => {
        const pedidoItem = listaFormatada.find(
          (item) => item.pedido.id === pedido.id
        );

        if (!pedidoItem) {
          listaFormatada.push({
            pedido: {
              id: pedido.id,
              valor_total: pedido.valor_total,
              observacao: pedido.observacao,
              cliente_id: pedido.cliente_id,
            },
            pedido_produtos: [
              {
                id: pedido.item_id,
                quantidade_produto: pedido.quantidade_produto,
                valor_produto: pedido.valor_produto,
                pedido_id: pedido.pedido_id,
                produto_id: pedido.produto_id,
              },
            ],
          });
        } else {
          pedidoItem.pedido_produtos.push({
            id: pedido.item_id,
            quantidade_produto: pedido.quantidade_produto,
            valor_produto: pedido.valor_produto,
            pedido_id: pedido.pedido_id,
            produto_id: pedido.produto_id,
          });
        }
      });

      return res.status(200).json(listaFormatada);
    } catch (error) {
      console.log(error, req.query.cliente_id);
      return res.status(500).json({ error: error.message });
    }
  },
};
module.exports = controladoresPedidos;
