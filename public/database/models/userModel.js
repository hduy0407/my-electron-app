const db = require('../index.js');

function getAllUsers() {
    const stmt = db.prepare('SELECT * FROM users');
    return stmt.all();
}

function getUseryId(id) {
    const stmt = db.prepare('SELECT * FROM users where id = ?');
    return stmt.get(id);
}

function createUser(username, password, email) {
    const stmt = db.prepare('INSERT INTO users (username, password, email) VALUES (?, ?, ?)');
    return stmt.run(username, password, email);
}

function updateUser(id, username, password, email) {
    const stmt = db.prepare('UPDATE users SET username = ?, password = ?, email = ? WHERE id = ?');
    return stmt.run(username, password, email, id);
}

module.exports = {
    getAllUsers,
    getUseryId,
    createUser,
    updateUser
};