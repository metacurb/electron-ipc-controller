import { IPC_PENDING_HANDLERS } from "../metadata/constants";
import { setControllerMetadata } from "../metadata/set-controller-metadata";
import { Constructor, PendingHandlerMetadata } from "../metadata/types";
import { createChannelName } from "../utils/create-channel-name";

export const IpcController = (): ClassDecorator => (target) => {
  const ctor = target as unknown as Constructor;

  const meta = setControllerMetadata(ctor);

  const pending: PendingHandlerMetadata[] = Reflect.getMetadata(IPC_PENDING_HANDLERS, target) || [];

  for (const handler of pending) {
    if (meta.handlers.has(handler.methodName)) {
      throw new Error(`Duplicate handler name ${handler.methodName} in controller ${ctor.name}`);
    }

    meta.handlers.set(handler.methodName, {
      ...handler,
      channel: createChannelName(meta.namespace, handler.methodName),
    });
  }
};
