import { IpcMainEvent, IpcMainInvokeEvent } from "electron";

import { ParameterInjection, ParameterInjectionContext } from "../../metadata/types";

export const createParameterInjectionWrapper = <TArgs extends unknown[], TReturn>(
  handler: (...args: TArgs) => TReturn,
  context: ParameterInjectionContext,
  paramInjections: ParameterInjection[] | undefined,
): ((event: IpcMainEvent | IpcMainInvokeEvent, ...args: TArgs) => TReturn) => {
  if (!paramInjections?.length) {
    return (event: IpcMainEvent | IpcMainInvokeEvent, ...args: TArgs) => {
      return handler(...args);
    };
  }

  return (event: IpcMainEvent | IpcMainInvokeEvent, ...args: TArgs) => {
    const injectionsMap = new Map((paramInjections || []).map((i) => [i.index, i]));
    const totalArgsCount = (paramInjections?.length || 0) + args.length;
    const finalArgs: unknown[] = [];
    let argIndex = 0;

    for (let i = 0; i < totalArgsCount; i++) {
      const injection = injectionsMap.get(i);
      if (injection) {
        const resolved = injection.resolver(event, context, injection.data);
        finalArgs.push(resolved);
      } else {
        if (argIndex < args.length) {
          finalArgs.push(args[argIndex++]);
        } else {
          finalArgs.push(undefined);
        }
      }
    }

    while (argIndex < args.length) {
      finalArgs.push(args[argIndex++]);
    }

    return handler(...(finalArgs as TArgs));
  };
};
