const Database = require('better-sqlite3');
const db = new Database('posts.db');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt')


const salt_rounds = 10

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id TEXT,
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
            INSERT INTO users (id, name, username, password) VALUES (?, ?, ?, ?)
        `)
        if (username.startsWith('@') && username.length < 40) {
            var user_id = String(uuidv4())
            bcrypt.hash(password, salt_rounds, (err, this_hash) => {
                const info = insert.run(user_id, name, username, this_hash)
            })
            return true
        } else {
            return 'Поля заполнены неправильно'
        }
    } else {
        return 'Пользователь с таким логином уже существует'
    }
}

// Войти
function sign_in(username, password){
    const if_this_user_exist = db.prepare('SELECT username FROM users WHERE username = ?').get(username)
    if (if_this_user_exist == undefined) {
        return 'Данного пользователя несуществует'
    } else {
        const userData = db.prepare('SELECT * FROM users WHERE username = ?').get(username)
        const result = bcrypt.compareSync(password, userData.password)
        if (result) {
            return userData
        } else {
            return 'Неправильно введён пароль'
        }
    }
}

// Проверка наличия id
function get_data_withID(id){
    const data = db.prepare('SELECT * FROM users WHERE id = ?').get(id)
    return data
}

// Найти автора по айди
function get_author_byID(id) {
    if (id == undefined) {
        return 'Некоректный id'
    } else {
        const get = db.prepare('SELECT * FROM users WHERE id = ?').get(id)
        return get
    }
}

module.exports = {
    db,
    add_user,
    sign_in,
    get_data_withID,
    get_author_byID
}