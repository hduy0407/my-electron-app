const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')

const initializeDatabase = require('./database/index.js');
const userTable = require('./database/tables/users.js');

const createWindow = () => {
    console.log('preload path:', path.join(__dirname, 'preload.js'));
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences:{
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: true,
        }
    })

    const startURL = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, 'index.html')}`;

    mainWindow.loadURL(startURL);
}

app.whenReady().then(() => {
    // Set up the local database before creating the window    
    app.db = initializeDatabase();

    createWindow()

    ipcMain.handle('user:saveUser', (event, userData) => {
        const db = app.db;
        return userTable.saveUser(db, userData);
    });

    ipcMain.handle('user:getCurrentUser', (event, email) => {
        const db = app.db;
        return userTable.getCurrentUser(db, { email });   
    });
    
    

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})  

 
