const groupUsersTable = require('../database/tables/groupUsers');

const groupUsersIpcHandler = (ipcMain, app) => {
  const db = app.db;

  // Save group user(s)
  ipcMain.handle('groupUsers:saveGroupUsers', (event, groupUsersData) => {
    return groupUsersTable.saveGroupUsers(db, groupUsersData);
  });

  // Get all users in a group
  ipcMain.handle('groupUsers:getGroupUsersByGroupId', (event, groupId) => {
    return groupUsersTable.getGroupUsersByGroupId(db, groupId);
  });

  ipcMain.handle('groupUsers:clearAllGroupUsers', (event) => {
    return groupUsersTable.clearAllGroupUsers(db)
  })
};

module.exports = groupUsersIpcHandler;
