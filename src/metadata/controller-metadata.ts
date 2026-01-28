import { randomUUID } from "node:crypto";

import { deriveNamespace } from "../utils/derive-namespace";

import { Constructor, IpcControllerMetadata } from "./types";

const IPC_CONTROLLER_METADATA = Symbol("ipc:controller");

export const generateMeta = (target: Constructor): IpcControllerMetadata => ({
  handlers: new Map(),
  id: randomUUID(),
  namespace: deriveNamespace(target.name),
  target,
});

export const getControllerMetadata = (target: Constructor) => {
  const meta: IpcControllerMetadata | undefined = Reflect.getMetadata(
    IPC_CONTROLLER_METADATA,
    target,
  );
  if (!meta) {
    throw new Error(
      `Controller ${target.name} has no IPC metadata. Did you forget to apply the @Controller decorator?`,
    );
  }
  return meta;
};

export const createControllerMetadata = (target: Constructor) => {
  const existing: IpcControllerMetadata | undefined = Reflect.getMetadata(
    IPC_CONTROLLER_METADATA,
    target,
  );
  if (existing) return existing;

  const meta = generateMeta(target);
  Reflect.defineMetadata(IPC_CONTROLLER_METADATA, Object.freeze(meta), target);
  return meta;
};
