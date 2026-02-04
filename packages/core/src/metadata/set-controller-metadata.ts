import { IPC_CONTROLLER_METADATA } from "./constants";
import { generateMetadata } from "./generate-metadata";
import { Constructor, IpcControllerMetadata } from "./types";

export const setControllerMetadata = (target: Constructor, namespace?: string) => {
  const existing: IpcControllerMetadata | undefined = Reflect.getMetadata(IPC_CONTROLLER_METADATA, target);
  if (existing) return existing;

  const meta = generateMetadata(target, namespace);
  Reflect.defineMetadata(IPC_CONTROLLER_METADATA, Object.freeze(meta), target);
  return meta;
};
