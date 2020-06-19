const mongoose = require('mongoose')

// marked permite converter o Markdown em HTML. Markdown é um formato de texto simples, 
//cujo objetivo é ser muito fácil de ler e escreve
const marked = require('marked')

//O “slug” é tudo o que vem depois da última “/” no caminho e geralmente 
//identifica o arquivo ou a página da Web
const slugify = require('slugify')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)

const artigoSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    desc: {
        type: String
    },
    marc: {
        type: String,
        required: true
    },
    data_artigo: {
        type: Date,
        default: Date.now()
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    sanitizedHtml: {
        type: String,
        required: true
    }
})

//validando o slug no campo name "titulo"
artigoSchema.pre('validate', function (next) {
    if (this.titulo) {
        this.slug = slugify(this.titulo, { lower: true, strinct: true })
    }
    //sanitize-html é adequado para limpar fragmentos de HTML, 
    //como os criados pelo ckeditor e outros editores de rich text. É especialmente 
    //útil para remover CSS indesejados ao copiar e colar do Word.
    //validando no campo name "marc"
    if (this.marc) {
        this.sanitizedHtml = dompurify.sanitize(marked(this.marc))
    }

    next()
})

module.exports = mongoose.model('Artigo', artigoSchema)