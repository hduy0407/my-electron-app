const {contextBridge, ipcRenderer} = require('electron');
const { verify } = require('jsonwebtoken');

// User state management
let currentUser = null;

contextBridge.exposeInMainWorld('localDatabase', {
    // User authentication and state management
    user: {
        ...require('./database/tables/users.js'),
        
        setCurrentUser: (user) => {
            currentUser = user;
        },
        getCurrentUser: () => {
            return currentUser;
        },
        clearCurrentUser: () => {
            currentUser = null;
        },
        isLoggedIn: () => {
            return currentUser !== null;
        },
        getDisplayName: () => {
            return currentUser ? (currentUser.username || currentUser.email) : null;
        }
    },

    // System events
    onError: (callback) => {
        ipcRenderer.on('error', callback);
    },
    removeErrorListener: (callback) => {
        ipcRenderer.removeListener('error', callback);
    }
});

