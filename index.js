const express = require('express')
const db = require('./db.js')
const user_db = require("./user_auth.js")
require('dotenv').config()
const session = require('express-session')

const app = express()

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}))
app.use((req, res, next) => {
    console.log('Session userID:', req.session.userID);
    next();
});

// Get
app.get("/", (req, res) =>{
    var posts = db.get_all_db()
    res.render("index", { posts: posts })
})

app.get("/form", (req, res) =>{
    res.render("add_post")
})

app.get("/answers/:id", (req, res) => {
    var answers = db.get_answers(req.params.id)
    if (typeof answers == 'string') {
        res.render("error", { "err": answers })
    } else {
        res.render("answers", { answers: answers, id: req.params.id })
    }
})

app.get("/about", (req, res) => {
    res.render("about")
})

app.get("/registr", (req, res) => {
    res.render("registr")
})

app.get("/sign_in", (req, res) => {
    res.render('sign_in')
})


// Post
app.post("/answers/:id", (req, res) => {
    db.add_answer(req.params.id, req.body.body)
    res.redirect(`/answers/${req.params.id}`)
})

app.post("/posts/add", (req, res) =>{
    if (req.body.title == "" || req.body.body == ""){
        res.render("error", { "err": "Неправильно заполнены поля"})
    } else if (req.body.title == " " || req.body.body == " "){
        res.render("error", { "err": "Неправильно заполнены поля"})
    } else{
        const authorID = req.session.userID
        if (authorID == undefined) {
            res.redirect('/sign_in')
        } else {
            const authorName = user_db.get_data_withID(authorID).username
            db.add_post(req.body.title, req.body.body, authorName)
            res.redirect('/')
        }
    }
})

app.post("/user/add", (req, res) => {
    const user = user_db.add_user(req.body.name, req.body.username, req.body.password)
    if (user == true) {
        res.redirect('/')
    } else {
        res.render('error', { "err": user })
    }
})

app.post("/user/sign_in", (req, res) => {
    const result = user_db.sign_in(req.body.username, req.body.password)
    if (result == "Данного пользователя несуществует" || result == 'Неправильно введён пароль') {
        res.render('error', { "err": result })
    } else {
        req.session.userID = result.id
        res.send(`${ req.session.userID }`)
    }
})


app.listen('3000', () =>{
    console.log('http://127.0.0.1:3000')
})