module.exports = usersTable = (newDb) => {
    newDb.prepare(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        username VARCHAR(50) NOT NULL, 
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        full_name VARCHAR(100),
        gender ENUM("M","F","O") DEFAULT "O",
        date_of_birth DATE
        )`
    ).run();
}