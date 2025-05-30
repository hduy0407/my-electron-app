const {contextBridge, ipcRenderer} = require('electron');
const { verify } = require('jsonwebtoken');

contextBridge.exposeInMainWorld('electron', {
    sendLogin: (userData) => {
        return ipcRenderer.invoke('save-user', userData);
    },
});

