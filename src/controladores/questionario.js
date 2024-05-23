const { pool } = require("./bd.js");

async function listarQuestionario(req, res) {
  // obtém o idusuario passado pelo body da requisição
  const {idusuario} = req.body;

  if( !idusuario ){
    return res.json({ erro: "Forneça os seus dados" });
  }

  // retorna 4 questões aleatórias
  let resposta = await pool.query(
    `SELECT a.idquestionario, a.datahorario, a.nota,
            c.enunciado, b.acertou 
     FROM tbquestionario as a, tbquestao_por_questionario as b, tbquestao as c
     WHERE a.idusuario = $1 
        AND a.idquestionario = b.idquestionario
        AND b.idquestao = c.idquestao`,
     [idusuario]
  );
  return res.json(resposta.rows);
}

async function salvarQuestionario(req,res){
  const {idusuario,questoes} = req.body;
  return res.json("resposta");
}

// Exporta as funções
module.exports = { listarQuestionario, salvarQuestionario };
