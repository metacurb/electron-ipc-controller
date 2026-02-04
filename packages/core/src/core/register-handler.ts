import { ipcMain } from "electron";

import { wrapWithCorrelation } from "../correlation/wrap-with-correlation";
import { Disposer, IpcHandlerMetadata } from "../metadata/types";

import { createParameterInjectionWrapper } from "./parameter-injection/create-parameter-injection-wrapper";

type RegisterHandlerConfig = {
  correlation?: boolean;
};

export const registerHandler = (
  handler: IpcHandlerMetadata,
  instance: unknown,
  { correlation }: RegisterHandlerConfig,
): Disposer | undefined => {
  const correlationWrappedHandler = wrapWithCorrelation(handler.handler, correlation);
  const parameterInjectionWrappedHandler = createParameterInjectionWrapper(
    correlationWrappedHandler,
    handler.paramInjections,
  );
  const boundHandler = parameterInjectionWrappedHandler.bind(instance);

  const { channel, type } = handler;

  switch (type) {
    case "handle":
    case "handleOnce":
      ipcMain[type](channel, boundHandler);
      return () => ipcMain.removeHandler(channel);
    case "on":
    case "once":
      ipcMain[type](channel, boundHandler);
      return () => ipcMain.removeListener(channel, boundHandler);
    default: {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw new Error(`Unknown handler type: ${type}`);
    }
  }
};
