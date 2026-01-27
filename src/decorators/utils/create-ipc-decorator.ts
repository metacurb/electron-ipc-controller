import { IpcDecoratorOptions, IpcHandlerMetadata, IpcHandlerType } from "../../metadata/types";

export const IPC_PENDING_HANDLERS = Symbol("ipc:pending_handlers");

export const createIpcDecorator =
  (type: IpcHandlerType) =>
  (method: string, options?: IpcDecoratorOptions): MethodDecorator => {
    return (target, propertyKey, descriptor: PropertyDescriptor) => {
      const methodName = propertyKey ? String(propertyKey) : method;

      const handlerMeta: IpcHandlerMetadata = {
        handler: descriptor.value,
        methodName,
        rawEvent: !!options?.rawEvent,
        type,
      };

      const pending: IpcHandlerMetadata[] =
        Reflect.getOwnMetadata(IPC_PENDING_HANDLERS, target) || [];

      pending.push(handlerMeta);

      Reflect.defineMetadata(IPC_PENDING_HANDLERS, pending, target);
    };
  };
