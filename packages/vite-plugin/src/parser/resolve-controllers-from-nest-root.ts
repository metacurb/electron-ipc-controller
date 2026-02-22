import {
  ClassDeclaration,
  Expression,
  getDecorators,
  isArrayLiteralExpression,
  isArrowFunction,
  isBlock,
  isCallExpression,
  isClassDeclaration,
  isIdentifier,
  isObjectLiteralExpression,
  isPropertyAssignment,
  isReturnStatement,
  TypeChecker,
} from "typescript";

import { normalizePath } from "../normalize-path.js";
import { resolveControllersFromModuleClass } from "./resolve-controllers-from-module-class.js";
import { ControllerMetadata } from "./types.js";

function resolveImportElementToClass(element: Expression, typeChecker: TypeChecker): ClassDeclaration | undefined {
  if (isIdentifier(element)) {
    const symbol = typeChecker.getSymbolAtLocation(element);
    if (!symbol) return undefined;
    let target = symbol;
    try {
      const aliased = typeChecker.getAliasedSymbol(symbol);
      if (aliased) target = aliased;
    } catch {
      // not an alias
    }
    const decl = target.declarations?.[0];
    return decl && isClassDeclaration(decl) ? decl : undefined;
  }
  if (isCallExpression(element)) {
    const firstArg = element.arguments[0];
    if (!firstArg) return undefined;
    if (isArrowFunction(firstArg)) {
      const body = firstArg.body;
      if (isIdentifier(body)) return resolveImportElementToClass(body, typeChecker);
      if (isBlock(body)) {
        const ret = body.statements.find((s) => isReturnStatement(s));
        if (ret && isReturnStatement(ret) && ret.expression)
          return resolveImportElementToClass(ret.expression, typeChecker);
      }
    }
  }
  return undefined;
}

/**
 * Resolves all IPC controllers from a Nest root module and its imported modules recursively.
 */
export const resolveControllersFromNestRoot = (
  targetDecl: ClassDeclaration,
  typeChecker: TypeChecker,
  processedFiles: Set<string>,
  controllers: ControllerMetadata[],
  fileCache: Map<string, ControllerMetadata[]>,
  visitedModules: Set<string>,
): void => {
  const sourceFile = targetDecl.getSourceFile();
  const filePath = normalizePath(sourceFile.fileName);
  if (visitedModules.has(filePath)) return;
  visitedModules.add(filePath);

  resolveControllersFromModuleClass(targetDecl, typeChecker, processedFiles, controllers, fileCache);

  const decorators = getDecorators(targetDecl);
  if (!decorators) return;

  for (const decorator of decorators) {
    if (!isCallExpression(decorator.expression)) continue;
    const moduleArgs = decorator.expression.arguments;
    const moduleOptions = moduleArgs[0];
    if (!moduleOptions || !isObjectLiteralExpression(moduleOptions)) continue;

    const importsProp = moduleOptions.properties.find(
      (p): p is import("typescript").PropertyAssignment =>
        isPropertyAssignment(p) && isIdentifier(p.name) && p.name.text === "imports",
    );
    if (!importsProp || !isArrayLiteralExpression(importsProp.initializer)) continue;

    for (const element of importsProp.initializer.elements) {
      const importClass = resolveImportElementToClass(element, typeChecker);
      if (importClass) {
        resolveControllersFromNestRoot(
          importClass,
          typeChecker,
          processedFiles,
          controllers,
          fileCache,
          visitedModules,
        );
      }
    }
    break;
  }
};
