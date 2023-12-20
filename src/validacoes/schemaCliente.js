const joi = require("joi");

const schemaCliente = joi.object({
  nome: joi.string().required().messages({
    "any.required": "O campo nome é obrigatório.",
    "string.empty": "O campo nome é obrigatório.",
  }),
  email: joi.string().email().required().messages({
    "string.email": "Formato de email inválido.",
    "any.required": "O campo email é obrigatório.",
    "string.empty": "O campo email é obrigatório.",
  }),
  cpf: joi.string().length(11).required().messages({
    "string.length": "O campo cpf deve ter 11 dígitos",
    "any.required": "O campo cpf é obrigatório.",
    "string.empty": "O campo cpf é obrigatório.",
  }),
  cep: joi.string(),
  rua: joi.string(),
  numero: joi.string(),
  bairro: joi.string(),
  cidade: joi.string(),
  estado: joi.string(),
});

module.exports = schemaCliente;
