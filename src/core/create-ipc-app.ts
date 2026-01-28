import { BrowserWindow } from "electron";

import { registerHandlers } from "../metadata/register-handlers";
import { Constructor } from "../metadata/types";

export interface IpcAppOptions {
  controllers: Constructor[];
  correlation?: boolean;
  window: BrowserWindow;
}

export interface IpcApp {
  dispose(): void;
}

export const createIpcApp = ({
  controllers,
  correlation = true,
  window,
}: IpcAppOptions): IpcApp => {
  const { controllersMeta, disposers, emitMetadata } = registerHandlers(controllers, correlation);

  emitMetadata(controllersMeta, window);

  return {
    dispose() {
      for (const dispose of disposers) {
        dispose();
      }
    },
  };
};
