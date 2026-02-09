import {
  CallExpression,
  Expression,
  isArrayLiteralExpression,
  isAsExpression,
  isCallExpression,
  isClassDeclaration,
  isIdentifier,
  isNonNullExpression,
  isObjectLiteralExpression,
  isParenthesizedExpression,
  isPropertyAssignment,
  isSatisfiesExpression,
  isTypeAssertionExpression,
  PropertyAssignment,
  TypeChecker,
} from "typescript";

import { getDecorator } from "./get-decorator.js";
import { resolveController } from "./resolve-controller.js";
import { ControllerMetadata } from "./types.js";

export const processCreateIpcAppCall = (
  node: CallExpression,
  typeChecker: TypeChecker,
  processedFiles: Set<string>,
  controllers: ControllerMetadata[],
  fileCache: Map<string, ControllerMetadata[]>,
): void => {
  const args = node.arguments;
  if (args.length === 0) return;

  const optionsObj = args[0];
  if (!isObjectLiteralExpression(optionsObj)) return;

  const controllersProp = optionsObj.properties.find(
    (p): p is PropertyAssignment => isPropertyAssignment(p) && isIdentifier(p.name) && p.name.text === "controllers",
  );

  if (!controllersProp) return;

  const unwrapExpression = (expr: Expression): Expression => {
    let current = expr;
    while (true) {
      if (isParenthesizedExpression(current)) {
        current = current.expression;
        continue;
      }
      if (isAsExpression(current)) {
        current = current.expression;
        continue;
      }
      if (isTypeAssertionExpression(current)) {
        current = current.expression;
        continue;
      }
      if (isNonNullExpression(current)) {
        current = current.expression;
        continue;
      }
      if (isSatisfiesExpression(current)) {
        current = current.expression;
        continue;
      }
      return current;
    }
  };

  const initializer = unwrapExpression(controllersProp.initializer);

  if (isArrayLiteralExpression(initializer)) {
    initializer.elements.forEach((element) => {
      resolveController(element, typeChecker, processedFiles, controllers, fileCache);
    });
    return;
  }

  if (isCallExpression(initializer)) {
    const callExpr = initializer;
    const moduleArg = callExpr.arguments[0];
    if (moduleArg && isIdentifier(moduleArg)) {
      const moduleSymbol = typeChecker.getSymbolAtLocation(moduleArg);
      if (!moduleSymbol) return;

      let targetSymbol = moduleSymbol;
      try {
        const aliasedSymbol = typeChecker.getAliasedSymbol(moduleSymbol);
        targetSymbol = aliasedSymbol || moduleSymbol;
      } catch {
        // Not an alias
      }

      const targetDecl = targetSymbol.declarations?.[0];
      if (!targetDecl || !isClassDeclaration(targetDecl)) return;

      const moduleDecorator = getDecorator(targetDecl, "Module");
      if (!moduleDecorator || !isCallExpression(moduleDecorator.expression)) return;

      const moduleArgs = moduleDecorator.expression.arguments;
      const moduleOptions = moduleArgs[0];
      if (!moduleOptions || !isObjectLiteralExpression(moduleOptions)) return;

      const providersProp = moduleOptions.properties.find(
        (p): p is PropertyAssignment => isPropertyAssignment(p) && isIdentifier(p.name) && p.name.text === "providers",
      );
      if (!providersProp || !isArrayLiteralExpression(providersProp.initializer)) return;

      const providerElements = providersProp.initializer.elements;
      providerElements.forEach((element) => {
        resolveController(element, typeChecker, processedFiles, controllers, fileCache);
      });
    }
  }
};
