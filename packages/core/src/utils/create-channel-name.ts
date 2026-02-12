import { toSnakeCase } from "@electron-ipc-bridge/shared";

export const createChannelName = (namespace: string, method: string): string =>
  [namespace, method].map(toSnakeCase).join(".");
