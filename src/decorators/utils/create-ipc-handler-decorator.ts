import { IPC_PENDING_HANDLERS } from "../../metadata/constants";
import { IpcHandlerType, PendingHandlerMetadata } from "../../metadata/types";

export const createIpcHandlerDecorator = (type: IpcHandlerType) => (): MethodDecorator => {
  return (target, propertyKey, descriptor: PropertyDescriptor) => {
    const handlerMeta: PendingHandlerMetadata = {
      handler: descriptor.value,
      methodName: String(propertyKey),
      type,
    };

    const pending: PendingHandlerMetadata[] =
      Reflect.getMetadata(IPC_PENDING_HANDLERS, target) || [];

    pending.push(handlerMeta);

    Reflect.defineMetadata(IPC_PENDING_HANDLERS, pending, target);
  };
};
