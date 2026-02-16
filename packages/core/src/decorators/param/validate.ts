import { IPC_PARAM_VALIDATIONS } from "../../metadata/constants";
import { ParameterValidation } from "../../metadata/types";

export type Validator = (value: unknown) => boolean | void;

export const Validate = (validator: Validator): ParameterDecorator => {
  return (target: Object, propertyKey: string | symbol | undefined, parameterIndex: number) => {
    if (!propertyKey) {
      throw new Error("Validation decorator can only be used on method parameters.");
    }

    const validations: ParameterValidation[] = Reflect.getOwnMetadata(IPC_PARAM_VALIDATIONS, target, propertyKey) || [];

    validations.push({
      index: parameterIndex,
      validator,
    });

    Reflect.defineMetadata(IPC_PARAM_VALIDATIONS, validations, target, propertyKey);
  };
};
