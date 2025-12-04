const { app, BrowserWindow, Menu, ipcMain, shell, dialog } = require('electron');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    backgroundColor: '#0a0a0a',
    // App Icon for the window itself (Taskbar/Window frame)
    icon: path.join(__dirname, 'assets', 'icon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
};

// --- CONFIGURATION FOR NATIVE "ABOUT" PANEL ---
app.setAboutPanelOptions({
    applicationName: 'Osci-Painter',
    applicationVersion: '1.0',
    copyright: '© 2025 Osci-Painter Project',
    version: 'Build 2025.1',
    credits: 'Vector synthesis engine based on Web Audio API & Canvas.',
    authors: ['Your Name / Studio'],
    website: 'https://thehumants.com/OsciPainter/index.html',
    iconPath: path.join(__dirname, 'assets', 'icon.png') 
});


// --- IPC: LISTEN FOR DEVICE LIST FROM WINDOW ---
ipcMain.on('update-audio-menu', (event, devices) => {
    
    const appName = 'Osci-Painter';

    const template = [
        // --- MENU 1: APP NAME (Mac Standard) ---
        {
            label: appName,
            submenu: [
                { role: 'about', label: `About ${appName}` }, 
                { type: 'separator' },
                { role: 'services' },
                { type: 'separator' },
                { role: 'hide', label: `Hide ${appName}` },
                { role: 'hideOthers', label: 'Hide Others' },
                { role: 'unhide', label: 'Show All' },
                { type: 'separator' },
                { role: 'quit', label: `Quit ${appName}` }
            ]
        },
        // --- MENU 2: EDIT (NEU & WICHTIG FÜR COPY/PASTE!) ---
        {
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' }, // Das hier ermöglicht Cmd+V
                { role: 'selectAll' }
            ]
        },
        // --- MENU 3: VIEW ---
        {
            label: 'View',
            submenu: [
                { role: 'reload', label: 'Reload' },
                { role: 'forceReload', label: 'Force Reload' },
                { role: 'toggleDevTools', label: 'Toggle Developer Tools' },
                { type: 'separator' },
                { role: 'togglefullscreen', label: 'Toggle Fullscreen' }
            ]
        },
        // --- MENU 4: AUDIO ---
        {
            label: 'Audio Output',
            submenu: devices.map(device => ({
                label: device.label,
                type: 'radio',
                click: () => {
                    mainWindow.webContents.send('set-audio-output', device.id);
                }
            }))
        },
        // --- MENU 5: HELP ---
        {
            label: 'Help',
            submenu: [
                {
                    label: 'Online Documentation',
                    click: async () => {
                        await shell.openExternal('https://thehumants.com/OsciPainter/index.html'); 
                    }
                },
                { type: 'separator' },
                {
                    label: `About ${appName}`,
                    click: () => app.showAboutPanel() 
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
});

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});