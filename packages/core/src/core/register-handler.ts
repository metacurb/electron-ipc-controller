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
  const boundOriginalHandler = handler.handler.bind(instance);

  const parameterInjectionWrappedHandler = createParameterInjectionWrapper(
    boundOriginalHandler,
    { channel: handler.channel },
    handler.paramInjections,
  );

  const correlationWrappedHandler = wrapWithCorrelation(parameterInjectionWrappedHandler, correlation);

  const { channel, type } = handler;

  switch (type) {
    case "handle":
    case "handleOnce":
      ipcMain[type](channel, correlationWrappedHandler);
      return () => ipcMain.removeHandler(channel);
    case "on":
    case "once":
      ipcMain[type](channel, correlationWrappedHandler);
      return () => ipcMain.removeListener(channel, correlationWrappedHandler);
    default: {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw new Error(`Unknown handler type: ${type}`);
    }
  }
};
