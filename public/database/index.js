const path = require('path');
const { app } = require('electron');
const Database = require('better-sqlite3');


const dbPath = path.join(app.getPath('userData'), 'my-app.db');
const newDb = new Database(dbPath);

const usersTable = require('./tables/users');
usersTable(newDb);

const postsTable = require('./tables/posts');
postsTable(newDb);

module.exports = newDb;
