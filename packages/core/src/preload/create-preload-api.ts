import { ipcRenderer } from "electron";

import { SerializedIpcContract } from "../core/types";

import { HandleMethod, PreloadApi, PreloadNamespace, SendMethod } from "./types";

const createHandleMethod =
  (channel: string): HandleMethod =>
  (...args: unknown[]) =>
    ipcRenderer.invoke(channel, ...args);

const createSendMethod =
  (channel: string): SendMethod =>
  (...args: unknown[]) => {
    ipcRenderer.send(channel, ...args);
  };

export const createPreloadApi = (contract: SerializedIpcContract): PreloadApi => {
  const api: PreloadApi = {};

  for (const controller of contract.controllers) {
    const namespace: PreloadNamespace = {};

    for (const handler of controller.handlers) {
      switch (handler.type) {
        case "handle":
        case "handleOnce":
          namespace[handler.methodName] = createHandleMethod(handler.channel);
          break;
        case "on":
        case "once":
          namespace[handler.methodName] = createSendMethod(handler.channel);
          break;
      }
    }

    api[controller.namespace] = namespace;
  }

  return api;
};
