import 'reflect-metadata'

import { createIpcApp, getControllerMetadata } from '@electron-ipc-controller/core'
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import type { INestApplicationContext } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { app, BrowserWindow, shell } from 'electron'
import { join } from 'path'

import icon from '../../resources/icon.png?asset'

import { IpcModule } from './ipc.module'

/** IPC controller classes registered as providers on the given Nest module. */
function getIpcControllersFromModule(ModuleClass: new (...args: unknown[]) => unknown): unknown[] {
  const providers = (Reflect.getMetadata('providers', ModuleClass) as unknown[] | undefined) ?? []
  return providers.filter((token) => {
    if (typeof token !== 'function') return false
    try {
      getControllerMetadata(token as new (...args: unknown[]) => unknown)
      return true
    } catch {
      return false
    }
  })
}

function createWindow(nestContext: INestApplicationContext): void {
  const mainWindow = new BrowserWindow({
    height: 800,
    width: 800,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js')
    }
  })

  const ipcApp = createIpcApp({
    controllers: getIpcControllersFromModule(IpcModule) as Parameters<
      typeof createIpcApp
    >[0]['controllers'],
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
