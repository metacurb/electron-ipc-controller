import { ipcMain } from "electron";

import { wrapWithCorrelation } from "../correlation/wrap-with-correlation";
import { Disposer, IpcHandlerMetadata } from "../metadata/types";
import { buildChannel } from "../utils/naming";

type RegisterHandlerConfig = {
  correlation: boolean;
  namespace: string;
};

export const registerHandler = (
  meta: IpcHandlerMetadata,
  instance: unknown,
  { correlation, namespace }: RegisterHandlerConfig,
): Disposer | undefined => {
  const wrappedHandler = wrapWithCorrelation(meta.handler, correlation);
  const boundHandler = wrappedHandler.bind(instance);

  const channel = buildChannel(namespace, meta.methodName);

  if (meta.type === "handle" || meta.type === "handleOnce") {
    ipcMain[meta.type](channel, boundHandler);
    return () => ipcMain.removeHandler(channel);
  }

  if (meta.type === "on" || meta.type === "once") {
    ipcMain[meta.type](channel, boundHandler);
    return () => ipcMain.removeListener(channel, boundHandler);
  }

  return undefined;
};
