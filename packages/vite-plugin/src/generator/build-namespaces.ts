import type { ControllerMetadata } from "../parser/types.js";

import { getReturnType } from "./get-return-type.js";

export const buildNamespaces = (controllers: ControllerMetadata[]): string[] => {
  return controllers.map((controller) => {
    const methods = controller.methods.map((method) => {
      const params = method.params.map((p) => `${p.name}${p.optional ? "?" : ""}: ${p.type}`).join(", ");
      const returnType = getReturnType(method.decoratorName, method.returnType);
      return `${method.name}(${params}): ${returnType};`;
    });

    return `    ${controller.namespace}: {\n      ${methods.join("\n      ")}\n    };`;
  });
};
