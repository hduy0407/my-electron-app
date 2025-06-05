const createPostsTable = (newDb) => {
    newDb.prepare(`CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
        )`
    ).run();
}

const postPost = (newDb, postData) => {
    newDb.prepare(`INSERT INTO posts (user_id, content) VALUES (?, ?)`)
        .run(postData);
}

const getPosts = (newDb) => {
    return newDb.prepare(`SELECT * FROM posts`).all();
}

const getPostById = (newDb, postId) => {
    return newDb.prepare(`SELECT * FROM posts WHERE id = ?`).get(postId);
}

module.exports = {createPostsTable, postPost, getPosts, getPostById};