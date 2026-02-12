import { IPC_CONTRACT_CHANNEL, IPC_DEFAULT_API_ROOT, SerializedIpcContract } from "@electron-ipc-controller/shared";
import { contextBridge, ipcRenderer } from "electron";

import { createPreloadApi } from "./create-preload-api";
import { PreloadApi } from "./types";

export type SetupPreloadOptions = {
  namespace?: string;
};

export const setupPreload = async ({
  namespace = IPC_DEFAULT_API_ROOT,
}: SetupPreloadOptions = {}): Promise<PreloadApi> => {
  const contract: SerializedIpcContract = await ipcRenderer.invoke(IPC_CONTRACT_CHANNEL);
  const api = createPreloadApi(contract);

  contextBridge.exposeInMainWorld(namespace, api);

  return api;
};
