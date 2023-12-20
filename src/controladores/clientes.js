const knex = require("../conexao");

const controladoresCliente = {
  async cadastrarCliente(req, res) {
    try {
      const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } =
        req.body;

      const clienteExiste = await knex("clientes")
        .where({ email })
        .orWhere({ cpf })
        .first();

      if (clienteExiste) {
        return res
          .status(400)
          .json("Já existe um usuario cadastrado com esse email e/ou cpf.");
      }

      const cliente = await knex("clientes")
        .insert({
          nome,
          email,
          cpf,
          cep,
          rua,
          numero,
          bairro,
          cidade,
          estado,
        })
        .returning("*");
      if (!cliente) {
        return res.status(404).json("Cliente não foi cadastrado.");
      }

      res.status(201).json(cliente[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async editarCliente(req, res) {
    try {
      const { id } = req.params;
      const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } =
        req.body;

      const idClienteExiste = await knex("clientes").where({ id }).first();

      if (!idClienteExiste) {
        return res.status(404).json("Cliente não existe para o id informado.");
      }

      const clienteExiste = await knex("clientes")
        .where({ email })
        .orWhere({ cpf })
        .first();

      if (clienteExiste) {
        return res
          .status(400)
          .json("Já existe um usuario cadastrado com esse email e/ou cpf.");
      }

      const clienteEditado = await knex("clientes")
        .update({
          nome,
          email,
          cpf,
          cep,
          rua,
          numero,
          bairro,
          cidade,
          estado,
        })
        .where({ id })
        .returning("*");

      res.status(200).json(clienteEditado[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async listarClientes(req, res) {
    try {
      const clientes = await knex("clientes");

      res.status(200).json(clientes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async detalharCliente(req, res) {
    try {
      const { id } = req.params;
      const cliente = await knex("clientes").where({ id }).first();

      if (!cliente) {
        return res
          .status(404)
          .json("Cliente não encontrado para id informado.");
      }

      res.status(200).json(cliente);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = controladoresCliente;
