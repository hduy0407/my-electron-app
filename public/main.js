const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')

const fetch = require('node-fetch');
const initializeDatabase = require('./database/index.js');

const BASE_URL = process.env.REACT_APP_URL_DB;
const SECRET_KEY = process.env.REACT_APP_SECRET_KEY; 

const createWindow = () => {

    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        }
    })
    const startURL = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, 'index.html')}`;

    mainWindow.loadURL(startURL);
}

app.whenReady().then(() => {
    // Set up the local database before creating the window    
    initializeDatabase();
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})  