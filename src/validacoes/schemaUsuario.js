const joi = require("joi");

const email = joi.string().email().required().messages({
  "string.email": "Formato de email inválido.",
  "any.required": "O campo email é obrigatório.",
  "string.empty": "O campo email é obrigatório.",
});
const nome = joi.string().required().messages({
  "any.required": "O campo nome é obrigatório.",
  "string.empty": "O campo nome é obrigatório.",
});
const senha = joi.string().required().messages({
  "any.required": "O campo senha é obrigatório",
  "string.empty": "O campo senha é obrigatório",
});

const schemaUsuario = joi.object({ nome, email, senha });
const schemaLoginUsuario = joi.object({ email, senha });

module.exports = {
  schemaUsuario,
  schemaLoginUsuario,
};
