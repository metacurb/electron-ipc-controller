import { BrowserWindow } from "electron";

import { Constructor } from "../metadata/types";

import { IPC_CONTRACT_CHANNEL } from "./constants";
import { serializeControllers } from "./serialize-controllers";

export const emitIpcContract = (controllers: Constructor[], targetWindow?: BrowserWindow) => {
  if (!targetWindow) return;

  const serialized = serializeControllers(controllers);
  const { webContents } = targetWindow;

  if (!webContents.isLoading()) {
    webContents.send(IPC_CONTRACT_CHANNEL, serialized);
  } else {
    webContents.once("did-finish-load", () => webContents.send(IPC_CONTRACT_CHANNEL, serialized));
  }
};
