import Container from "typedi";

import { createControllerMetadata } from "../metadata/controller-metadata";
import { Constructor, IpcHandlerMetadata } from "../metadata/types";

import { IPC_PENDING_HANDLERS } from "./utils/create-ipc-decorator";

export const IpcController = (): ClassDecorator => (target) => {
  const ctor = target as unknown as Constructor;

  const meta = createControllerMetadata(ctor);

  const pending: IpcHandlerMetadata[] = Reflect.getOwnMetadata(IPC_PENDING_HANDLERS, target) || [];

  for (const handler of pending) {
    if (meta.handlers.has(handler.methodName)) {
      throw new Error(`Duplicate handler name ${handler.methodName} in controller ${ctor.name}`);
    }

    meta.handlers.set(handler.methodName, handler);
  }

  if (!Container.has(ctor)) {
    Container.set(ctor, new ctor());
  }
};
