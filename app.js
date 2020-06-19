//Todos os modulos depentendes para o funcionamento do projeto
const express = require('express');
const app = express();
const mongoose = require('mongoose')
const Artigo = require('./models/M_Artigos')
const rota_artigos = require('./routes/artigos')
const methodOverride = require('method-override')

/*Mangoose
Conectar o Mongoose com o banco de dados(blog) que o MongoDB define
quando você o inicializa pelo console e vamos garantir que qualquer erro 
de conexão seja impresso no console.
*/



//local mongodb://localhost/blog
//atlas mongodb+srv://<artigo>:<artigo>@cluster0-apu8k.mongodb.net/<dbname>?retryWrites=true&w=majority
mongoose.connect('mongodb+srv://artigo:artigo@cluster0-apu8k.mongodb.net/<dbname>?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => console.log("Conectado com sucesso"))
.catch(e => console.log(e))



/*
O EJS é uma engine de visualização, com ele conseguimos de uma 
maneira fácil e simples transportar dados do back-end para o front-end, 
basicamente conseguimos utilizar códigos em javascript no html de nossas páginas.
*/
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))

/*
 usamos o pacote method-override, que podemos de uma 
 maneira muito fácil adicionar no final da URL o _method que está no action do form.
 Exemplo: action="/artigos/<%= artigo.id %>?_method=DELETE"
*/
app.use(methodOverride('_method'))

/*Public
Para entregar arquivos estáticos como imagens, arquivos CSS, e 
arquivos JavaScript, use a função de middleware express.static integrada no Express.
*/
app.use(express.static(__dirname + '/public'))

//Listando todos os artigos na pagina principal por data decrecente
app.get('/', async (req, res) => {
    const artigos = await Artigo.find().sort({data_artigo: 'desc'})
    res.render('index', { artigos: artigos })
})

//Rota que leva para a pagina restrita dos artigos
app.use('/artigos', rota_artigos)

//Em seguida temos que informar o servidor para escutar uma porta.
//Abaixo foi chamado o método listen(3000)
app.listen(3000, ()=>{
    console.log("server online")
})
