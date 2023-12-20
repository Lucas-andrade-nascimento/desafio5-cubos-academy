const knex = require("../conexao");
const bcrypt = require("bcrypt");

const usuariosControladores = {
  async cadastrarUsuario(req, res) {
    try {
      const { nome, email, senha } = req.body;

      const usuarioExiste = await knex("usuarios").where({ email }).first();

      if (usuarioExiste) {
        return res
          .status(400)
          .json("Já existe um usuario cadastrado com esse email.");
      }

      const senhaCriptografada = await bcrypt.hash(senha, 10);

      const usuario = await knex("usuarios")
        .insert({
          nome,
          email,
          senha: senhaCriptografada,
        })
        .returning(["id","nome","email"]);

      if (!usuario) {
        return res.status(404).json("Usuario não foi cadastrado.");
      }

      res.status(201).json(usuario[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async detalharUsuario(req, res) {
    try {
      return res.status(200).json(req.usuario);
    } catch (error) {
      return res.status(500).json({ Error: error.message });
    }
  },

  async editarUsuario(req, res) {
    try {
      const { nome, email, senha } = req.body;
      const { id } = req.usuario;
      const senhaCriptografada = await bcrypt.hash(senha, 10);

      const usuarioExiste = await knex("usuarios").where({ email }).first();

      if (usuarioExiste) {
        return res
          .status(400)
          .json("Já existe um usuario cadastrado com esse email.");
      }
      const usuarioEditado = await knex("usuarios")
        .update({ nome, email, senha: senhaCriptografada })
        .where({ id }).returning(["id","nome","email"]);

      return res.status(201).json(usuarioEditado[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = usuariosControladores;
