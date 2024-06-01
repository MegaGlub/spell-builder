const { app, BrowserWindow } = require('electron')

const createWindow = () => {
  const win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
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