// Importa o pacote express e coloca na variável express
const express = require("express");
// Importa o pacote cors e coloca na variável cors
// CORS (Cross-Origin Resource Sharing)
const cors = require("cors");
// Importa as funções exportadas do módulo usuario
const { cadastrarUsuario, login } = require("./controladores/usuario");
// Importa as funções exportadas do módulo questao
const { listarQuestao } = require("./controladores/questao");
// Importa as funções exportadas do módulo questionario
const { salvarQuestionario, listarQuestionario } = require("./controladores/questionario");
// Importa o pacote dotenv e coloca na variável dotenv
const dotenv = require("dotenv");
// Carregar as variáveis de ambiente do arquivo .env no objeto process.env do Node
// O arquivo .env precisa estar na raiz do projeto
dotenv.config();

// Será usado 3000 se a variável de ambiente não tiver sido definida
const PORTA = process.env.PORTA || 3000;
// Cria o servidor e coloca na variável app
const app = express(); 
// Configura o servidor para receber requisições de qualquer domínio
app.use(cors());
// Configura o servidor para suportar parâmetros JSON no body da requisição
app.use(express.json());
// Inicializa o servidor na porta especificada
app.listen(PORTA, () => {
    console.log(`Rodando na porta ${PORTA}...`);
});

// Rota para efetuar cadastro
app.post("/usuario", cadastrarUsuario);

// Rota para fazer o login
app.post("/login", login);

// Rota para listar as questões
app.get("/questao", listarQuestao);

// Rota para salvar questionário
app.post("/questionario", salvarQuestionario);

// Rota para resgatar o questionário
app.get("/questionario", listarQuestionario);

app.use(function(req,res){
    res.json({erro:"Rota desconhecida"});
});