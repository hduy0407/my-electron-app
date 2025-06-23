const userTable = require('../database/tables/users');

const userIpcHandler = (ipcMain, app) => {
    ipcMain.handle('user:saveUser', (event, userData) => {
        const db = app.db;
        return userTable.saveUser(db, userData);
    });

    ipcMain.handle('user:getCurrentUser', (event, email) => {
        const db = app.db;
        return userTable.getCurrentUser(db, { email });   
    });
    
}

module.exports = userIpcHandler;