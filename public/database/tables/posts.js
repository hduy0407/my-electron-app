module.exports = postsTable = (newDb) => {
    newDb.prepare(`CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        user_id STRING NOT NULL, 
        content STRING NOT NULL, 
        )`
    ).run();
}


