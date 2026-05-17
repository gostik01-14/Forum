const Database = require('better-sqlite3');
const db = new Database('posts.db');

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        username TEXT,
        password TEXT
    )
`);

// Зарегистрироваться
function add_user(name, username, password) {
    const if_this_user_exist = db.prepare('SELECT username FROM users WHERE username = ?').get(username)
    if (if_this_user_exist == undefined) {
        const insert = db.prepare(`
            INSERT INTO users (name, username, password) VALUES (?, ?, ?)
        `)
        if (username.startsWith('@') && username.length < 40) {
            const info = insert.run(name, username, password)
            return true
        } else {
            return 'Поля заполнены неправильно'
        }
    } else {
        return 'Пользователь с таким логином уже существует'
    }
}

// Войти
function sign_in(name, username, password){
    const if_this_user_exist = db.prepare('SELECT username FROM users WHERE username = ?').get(username)
    if (if_this_user_exist == undefined) {
        return 'Данного пользователя несуществует'
    } else {
        const correct_password = db.prepare('SELECT password FROM users WHERE username = ?').get(username)
        if (password != correct_password) {
            return 'Неправильно введён пароль'
        } else {
            const data = db.prepare('SELECT * FROM users WHERE username = ?').get(username)
            return data
        }
    }
}

module.exports = {
    db,
    add_user,
    sign_in
}