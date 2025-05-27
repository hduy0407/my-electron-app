const Database = require('better-sqlite3');
const newDb = new Database('my-app.db');


const usersTable = require('./tables/users');
usersTable(newDb);

const postsTable = require('./tables/posts');
postsTable(newDb);

module.exports = newDb;