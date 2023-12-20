const joi = require("joi");

const schemaProduto = joi.object({
  descricao: joi.string().required().messages({
    "any.required": "O campo descricao é obrigatório.",
    "string.empty": "O campo descricao é obrigatório",
  }),
  quantidade_estoque: joi.number().integer().min(0).required().messages({
    "any.required": "O campo quantidade_estoque é obrigatório.",
    "number.base": "O campo quantidade_estoque precisa ser um número válido.",
    "number.integer":
      "O campo quantidade_estoque precisa ser um número inteiro.",
    "number.min": "O campo quantidade_estoque precisa ser maior ou igual a 0.",
  }),
  valor: joi.number().min(1).required().messages({
    "any.required": "O campo valor é obrigatório.",
    "number.base": "O campo valor precisa ser um número válido.",
    "number.min": "O campo valor precisa ser maior que 0.",
  }),
  categoria_id: joi.number().integer().required().messages({
    "any.required": "O campo categoria_id é obrigatório.",
    "number.base": "O campo categoria_id precisa ser um número válido.",
    "number.integer": "O campo categoria_id precisa ser um número inteiro.",
  }),
});

module.exports = schemaProduto;
