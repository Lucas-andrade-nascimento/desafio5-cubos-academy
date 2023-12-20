const knex = require("../conexao");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const senhaSistema = process.env.JWT_PASS;

const login = async (req, res) => {
    const { email, senha } = req.body;

    try {
      const usuario = await knex("usuarios").select("*").where({ email });

      if (usuario.length === 0) {
        return res
          .status(400)
          .json({ mensagem: "Usuário e/ou senha inválido(s)." });
      }

      const senhaValida = await bcrypt.compare(senha, usuario[0].senha);

      if (!senhaValida) {
        return res
          .status(400)
          .json({ mensagem: "Usuário e/ou senha inválido(s)." });
      }

      const token = jwt.sign({ id: usuario[0].id }, senhaSistema, {
        expiresIn: "8h",
      });

      const { senha: _, ...usuarioLogado } = usuario[0];

      return res.status(201).json({ usuario: usuarioLogado, token });
    } catch (error) {
      return res.status(500).json({ Error: error.message });
    }
  };

  module.exports = login;