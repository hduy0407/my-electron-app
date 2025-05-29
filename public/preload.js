const {contextBridge, ipcRenderer} = require('electron');
const { verify } = require('jsonwebtoken');

contextBridge.exposeInMainWorld('electron', {
    node: () => {
        return process.versions.node;
    },
    chrome: () => {
        return process.versions.chrome;
    },
    sendLogin: (email, password) => {
        return ipcRenderer.invoke('login', email, password);
    },
    getToken: () => {
        return ipcRenderer.invoke('get-token');
    },
    verifyToken: () => {
        return ipcRenderer.invoke('verify-token')
    },
});

