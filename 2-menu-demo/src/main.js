const electron = require('electron');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;

app.on('ready', _ => {
    new BrowserWindow();
    const name = electron.app.getName()

    const template = [
        {
            label: name,
            submenu: [
                {
                    label: `about ${name}`,
                    click: _ => {
                        console.log('clicked!');
                    },
                    role: 'about'
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Quit',
                    click: app.quit,
                    accelerator: 'ctrl+q'
                }
            ]
        }
    ];
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
})