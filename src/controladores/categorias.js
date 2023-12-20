const knex =  require("../conexao")
const listarCategorias = async (req, res) => {
    
    const categorias = await knex("categorias").select("*");
    
    return res.status(200).json(categorias)
}

module.exports = listarCategorias;