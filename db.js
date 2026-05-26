const Database = require('better-sqlite3');
const db = new Database('posts.db');

db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        body TEXT NOT NULL,
        author TEXT NOT NULL,
        answers TEXT
    )
`);

function add_post(title, body, author) {
    var answers = '[]'
    const insert = db.prepare(`
        INSERT INTO posts (title, body, author, answers) VALUES (?, ?, ?, ?)
    `)
    const info = insert.run(title, body, author, answers)
}

function get_answers(id) {
    const get = db.prepare('SELECT answers FROM posts WHERE id = ?').get(id)
    if (get == undefined){
        return 'Страница не найдена'
    } else {
        const answers = JSON.parse(get.answers)
        return answers
    }
}

function get_all_withID(id) {
    const get = db.prepare('SELECT * FROM posts WHERE id = ?').get(id)
    return get
}

function add_answer(id, comment, author) {
    var obj_answer = {
        author: author,
        content: comment
    }
    const get = db.prepare('SELECT * FROM posts WHERE id = ?').get(id)
    var arr_answers = JSON.parse(get.answers)
    arr_answers.push(obj_answer)
    const ready_answers = JSON.stringify(arr_answers)
    const insert = db.prepare(`
        UPDATE posts 
        SET answers = ?
        WHERE id = ?
    `).run(ready_answers, id);
}

function get_all_db() {
    const allPosts = db.prepare('SELECT * FROM posts').all();
    return allPosts;
}

module.exports = {
    db,
    get_all_db,
    add_post,
    get_answers,
    add_answer,
    get_all_withID
}