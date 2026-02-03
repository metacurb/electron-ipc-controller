import { BrowserWindow } from "electron";

import { getControllerMetadata } from "../metadata/get-controller-metadata";
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
  const namespaces = new Set<string>();

  for (const Controller of controllers) {
    const meta = getControllerMetadata(Controller);
    if (namespaces.has(meta.namespace)) {
      throw new Error(`Duplicate namespace '${meta.namespace}' found in controllers.`);
    }
    namespaces.add(meta.namespace);
  }

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
