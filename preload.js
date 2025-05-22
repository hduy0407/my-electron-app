const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('electron', {
    node: () => {
        return process.versions.node;
    },
    chrome: () => {
        return process.versions.chrome;
    }
});
