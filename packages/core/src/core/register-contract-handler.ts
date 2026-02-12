import { IPC_CONTRACT_CHANNEL } from "@electron-ipc-bridge/shared";
import { ipcMain } from "electron";

import { Constructor, Disposer } from "../metadata/types";

import { serializeControllers } from "./serialize-controllers";

export const registerContractHandler = (controllers: Constructor[]): Disposer => {
  ipcMain.handle(IPC_CONTRACT_CHANNEL, () => serializeControllers(controllers));
  return () => ipcMain.removeHandler(IPC_CONTRACT_CHANNEL);
};
