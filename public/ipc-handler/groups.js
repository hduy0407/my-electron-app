const groupsTable = require('../database/tables/groups');

const groupsIpcHandler = (ipcMain, app) => {
    ipcMain.handle('groups:saveGroup', (event, groupData) => {
        const db = app.db;
        return groupsTable.saveGroup(db, groupData);
    });

    ipcMain.handle('groups:getGroups', (event) => {
        const db = app.db;
        return groupsTable.getGroups(db);
    });

    ipcMain.handle('groups:clearAllGroups', () => {
        const db = app.db
        return groupsTable.clearAllGroups(db);
    });
}

module.exports = groupsIpcHandler;