const joi = require("joi");

const schemaPedidos = joi.object({
  cliente_id: joi.number().required().messages({
    "any.required": "O campo cliente_id é obrigatório.",
    "number.empty": "O campo cliente_id é obrigatório",
  }),
  pedido_produtos: joi.array().items(
    joi.object({
      produto_id: joi.number().integer().min(1).required().messages({
        "any.required": "O campo produto_id é obrigatório.",
        "number.base": "O campo produto_id precisa ser um número válido.",
        "number.min": "O campo produto_id precisa ser maior ou igual a 1.",
      }),
      quantidade_produto: joi.number().integer().min(1).required().messages({
        "any.required": "O campo quantidade_produto é obrigatório.",
        "number.base": "O campo quantidade_produto precisa ser um número válido.",
        "number.integer":
        "O campo quantidade_produto precisa ser um número maior ou igual a 1.",
      }),
    })
  ),
  observacao: joi.string(),
});

module.exports = schemaPedidos;
