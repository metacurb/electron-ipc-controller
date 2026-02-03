import { BrowserWindow } from "electron";

import { Constructor } from "../metadata/types";

import { assembleIpc } from "./assemble-ipc";
import { emitIpcContract } from "./emit-ipc-contract";
import { ControllerResolver } from "./types";

export interface IpcAppOptions {
  controllers: Constructor[];
  correlation?: boolean;
  resolver: ControllerResolver;
  window: BrowserWindow;
}

export interface IpcApp {
  dispose(): void;
}

export const createIpcApp = ({
  controllers,
  correlation,
  resolver,
  window,
}: IpcAppOptions): IpcApp => {
  const disposers = assembleIpc(controllers, { correlation, resolver });

  emitIpcContract(controllers, window);

  return {
    dispose() {
      for (const dispose of disposers) {
        dispose();
      }
    },
  };
};
