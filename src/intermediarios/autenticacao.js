const knex = require("../conexao");
const jwt = require("jsonwebtoken");
const senhaSistema = process.env.JWT_PASS;

const autenticaUsuario = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      mensagem:
        "Para acessar este recurso um token de autenticação válido deve ser enviado.",
    });
  }
  const token = authorization.split(" ")[1];

  try {
    const { id } = jwt.verify(token, senhaSistema);
    const usuario = await knex("usuarios")
      .select("id", "nome", "email")
      .where({ id });

    if (usuario.length === 0) {
      return res.status(404).json({ mensagem: "Usuario não encontrado" });
    }
    req.usuario = usuario[0];

    next();
  } catch (error) {
    if (
      error.message === "invalid token" ||
      error.message === "jwt malformed" ||
      error.message === "jwt must be provided" ||
      error.message === "jwt expired" ||
      error.message === "invalid signature"
    ) {
      return res.status(401).json({
        mensagem:
          "Para acessar este recurso um token de autenticação válido deve ser enviado.",
      });
    }
    
    return res.status(500).json({ mensagem: "Erro de servidor" });
  }
};

module.exports = { autenticaUsuario };
