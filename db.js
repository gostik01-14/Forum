const Database = require('better-sqlite3');
const db = new Database('posts.db');

db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        body TEXT NOT NULL,
        author TEXT NOT NULL,
        tags TEXT,
        answers TEXT,
        likes TEXT
    )
`);

function add_post(title, body, author, tags) {
    var answers = '[]'
    var likes = '[]'
    const insert = db.prepare(`
        INSERT INTO posts (title, body, author, answers, tags, likes) VALUES (?, ?, ?, ?, ?, ?)
    `)
    const info = insert.run(title, body, author, answers, tags, likes)
}

function delete_post(id) {
    const get = db.prepare('DELETE FROM posts WHERE id = ?').run(id)
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
    for (var i = 0; i <= allPosts.length - 1; i++) {
        if (allPosts[i].tags == null) {
            continue
        } else {
            allPosts[i].tags = allPosts[i].tags.split(",")
        }
    }
    return allPosts;
}

function add_like(id, author) {
    var obj_like = {
        author: author,
    }
    const get = db.prepare('SELECT * FROM posts WHERE id = ?').get(id)
    var arr_likes = JSON.parse(get.likes)
    arr_likes.push(obj_like)
    const ready_likes = JSON.stringify(arr_likes)
    const insert = db.prepare(`
        UPDATE posts 
        SET likes = ?
        WHERE id = ?
    `).run(ready_likes, id);
}

function delete_like(id, author) {
    var obj_like = {
        author: author,
    }
    const get = db.prepare('SELECT * FROM posts WHERE id = ?').get(id)
    var arr_likes = JSON.parse(get.likes)
    const index = arr_likes.indexOf(obj_like);
    if (index != -1) {
        arr_likes.splice(index, 1);
    } else {
        return "Пользователь не ставил like"
    }
    const ready_likes = JSON.stringify(arr_likes)
    const insert = db.prepare(`
        UPDATE posts 
        SET likes = ?
        WHERE id = ?
    `).run(ready_likes, id);
}

function is_user_liked(id, author) {
    var obj_like = {
        author: author,
    }
    const get = db.prepare('SELECT * FROM posts WHERE id = ?').get(id)
    var arr_likes = JSON.parse(get.likes)
    const index = arr_likes.indexOf(obj_like);
    if (index != -1) {
        return true
    } else {
        return false
    }
}


module.exports = {
    db,
    get_all_db,
    add_post,
    get_answers,
    add_answer,
    get_all_withID,
    delete_post,
    add_like,
    delete_like,
    is_user_liked
}