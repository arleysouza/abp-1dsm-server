const { pool } = require("./bd.js");

async function cadastrarUsuario(req, res) {
  // Desestrutura as propriedades mail e nome
  // do objeto JSON que está no body da requisição HTTTP
  const { mail, nome } = req.body;
  if (!mail || mail.length == 0) {
    return res.json({ erro: "Forneça o e-mail." });
  } else if (!nome || nome.length == 0) {
    return res.json({ erro: "Forneça o nome." });
  } else {
    // Antes de criar um novo usuário, vamos ver se o e-mail já existe
    let resposta = await pool.query(
      "SELECT idusuario,mail,nome FROM tbusuario WHERE mail=$1 LIMIT 1",
      [mail]
    );
    // Verifica se o usuário existe na tbusuario
    if (resposta.rowCount > 0) {
      // retorna o usuário já existe na tbusuario
      return res.json(resposta.rows[0]);
    } else {
      // Insere um registro na tbusuario
      resposta = await pool.query(
        "INSERT INTO tbusuario(mail,nome) VALUES ($1,$2) RETURNING idusuario, mail, nome",
        [mail, nome]
      );
      // Retorna o registro inserido no formato JSON
      return res.json(resposta.rows[0]);
    }
  }
}

async function login(req, res) {
  const { mail } = req.body;
  if (!mail || mail.length == 0) {
    return res.json({ erro: "Forneça o e-mail." });
  } else {
    // Procura na tbusuario o 1o registro que satisfaz as condições
    let resposta = await pool.query(
      "SELECT idusuario,mail,nome FROM tbusuario WHERE mail=$1 LIMIT 1",
      [mail]
    );
    // Verifica se o usuário existe na tbusuario
    if (resposta.rowCount > 0) {
      // Retorna o registro no formato JSON
      return res.json(resposta.rows[0]);
    } else {
      return res.json({ erro: "Usuário não cadastrado." });
    }
  }
}

// Exporta as funções
module.exports = { cadastrarUsuario, login };
