const express = require('express')
const db = require('./db.js')

const app = express()

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))


app.get("/", (req, res) =>{
    var posts = db.get_all_db()
    res.render("index", { posts: posts })
})

app.get("/form", (req, res) =>{
    res.render("add")
})

app.get("/answers/:id", (req, res) => {
    var answers = db.get_answers(req.params.id)
    if (typeof answers == 'string') {
        res.render("error")
    } else {
        res.render("answers", { answers: answers, id: req.params.id })
    }
})

app.get("/about", (req, res) => {
    res.render("about")
})

app.post("/answers/:id", (req, res) => {
    db.add_answer(req.params.id, req.body.body)
    res.redirect(`/answers/${req.params.id}`)
})

app.post("/posts/add", (req, res) =>{
    if (req.body.title == "" || req.body.body == "" || req.body.author == ""){
        res.render("error")
    } else if (req.body.title == " " || req.body.body == " " || req.body.author == " "){
        res.render("error")
    } else{
        db.add_post(req.body.title, req.body.body, req.body.author)
        res.redirect('/')
    }
})


app.listen('3000', () =>{
    console.log('http://127.0.0.1:3000')
})