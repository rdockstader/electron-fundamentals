const electron = require('electron');

const images = require('./image');

const app = electron.app;

function enabledCycleEffect(items) {
    const nonEffectMenuOffset = 2;
    const selectedIndex = items.findIndex(item => item.checked);
    const nextIndex = selectedIndex + 1 < items.length ? selectedIndex + 1 : nonEffectMenuOffset;
    items[nextIndex].checked = true;
}

module.exports = mainWindow => {
    const name = app.getName();
    const template = [
        {
            label: 'Effects',
            submenu: [
                {
                    label: 'Cycle',
                    accelerator: 'shift+CmdOrCtrl+E',
                    click: menuItem => {
                        enabledCycleEffect(menuItem.menu.items);
                        mainWindow.webContents.send('effect-cycle');
                    }
                },
                {
                    label: 'Vanilla',
                    type: 'radio',
                    click: _ => mainWindow.webContents.send('effect-choose')
                },
                {
                    label: 'Ascii',
                    type: 'radio',
                    click: _ => mainWindow.webContents.send('effect-choose', 'ascii')
                },
                {
                    label: 'Daltonize',
                    type: 'radio',
                    click: _ => mainWindow.webContents.send('effect-choose', 'daltonize')
                },
                {
                    label: 'Hex',
                    type: 'radio',
                    click: _ => mainWindow.webContents.send('effect-choose', 'hex')
                }
                
            ]
        },
        {
            label: 'View',
            submenu: [
                {
                    label: 'Photos Directory',
                    click: _ => images.openDir(images.getPicturesDir(app))
                }
                
            ]
        }
    ];

    if (process.platform === 'darwon') {
        template.unshift({
            label: name,
            submenu: [
                {
                    label: 'About ' + name,
                    role: 'about'
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Hide ' + name,
                    accelerator: 'cmd+h',
                    role: 'hide'
                },
                {
                    label: 'Hide Others',
                    accelerator: 'cmd+shift+h',
                    role: 'hideothers'
                },
                {
                    label: 'Show All',
                    role: 'unhide'
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Quit',
                    accelerator: 'ctrl+Q',
                    click: _ => { app.quit(); }
                }
            ]
        });
    }
    return template;
}