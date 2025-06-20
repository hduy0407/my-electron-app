const { contextBridge, ipcRenderer } = require('electron');

let currentUser = null;

contextBridge.exposeInMainWorld('localDatabase', {
  user: {
    saveUser: async (userData) => {
      const result = await ipcRenderer.invoke('user:saveUser', userData);
      if (result.success) {
        currentUser = userData;
      }
      return result;
    },
    getCurrentUser: async (email) => {
      if (currentUser) {
        return currentUser;
      }
      const result = await ipcRenderer.invoke('user:getCurrentUser', email);
      if (result.success) {
        currentUser = result.user;
        return currentUser;
      }
      return null;
    },
    setCurrentUser: (userData) => {
      currentUser = userData;
    },
    logOut: () => {
      currentUser = null;
    }
  },
  onError: (callback) => {
    ipcRenderer.on('error', callback);
  },
  removeErrorListener: (callback) => {
    ipcRenderer.removeListener('error', callback);
  }
});
