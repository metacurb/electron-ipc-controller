import { setupPreload } from '@electron-ipc-controller/core/preload'
import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge } from 'electron'

// Set up IPC controller preload API
setupPreload().catch(console.error)

try {
  contextBridge.exposeInMainWorld('electron', electronAPI)
} catch (error) {
  console.error(error)
}
