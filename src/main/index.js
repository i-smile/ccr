'use strict';

import {
  app,
  BrowserWindow,
  globalShortcut,
  Menu,
  ipcMain
} from 'electron';
/* eslint no-unused-vars: 0 */
import store from '../renderer/store';

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\');
}

let mainWindow;
let winprintp;
let winprints;
const winURL =
  process.env.NODE_ENV === 'development' ? `http://localhost:9080` : `file://${__dirname}/index.html`;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 700,
    minHeight: 700,
    width: 1100,
    minWidth: 1100,
    useContentSize: true,
    webPreferences: {
      webSecurity: false
    }
  });

  mainWindow.loadURL(winURL);

  Menu.setApplicationMenu(null);

  globalShortcut.register('f12', (event, arg) => {
    if (mainWindow != null) {
      mainWindow.openDevTools();
    }
  });

  const contents = mainWindow.webContents;
  const printers = contents.getPrinters();
  console.log(printers);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

ipcMain.on('print-preview', (event, arg) => {
  console.log('mmm:', arg);
  winprintp = new BrowserWindow({ width: 600, height: 900 });
  winprintp.loadFile(`${__static}/print-html/print-preview.html`);
  winprintp.setMenu(null);
  winprintp.webContents.on('did-finish-load', () => {
    console.log('nnn:', arg);
    winprintp.webContents.send('request', arg);
  });
});
ipcMain.on('print-silent', (event, arg) => {
  console.log('jjjj:', arg);
  winprints = new BrowserWindow({ show: false });
  winprints.loadFile(`${__static}/print-html/print-silent.html`);
  winprints.webContents.on('did-finish-load', () => {
    console.log('kkkk:', arg);
    winprints.webContents.send('request', arg);
  });
});
ipcMain.on('print', (event, arg) => {
  console.log('do print');
  winprints.webContents.print({ silent: true, printBackground: true });
});

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
