import { electronIpcController } from '@electron-ipc-controller/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { resolve } from 'path'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin(), electronIpcController()]
  },
  preload: {
    plugins: [
      externalizeDepsPlugin({
        exclude: ['@electron-ipc-controller/core', '@electron-toolkit/preload']
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
