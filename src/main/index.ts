import { app, BrowserWindow, ipcMain, safeStorage, shell } from 'electron'
import fs from 'node:fs'
import path from 'node:path'

const tokenFile = () => path.join(app.getPath('userData'), 'session.bin')

// Token login dienkripsi dengan safeStorage (Windows: DPAPI, macOS: Keychain, Linux: libsecret).
const registerTokenHandlers = () => {
  ipcMain.handle('token:get', () => {
    if (!fs.existsSync(tokenFile())) return null
    try {
      return safeStorage.decryptString(fs.readFileSync(tokenFile()))
    } catch {
      return null
    }
  })

  ipcMain.handle('token:set', (_event, token: string) => {
    fs.writeFileSync(tokenFile(), safeStorage.encryptString(token))
  })

  ipcMain.handle('token:remove', () => {
    fs.rmSync(tokenFile(), { force: true })
  })
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width           : 1100,
    height          : 760,
    minWidth        : 420,
    minHeight       : 600,
    show            : false,
    autoHideMenuBar : true,
    webPreferences  : {
      preload           : path.join(__dirname, '../preload/index.js'),
      contextIsolation  : true,
      nodeIntegration   : false,
      sandbox           : true,
    },
  })

  mainWindow.once('ready-to-show', () => mainWindow.show())

  // Link eksternal dibuka di browser, bukan di jendela aplikasi.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  registerTokenHandlers()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
