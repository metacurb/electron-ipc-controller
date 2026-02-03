import { ipcMain } from "electron";

import { wrapWithCorrelation } from "../correlation/wrap-with-correlation";
import { Disposer, IpcHandlerMetadata } from "../metadata/types";

type RegisterHandlerConfig = {
  correlation?: boolean;
};

export const registerHandler = (
  handler: IpcHandlerMetadata,
  instance: unknown,
  { correlation }: RegisterHandlerConfig,
): Disposer | undefined => {
  const wrappedHandler = wrapWithCorrelation(handler.handler, correlation);
  const boundHandler = wrappedHandler.bind(instance);

  const { channel, type } = handler;

  if (type === "handle" || type === "handleOnce") {
    ipcMain[type](channel, boundHandler);
    return () => ipcMain.removeHandler(channel);
  }

  if (type === "on" || type === "once") {
    ipcMain[type](channel, boundHandler);
    return () => ipcMain.removeListener(channel, boundHandler);
  }

  return undefined;
};
