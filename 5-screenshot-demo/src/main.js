const electron = require('electron');
const path = require('path');

const { app, BrowserWindow, globalShortcut } = electron;

let mainWindow;

app.on('ready', _ => {
    mainWindow = new BrowserWindow({
        width: 0,
        height: 0,
        resizable: false,
        frame: false
    });

    mainWindow.loadURL(`file://${__dirname}/capture.html`);

    mainWindow.on('close', _ => {
        mainWindow = null;
    })

    globalShortcut.register('ctrl+alt+shift+D', _ => {
        
        mainWindow.webContents.send('capture', app.getPath('pictures'));
    });
})