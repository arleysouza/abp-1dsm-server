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
            c.enunciado, b.resposta 
     FROM tbquestionario as a, tbquestao_por_questionario as b, tbquestao as c
     WHERE a.idusuario = $1 
        AND a.idquestionario = b.idquestionario
        AND b.idquestao = c.idquestao`,
     [idusuario]
  );
  return res.json(resposta.rows);
}

/*
Padrão de requisição para cadastrar um questionário
{
  "idusuario":1,
  "questoes": [
    {"idquestao":2,"resposta":false},
    {"idquestao":5,"resposta":true},
    {"idquestao":10,"resposta":true},
    {"idquestao":15,"resposta":false}
  ]
}
*/
async function salvarQuestionario(req,res){
  const {idusuario,questoes} = req.body;

  if( !idusuario ){
    return res.json({ erro: "Forneça os seus dados" });
  }

  if( !questoes || questoes.length == 0 ){
    return res.json({ erro: "Foneça as questões do questionário" });
  }

  // Verifica se o usuário já tem algum questionário com nota >= 70
  let resposta = await pool.query(
    `SELECT nota::float
     FROM tbquestionario
     WHERE idusuario = $1 AND nota >= 70`,
     [idusuario]
  );
  
  if( resposta.rowCount > 0 && resposta.rows[0].nota > 0 ){
    return res.json({ erro: `Você não pode responder o questionário novamente. Você já foi aprovado com nota ${resposta.rows[0].nota}` });
  }

  // Calcula a nota nas questões
  let soma = 0;
  for( let i = 0; i < questoes.length; i++ ){
    // Obtém a nota na questão 0 ou 1
    resposta = await pool.query(
      `SELECT count(*)::INTEGER 
       FROM tbquestao
       WHERE idquestao = $1 AND resposta = $2`,
       [questoes[i].idquestao, questoes[i].resposta]
    );
    soma += resposta.rows[0].count;
  }

  // Obtém a média de acertos
  let nota = soma / questoes.length * 100;

  if( nota >= 70 ){
    // Cria o questionário
    const respostaQuestionario = await pool.query(
      "INSERT INTO tbquestionario(idusuario,nota) VALUES ($1,$2) RETURNING idquestionario,datahorario,nota",
      [idusuario, nota]
    );
    const idquestionario = respostaQuestionario.rows[0].idquestionario;
    if( idquestionario ){
      // Salva cada questão
      for( let i = 0; i < questoes.length; i++ ){
        respostaQuestao = await pool.query(
          "INSERT INTO tbquestao_por_questionario(idquestionario,idquestao,resposta) VALUES ($1,$2,$3) RETURNING idquestionario,idquestao,resposta",
          [idquestionario,questoes[i].idquestao, questoes[i].resposta]
        );
      }
      return res.json(respostaQuestionario.rows[0]);
    }
    else{
      return res.json({erro:"Problemas para salvar o questionário"});
    }
  }
  else{
    return res.json({nota});
  }
  
}

// Exporta as funções
module.exports = { listarQuestionario, salvarQuestionario };
