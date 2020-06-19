const express = require('express')

//Criar as rotas
const rota = express.Router()

//chamar o modulo do artigo
const Artigo = require('../models/M_Artigos')

//Redireciona para a pagina principal se  digitar http://localhost:3000/artigos direto na URL
rota.get('/', (req, res)=>{
    res.redirect('/')
})


rota.get('/novo', (req, res) => {
    res.render('artigos/novo', { artigo: new Artigo() })
})

//Rota que pega o parametro da pagina de edição
rota.get('/edit/:id', async (req, res) => {
    const artigo = await Artigo.findById(req.params.id)
    res.render('artigos/edit', { artigo: artigo })
})

//Rota responsavel para exibe o slug pela URL (parametro)
rota.get('/:slug', async (req, res) => {
    const artigo = await Artigo.findOne({ slug: req.params.slug })
    if (artigo == null) res.redirect('/')
    res.render('artigos/show', { artigo: artigo })
})

//Rota que leva para a pagina restrita caso os dados abaixo for verdadeiro
rota.post('/', async (req, res, next) => {
    const email = req.body.email
    const senha = req.body.password
    if(email === 'w@w' && senha === '123'){
        const artigos = await Artigo.find().sort({data_artigo: 'desc'})
        res.render('artigos', { artigos: artigos })
    }
    else{
        res.redirect('/')
    }
    req.artigo = new Artigo()
    next()
}, salvarArtido_Redirecionar('novo'))

//Rota para editar um artigo
rota.put('/:id', async (req, res, next) => {
    req.artigo = await Artigo.findById(req.params.id)
    next()
}, salvarArtido_Redirecionar('edit'))

//Rota para deletar um artigo
rota.delete('/:id', async (req, res) => {
    await Artigo.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

//Função para salvar os dados no banco de dados
function salvarArtido_Redirecionar(path) {
    return async (req, res) => {
        let artigo = req.artigo
        artigo.titulo = req.body.titulo
        artigo.desc = req.body.desc
        artigo.marc = req.body.marc

        try {
            artigo = await artigo.save()
            res.redirect(`/artigos/${artigo.slug}`)
        } catch (e) {
            res.render(`artigos/${path}`, { artigo: artigo }
            )
        }
    }
}



module.exports = rota