const express = require("express");
require("dotenv").config();
const rotas = require("./rotas/rotas");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
app.use(rotas);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Servidor em pé na porta ${port}`);
});
