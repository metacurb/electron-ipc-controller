import { IpcHandlerMetadata, IpcHandlerType } from "../../metadata/types";

export const IPC_PENDING_HANDLERS = Symbol("ipc:pending_handlers");

export const createIpcHandlerDecorator = (type: IpcHandlerType) => (): MethodDecorator => {
  return (target, propertyKey, descriptor: PropertyDescriptor) => {
    const handlerMeta: IpcHandlerMetadata = {
      handler: descriptor.value,
      methodName: String(propertyKey),
      type,
    };

    const pending: IpcHandlerMetadata[] =
      Reflect.getOwnMetadata(IPC_PENDING_HANDLERS, target) || [];

    pending.push(handlerMeta);

    Reflect.defineMetadata(IPC_PENDING_HANDLERS, pending, target);
  };
};
