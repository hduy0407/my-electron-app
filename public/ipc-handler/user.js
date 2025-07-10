const userTable = require('../database/tables/users');

const userIpcHandler = (ipcMain, app) => {
    ipcMain.handle('user:saveUser', (event, userData) => {
        const db = app.db;
        return userTable.saveUser(db, userData);
    });

    ipcMain.handle('user:getCurrentUser', (event) => {
        const db = app.db;
        return userTable.getCurrentUser(db);   
    });
    
    ipcMain.handle('user:clearUser', (event) => {
        const db = app.db;
        return userTable.clearUser(db);   
    });
}

module.exports = userIpcHandler;