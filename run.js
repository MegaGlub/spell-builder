const { app, BrowserWindow } = require('electron')
const path = require('node:path');

const createWindow = () => {
  const win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    width: 1920,
    height: 1080, //these guys have real computers
    titleBarStyle: 'default'
  })
  win.loadFile('main.html')
}

app.whenReady().then(() => {
  createWindow()
})