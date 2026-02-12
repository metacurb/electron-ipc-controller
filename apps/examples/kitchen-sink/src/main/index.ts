import 'reflect-metadata'

import { createIpcApp } from '@electron-ipc-bridge/core'
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, shell } from 'electron'
import { join } from 'path'

import icon from '../../resources/icon.png?asset'

import { CounterController } from './controllers/counter.controller'
import { EchoController } from './controllers/echo.controller'
import { UtilController } from './controllers/util.controller'
import { LoggerService } from './services/logger.service'

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    height: 800,
    width: 900,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js')
    }
  })

  const logger = new LoggerService()
  const counterController = new CounterController(logger)
  const echoController = new EchoController(logger)
  const utilController = new UtilController(logger)

  const instances: Record<string, unknown> = {
    [CounterController.name]: counterController,
    [EchoController.name]: echoController,
    [UtilController.name]: utilController
  }

  const ipcApp = createIpcApp({
    controllers: [CounterController, EchoController, UtilController] as (new (
      ...args: unknown[]
    ) => unknown)[],
    correlation: true,
    resolver: {
      resolve: <T>(Controller: new (...args: unknown[]) => T): T => {
        const instance = instances[Controller.name]
        if (instance instanceof Controller) return instance
        throw new Error(`Controller ${Controller.name} not found`)
      }
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.on('closed', () => {
    ipcApp.dispose()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    void shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    void mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    void mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

void app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron.kitchen-sink')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
