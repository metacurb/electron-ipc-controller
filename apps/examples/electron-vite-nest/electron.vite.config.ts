import { electronIpcBridge } from '@electron-ipc-bridge/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { resolve } from 'path'

export default defineConfig({
  main: {
    plugins: [
      externalizeDepsPlugin(),
      electronIpcBridge({
        resolutionStrategy: 'nest'
      })
    ]
  },
  preload: {
    plugins: [
      externalizeDepsPlugin({
        exclude: ['@electron-ipc-bridge/core', '@electron-toolkit/preload']
      }),
      electronIpcBridge({
        resolutionStrategy: 'nest'
      })
    ]
  },
  renderer: {
    plugins: [react()],
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    }
  }
})
