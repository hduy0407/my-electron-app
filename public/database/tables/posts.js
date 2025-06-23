const createPostsTable = (db) => {
    db.prepare(`CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
        )`
    ).run();
}

const postPost = (db, postData) => {
    newDb.prepare(`INSERT INTO posts (user_id, content) VALUES (?, ?)`)
        .run(postData);
}

const getPosts = (db) => {
    return newDb.prepare(`SELECT * FROM posts`).all();
}

const getPostById = (db, postId) => {
    return newDb.prepare(`SELECT * FROM posts WHERE id = ?`).get(postId);
}

module.exports = {createPostsTable, postPost, getPosts, getPostById};