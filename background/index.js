'use strict'
import {
  app,
  protocol,
  BrowserWindow,
  shell
} from 'electron'
import path from 'path'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
const isDevelopment = import.meta.env.MODE !== 'production'

process.env.DIST = path.join(__dirname, '..')
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? path.join(process.env.DIST, '..', 'public')
  : process.env.DIST

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'app',
    privileges: {
      secure: true,
      standard: true,
      corsEnabled: true
    }
  }
])

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = path.join(process.env.DIST, 'index.html')

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    autoHideMenuBar: true,
    width: 1000,
    height: 720,
    useContentSize: true,
    minWidth: 1000,
    minHeight: 740,
    frame: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true
    },
    icon: path.join(process.env.PUBLIC, 'icon.png')
  })
  console.log('vitedevserver: ', process.env.VITE_DEV_SERVER_URL)
  console.log('url: ', url)
  if (process.env.VITE_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(url)
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }

  // Open all anchor tags with target="_blank" in external browser
  const fileProtocol = url || 'app://'

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (!url.startsWith(fileProtocol)) {
      shell.openExternal(url)
    }
    return { action: 'deny' }
  })

  // Set win to null after the instance has been closed
  win.on('closed', () => {
    win = null
  })
}

// fix cors issue
app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors')

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
