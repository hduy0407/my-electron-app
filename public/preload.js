const { contextBridge, ipcRenderer } = require('electron');
const { saveGroup } = require('./database/tables/groups');
const { clearAllGroupUsers } = require('./database/tables/groupUsers');
const { clearAllPosts } = require('./database/tables/posts');

let currentUser = null;

contextBridge.exposeInMainWorld('localDatabase', {
  users: {
    saveUser: async (userData) => {
      const result = await ipcRenderer.invoke('user:saveUser', userData);
      if (result.success) {
        currentUser = userData;
      }
      return result;
    },
    getCurrentUser: async () => {

      const result = await ipcRenderer.invoke('user:getCurrentUser');
      if (result.success) {
        currentUser = result.user;
        return { success: true, user: currentUser };
      }

      return { success: false, error: result.error || 'User not found' };
    },
    clearUser: async () => {
      const result = await ipcRenderer.invoke('user:clearUser');
      return result
    },
    setCurrentUser: (userData) => {
      currentUser = userData;
    },
    logOut: () => {
      currentUser = null;
    }
  },
  groups: {
    // Placeholder for groups functionality
    saveGroup: async (groupData) => {
      return await ipcRenderer.invoke('groups:saveGroup', groupData);
    },
    getGroups: async () => {
      return await ipcRenderer.invoke('groups:getGroups');
    },
    clearAllGroups: async () => {
      return await ipcRenderer.invoke('groups:clearAllGroups');
    }
  },
  groupUsers: {
    saveGroupUsers: async (groupUsersData) => {
      return await ipcRenderer.invoke('groupUsers:saveGroupUsers', groupUsersData);
    },
    getGroupUsersByGroupId: async (groupId) => {
      return await ipcRenderer.invoke('groupUsers:getGroupUsersByGroupId', groupId);
    },
    clearAllGroupUsers: async () => {
    return await ipcRenderer.invoke('groupUsers:clearAllGroupUsers');
  }
  },
  posts:{
    savePost: async (postData) => {
      return await ipcRenderer.invoke('posts:savePost', postData);
    },
    getPosts: async () => {
      return await ipcRenderer.invoke('posts:getPosts');
    },
    getPostsByGroupId: async (groupId) => {
      return await ipcRenderer.invoke('posts:getPostsByGroupId', groupId);
    },
    getPostById: async (postId) => {
      return await ipcRenderer.invoke('posts:getPostById', postId);
    },
    getPostsByUserId: async (userId) => {
      return await ipcRenderer.invoke('posts:getPostsByUserId', userId);
    },
    getLatestMessageByGroupId: async (groupId) => {
      return await ipcRenderer.invoke('posts:getLatestMessageByGroupId', groupId);
    },
    clearAllPosts: async () => {
      return await ipcRenderer.invoke('posts:clearAllPosts');
    }
  },

  onError: (callback) => {
    ipcRenderer.on('error', callback);
  },
  removeErrorListener: (callback) => {
    ipcRenderer.removeListener('error', callback);
  }
});
