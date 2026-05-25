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
        res.render("error")
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

app.get("/user/:id", (req, res) => {
    const check = user_db.check_id(req.params.id);
    if (!check) {
        res.redirect("/");
    } else {
        req.session.userID = check.id
        res.redirect('/')
    }
})


// Post
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

app.post("/user/add", (req, res) => {
    const user = user_db.add_user(req.body.name, req.body.username, req.body.password)
    if (user == true) {
        res.redirect('/')
    } else {
        res.render('error')
    }
})

app.post("/user/sign_in", (req, res) => {
    const result = user_db.sign_in(req.body.name, req.body.username, req.body.password)
    if (result == false) {
        res.render('error')
    } else {
        res.redirect(`/user/${ result.id }`)
    }
})


app.listen('3000', () =>{
    console.log('http://127.0.0.1:3000')
})