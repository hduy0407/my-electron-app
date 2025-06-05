const path = require('path');
const { app } = require('electron');
const Database = require('better-sqlite3');

const createUsersTable = require('./tables/users');
const createPostsTable = require('./tables/posts');

function initializeDatabase() {
    // Check if the database file exists, if not, create it
    const dbPath = path.join(app.getPath('userData'), 'my-app.db');
    const dbExists = require('fs').existsSync(dbPath);
    const db = new Database(dbPath);

    if (!dbExists) {
        console.log('Creating new database');
        createUsersTable(db);
        createPostsTable(db);
    } else {
        console.log('Database already exists, skipping creation');
    }
}

module.exports = initializeDatabase