const { pool } = require("./bd.js");

const dotenv = require("dotenv");
dotenv.config();

async function listarQuestao(req, res) {
  const quantidade = process.env.QUANTIDADE;

  const { idusuario } = req.body;
  if (idusuario) {
    // verifica se o usuário possui questionário respondido com nota >= 70%
    let resposta = await pool.query(
      `SELECT idquestionario, datahorario, nota
      FROM tbquestionario
      WHERE idusuario = $1`,
      [idusuario]
    );
    if (resposta.rowCount > 0) {
      return res.json(resposta.rows[0]);
    } else {
      // retorna questões aleatórias
      resposta = await pool.query(
        `SELECT idquestao, enunciado 
        FROM tbquestao 
        ORDER BY RANDOM() 
        LIMIT $1`,
        [quantidade]
      );

      return res.json(resposta.rows);
    }
  } else {
    return res.json({ erro: "Efetue o login para continuar." });
  }
}

// Exporta as funções
module.exports = { listarQuestao };
