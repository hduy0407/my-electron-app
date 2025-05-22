const {app, BrowserWindow} = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')

const createWindow = () => {

    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
    })
    const startURL = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, 'index.html')}`;

    mainWindow.loadURL(startURL);
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})  