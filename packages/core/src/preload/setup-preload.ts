import { ipcRenderer } from "electron";

import { IPC_CONTRACT_CHANNEL } from "../core/constants";
import { SerializedIpcContract } from "../core/types";

import { createPreloadApi } from "./create-preload-api";
import { PreloadApi } from "./types";

export const setupPreload = (): Promise<PreloadApi> =>
  new Promise((resolve) => {
    ipcRenderer.once(IPC_CONTRACT_CHANNEL, (_event, contract: SerializedIpcContract) => {
      resolve(createPreloadApi(contract));
    });
  });
