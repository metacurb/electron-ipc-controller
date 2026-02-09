import { ElectronAPI } from '@electron-toolkit/preload'

// Import generated IPC types from vite-plugin
import type { IpcApi } from '../ipc'

declare global {
  interface Window {
    electron: ElectronAPI
    ipc: IpcApi
  }
}
