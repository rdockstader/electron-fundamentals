const electron = require('electron');

const images = require('./image');
const menuTemplate = require('./menu');


const { app, Menu, BrowserWindow, ipcMain: ipc } = electron;

let mainWindow;
app.on('ready', _ => {
    mainWindow = new BrowserWindow({
        width: 893,
        height: 725,
        resizable: false
    });

    mainWindow.loadURL(`file://${__dirname}/capture.html`);

    // mainWindow.webContents.openDevTools();

    images.mkdir(images.getPicturesDir(app));

    mainWindow.on('closed', _ => {
        mainWindow = null;
    })

    const menuContents = Menu.buildFromTemplate(menuTemplate(mainWindow));
    Menu.setApplicationMenu(menuContents);
});


ipc.on('image-captured', (evt, contents) => {
    images.save(images.getPicturesDir(app), contents, (err, imgpath) => {
        images.cache(imgpath);
    });
})

ipc.on('image-remove', (evt, index) => {
    images.rm(index, _ => {
        evt.sender.send('image-removed', index);
    })
})