import { IpcMainEvent, IpcMainInvokeEvent } from "electron";

import { IPC_PARAM_INJECTIONS } from "../../metadata/constants";
import { ParameterInjection } from "../../metadata/types";

export const createParamDecorator = <T = unknown>(
  resolver: (event: IpcMainEvent | IpcMainInvokeEvent, data?: T) => unknown,
) => {
  return (data?: T): ParameterDecorator =>
    (target: object, propertyKey: string | symbol | undefined, parameterIndex: number) => {
      if (!propertyKey) {
        return;
      }

      const existingInjections: ParameterInjection[] =
        Reflect.getOwnMetadata(IPC_PARAM_INJECTIONS, target, propertyKey) || [];

      const newInjection: ParameterInjection<T> = {
        data,
        index: parameterIndex,
        resolver,
      };

      Reflect.defineMetadata(IPC_PARAM_INJECTIONS, [...existingInjections, newInjection], target, propertyKey);
    };
};
