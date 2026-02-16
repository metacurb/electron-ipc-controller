import { IpcMainEvent, IpcMainInvokeEvent } from "electron";

import { ParameterInjection, ParameterInjectionContext, ParameterValidation } from "../../metadata/types";

export const createParameterInjectionWrapper = <TArgs extends unknown[], TReturn>(
  handler: (...args: TArgs) => TReturn,
  context: ParameterInjectionContext,
  paramInjections: ParameterInjection[] | undefined,
  paramValidations?: ParameterValidation[],
): ((event: IpcMainEvent | IpcMainInvokeEvent, ...args: TArgs) => TReturn) => {
  if (!paramInjections?.length && !paramValidations?.length) {
    return (event: IpcMainEvent | IpcMainInvokeEvent, ...args: TArgs) => {
      return handler(...args);
    };
  }

  const injectionsMap = new Map((paramInjections || []).map((i) => [i.index, i]));
  const maxInjectionIndex =
    paramInjections && paramInjections.length > 0 ? Math.max(...paramInjections.map((i) => i.index)) : -1;

  const validationsMap = new Map((paramValidations || []).map((v) => [v.index, v]));
  const maxValidationIndex =
    paramValidations && paramValidations.length > 0 ? Math.max(...paramValidations.map((v) => v.index)) : -1;

  const loopLimit = Math.max(maxInjectionIndex, maxValidationIndex);

  return (event: IpcMainEvent | IpcMainInvokeEvent, ...args: TArgs) => {
    const finalArgs: unknown[] = [];
    let argIndex = 0;

    for (let i = 0; i <= loopLimit || argIndex < args.length; i++) {
      const injection = injectionsMap.get(i);
      let value: unknown;

      if (injection) {
        value = injection.resolver(event, context, injection.data);
      } else {
        if (argIndex < args.length) {
          value = args[argIndex++];
        } else {
          value = undefined;
        }
      }

      finalArgs.push(value);

      const validation = validationsMap.get(i);
      if (validation) {
        if (validation.validator(value) === false) {
          throw new Error(`Validation failed for argument at index ${i}`);
        }
      }
    }

    return handler(...(finalArgs as TArgs));
  };
};
