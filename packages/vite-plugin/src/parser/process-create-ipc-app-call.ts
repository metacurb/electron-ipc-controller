import {
  CallExpression,
  isArrayLiteralExpression,
  isIdentifier,
  isObjectLiteralExpression,
  isPropertyAssignment,
  PropertyAssignment,
  TypeChecker,
} from "typescript";

import { resolveController } from "./resolve-controller.js";
import { ControllerMetadata } from "./types.js";

export const processCreateIpcAppCall = (
  node: CallExpression,
  typeChecker: TypeChecker,
  processedFiles: Set<string>,
  controllers: ControllerMetadata[],
): void => {
  const args = node.arguments;
  if (args.length === 0) return;

  const optionsObj = args[0];
  if (!isObjectLiteralExpression(optionsObj)) return;

  const controllersProp = optionsObj.properties.find(
    (p): p is PropertyAssignment => isPropertyAssignment(p) && isIdentifier(p.name) && p.name.text === "controllers",
  );

  if (!controllersProp) return;

  if (isArrayLiteralExpression(controllersProp.initializer)) {
    controllersProp.initializer.elements.forEach((element) => {
      resolveController(element, typeChecker, processedFiles, controllers);
    });
  }
};
