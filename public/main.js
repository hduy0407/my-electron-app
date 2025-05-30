const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')

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
    app.db = initializeDatabase();
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})  

ipcMain.handle('save-user', async(event, userData) => {
    const { username, password, email } = userData;

    try {
        // Check if user already exists
        const existingUser = app.db.prepare('SELECT * FROM users WHERE email = ?').get(email);
        if (existingUser) {
            return { success: false, error: 'User already exists' };
        } 

        const stmt = app.db.prepare('INSERT INTO users (username, password, email) VALUES (?, ?, ?)');
        const result = stmt.run(username, password, email);
        return { success: true, id: result.lastInsertRowid };
    } catch (error) {
        console.error('Error saving user:', error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('get-user', async(event, email) => {
    try {
        const stmt = app.db.prepare('SELECT * FROM users WHERE email = ?');
        const user = stmt.get(email);
        if (user) {
            return { success: true, user };
        } else {
            return { success: false, error: 'User not found' };
        }
    } catch (error) {
        console.error('Error retrieving user login:', error);
        return { success: false, error: error.message };
    }
});

