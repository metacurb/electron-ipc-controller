import { electronIpcController } from '@electron-ipc-bridge/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { resolve } from 'path'

export default defineConfig({
  main: {
    plugins: [
      externalizeDepsPlugin(),
      electronIpcController({
        main: 'src/main/index.ts'
      })
    ]
  },
  preload: {
    plugins: [
      externalizeDepsPlugin({
        exclude: ['@electron-ipc-bridge/core', '@electron-toolkit/preload']
      }),
      electronIpcController({
        main: 'src/main/index.ts'
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
