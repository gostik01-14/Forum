const Database = require('better-sqlite3');
const db = new Database('posts.db');

db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        body TEXT NOT NULL,
        author TEXT NOT NULL,
        answers TEXT[]
    )
`);

function add_post(title, body, author) {
    var answers = ''
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
        const answers = get.answers.split(',')
        return answers
    }
}

function add_answer(id, comment) {
    const insert = db.prepare(`
        UPDATE posts 
        SET answers = CONCAT(answers, ',', ?) 
        WHERE id = ?
    `).run(comment, id);
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
    add_answer
}