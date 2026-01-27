import { IpcDecoratorOptions, IpcHandlerMetadata, IpcHandlerType } from "../../metadata/types";
import { toSnakeCase } from "../../utils/to-snake-case";

export const IPC_PENDING_HANDLERS = Symbol("ipc:pending_handlers");

export const createIpcDecorator =
  (type: IpcHandlerType) =>
  (options?: IpcDecoratorOptions): MethodDecorator => {
    return (target, propertyKey, descriptor: PropertyDescriptor) => {
      const handlerMeta: IpcHandlerMetadata = {
        handler: descriptor.value,
        methodName: toSnakeCase(String(propertyKey)),
        rawEvent: !!options?.rawEvent,
        type,
      };

      const pending: IpcHandlerMetadata[] =
        Reflect.getOwnMetadata(IPC_PENDING_HANDLERS, target) || [];

      pending.push(handlerMeta);

      Reflect.defineMetadata(IPC_PENDING_HANDLERS, pending, target);
    };
  };
