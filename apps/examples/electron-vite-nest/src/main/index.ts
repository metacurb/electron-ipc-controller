import 'reflect-metadata'

import { createIpcApp, isIpcController } from '@electron-ipc-bridge/core'
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import type { INestApplicationContext } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { app, BrowserWindow, shell } from 'electron'
import { join } from 'path'

import icon from '../../resources/icon.png?asset'

import { IpcModule } from './ipc.module'

const getIpcControllersFromModule = (ModuleClass: new (...args: unknown[]) => unknown) => {
  const providers = (Reflect.getMetadata('providers', ModuleClass) as unknown[] | undefined) ?? []
  return providers.filter(isIpcController)
}

function createWindow(nestContext: INestApplicationContext): void {
  const mainWindow = new BrowserWindow({
    height: 800,
    width: 800,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: join(__dirname, '../preload/index.js'),
      sandbox: true
    }
  })

  const ipcApp = createIpcApp({
    controllers: getIpcControllersFromModule(IpcModule),
    correlation: true,
    resolver: {
      resolve: <T>(Controller: new (...args: unknown[]) => T): T => nestContext.get(Controller)
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.on('closed', () => {
    ipcApp.dispose()
    if (BrowserWindow.getAllWindows().length === 0) {
      void nestContext.close()
    }
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    void shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer based on electron-vite cli.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    void mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    void mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

void app.whenReady().then(async () => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  const nestContext = await NestFactory.createApplicationContext(IpcModule)
  createWindow(nestContext)

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow(nestContext)
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
