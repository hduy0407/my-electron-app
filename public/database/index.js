const path = require('path');
const { app } = require('electron');
const Database = require('better-sqlite3');

const {createUsersTable} = require('./tables/users');
const {createPostsTable, addGroupIdColumnIfMissing, migratePostsIdToText} = require('./tables/posts');
const {createGroupsTable} = require('./tables/groups');
const {createGroupUsersTable, migrateGroupUsersTable} = require('./tables/groupUsers');

function initializeDatabase() {
    // Check if the database file exists, if not, create it
    const dbPath = path.join(app.getPath('userData'), 'quadros-app.db');
    const dbExists = require('fs').existsSync(dbPath);
    const db = new Database(dbPath);

    if (!dbExists) {
        console.log('Creating new database');
        createUsersTable(db);
        createPostsTable(db);
        createGroupsTable(db);
        createGroupUsersTable(db);
        console.log('Database created and tables initialized');
    } else {
        console.log('Database already exists, skipping creation');
    }

    return db;
}

module.exports = initializeDatabase