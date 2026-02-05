import { createIpcApp } from "@electron-ipc-controller/core";
import { app, BrowserWindow } from "electron";
import * as path from "path";

import { CounterController } from "./controllers/counter.controller";

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    height: 800,
    webPreferences: {
      preload: require.resolve("@electron-ipc-controller/core/preload.js"),
    },
    width: 800,
  });

  const counterController = new CounterController();
  const instances: Record<string, unknown> = {
    [CounterController.name]: counterController,
  };

  const controllerResolver = <T>(Controller: new (...args: unknown[]) => T): T => {
    const instance = instances[Controller.name];
    if (instance instanceof Controller) return instance;
    throw new Error(`Controller ${Controller.name} not found`);
  };

  const ipcApp = createIpcApp({
    controllers: [CounterController],
    correlation: true,
    resolver: {
      resolve: controllerResolver,
    },
  });

  void mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));

  mainWindow.on("closed", () => {
    ipcApp.dispose();
    mainWindow = null;
  });
}

void app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
