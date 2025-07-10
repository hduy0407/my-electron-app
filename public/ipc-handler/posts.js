const postsTable = require('../database/tables/posts');

const postsIpcHandler = (ipcMain, app) => {
  const db = app.db;

  ipcMain.handle('posts:savePost', async (event, postData) => {
    try {
      const result = await postsTable.savePost(db, postData);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('posts:getPosts', async () => {
    try {
      const posts = await postsTable.getPosts(db);
      return { success: true, posts };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('posts:getPostsByGroupId', async (event, groupId) => {
    try {
      const posts = await postsTable.getPostsByGroupId(db, groupId);
      return { success: true, posts };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('posts:getPostById', async (event, postId) => {
    try {
      const post = await postsTable.getPostById(db, postId);
      return { success: true, post };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('posts:getPostsByUserId', async (event, userId) => {
    try {
      const posts = await postsTable.getPostsByUserId(db, userId);
      return { success: true, posts };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('posts:getLatestMessageByGroupId', async (event, groupId) => {
    try {
      const latestMessage = await postsTable.getLatestMessageByGroupId(db, groupId);
      return { success: true, latestMessage };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('posts:clearAllPosts', async (event) => {
    return postsTable.clearAllPosts(db);
  });

};

module.exports = postsIpcHandler;
