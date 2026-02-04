import { IPC_CONTROLLER_METADATA } from "./constants";
import { Constructor, IpcControllerMetadata } from "./types";

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
