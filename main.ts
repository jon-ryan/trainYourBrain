import { app, BrowserWindow, screen, ipcMain, dialog } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { autoUpdater } from 'electron-updater';

let win: BrowserWindow = null;
const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

function createWindow(): BrowserWindow {

  // get display size
  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  const windowWidth = 1000;
  const windowHeight = size.height < 600 ? size.height - 100 : 600;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: windowWidth,
    height: windowHeight,
    minWidth: 850,
    minHeight: 300,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: (serve) ? true : false,
    },
    icon: "dist/assets/icons/favicon.png",
  });

  // remove menu bar
  win.removeMenu();

  if (serve) {

    require('devtron').install();
    win.webContents.openDevTools();

    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    win.loadURL('http://localhost:4200');

  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  return win;
}

try {

  app.allowRendererProcessReuse = true;

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => setTimeout(createWindow, 400));

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}


// listen for the request to open a file chooser
ipcMain.handle("showOpenFileDialog", async (_) => {
  return dialog.showOpenDialogSync({ properties: ['openFile'], filters: [{ name: "Image", extensions: ['png', 'jpg'] }] });
})


ipcMain.handle("app_version", (_) => {
  return app.getVersion();
})

ipcMain.on("restart_app", () => {
  /*setImmediate(() => {
    app.removeAllListeners("window-all-closed")
    if (focusedWindow != null) {
      focusedWindow.close()
    }
    autoUpdater.quitAndInstall(false)
  })*/
  autoUpdater.quitAndInstall();
})

ipcMain.on("app-ready", () => {
  console.log("app ready");
  autoUpdater.checkForUpdatesAndNotify();
}) 

// auto updater functions
autoUpdater.on('update-available', () => {
  console.log("update avaailabel executed")
  win.webContents.send('update-available');
});

autoUpdater.on('update-downloaded', () => {
  win.webContents.send('update-downloaded');
});

