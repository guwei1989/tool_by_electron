const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')

let window = null


// Wait until the app is ready
app.once('ready', () => {
  // Create a new window
  window = new BrowserWindow({
    // Set the initial width to 800px
    width: 1030,
    // Set the initial height to 600px
    height: 900,
    // set the title bar style
    titleBarStyle: 'hidden-inset',
    // set the background color to black
    backgroundColor: "#66CDAA",
    // Don't show the window until it's ready, this prevents any white flickering
    show: false
  })

  window.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // window.webContents.openDevTools()

  window.once('ready-to-show', () => {
    window.show()
  })
})
