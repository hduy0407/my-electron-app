const usersTable = (newDb) => {
    newDb.prepare(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        full_name TEXT,
        gender TEXT CHECK (gender IN ('M', 'F', 'O')) DEFAULT 'O',
        date_of_birth TEXT
    )`).run();
};

module.exports = usersTable;