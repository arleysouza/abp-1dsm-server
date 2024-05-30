const { pool } = require("./bd.js");

async function listarQuestao(req, res) {
  // retorna 4 questões aleatórias
  const resposta = await pool.query(
    `SELECT idquestao, enunciado 
     FROM tbquestao 
     ORDER BY RANDOM() 
     LIMIT 4`
  );

  return res.json(resposta.rows);
}

// Exporta as funções
module.exports = { listarQuestao };
