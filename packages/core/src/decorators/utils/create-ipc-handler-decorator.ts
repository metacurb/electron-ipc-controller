import { IpcHandlerType } from "@electron-ipc-bridge/shared";

import { IPC_PARAM_INJECTIONS, IPC_PENDING_HANDLERS } from "../../metadata/constants";
import { ParameterInjection, PendingHandlerMetadata } from "../../metadata/types";

export const createIpcHandlerDecorator =
  (type: IpcHandlerType) =>
  (name?: string): MethodDecorator => {
    return (target, propertyKey, descriptor: PropertyDescriptor) => {
      if (typeof descriptor?.value !== "function") {
        throw new Error(`IPC decorators can only be applied to methods.`);
      }

      const paramInjections: ParameterInjection[] | undefined = Reflect.getOwnMetadata(
        IPC_PARAM_INJECTIONS,
        target,
        propertyKey,
      );

      const methodName = name || String(propertyKey);

      const handlerMeta: PendingHandlerMetadata = {
        handler: descriptor.value,
        methodName,
        paramInjections,
        type,
      };

      const pending: PendingHandlerMetadata[] = Reflect.getMetadata(IPC_PENDING_HANDLERS, target) || [];

      if (pending.some((h) => h.methodName === methodName)) {
        throw new Error(`Method '${methodName}' already has an IPC decorator.`);
      }

      pending.push(handlerMeta);

      Reflect.defineMetadata(IPC_PENDING_HANDLERS, pending, target);
    };
  };
