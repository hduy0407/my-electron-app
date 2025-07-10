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

    ipcMain.handle('groups:deleteGroupById', async (event, groupId) => {
        const db = app.db;
        if (!groupId) {
            return { success: false, error: 'Group ID is required' };
        }
        return groupsTable.deleteGroupById(db, groupId);
    });

}

module.exports = groupsIpcHandler;