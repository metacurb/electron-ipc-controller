import { Expression, isClassDeclaration, TypeChecker } from "typescript";

import { collectDependencies } from "./collect-dependencies.js";
import { extractControllerMetadata } from "./extract-metadata.js";
import { ControllerMetadata } from "./types.js";

export const resolveController = (
  node: Expression,
  typeChecker: TypeChecker,
  processedFiles: Set<string>,
  controllers: ControllerMetadata[],
  fileCache: Map<string, ControllerMetadata[]>,
): void => {
  const symbol = typeChecker.getSymbolAtLocation(node);
  if (!symbol) return;

  let targetSymbol = symbol;
  try {
    const aliasedSymbol = typeChecker.getAliasedSymbol(symbol);
    targetSymbol = aliasedSymbol || symbol;
  } catch {
    // Not an alias
  }

  if (!targetSymbol.declarations || targetSymbol.declarations.length === 0) return;

  const targetDecl = targetSymbol.declarations[0];
  if (!isClassDeclaration(targetDecl)) return;

  const sourceFile = targetDecl.getSourceFile();
  const fileName = sourceFile.fileName;
  const className = targetDecl.name?.text;
  if (!className) return;

  let fileControllers = fileCache.get(fileName);
  if (fileControllers === undefined) {
    fileControllers = extractControllerMetadata(sourceFile, typeChecker);
    fileCache.set(fileName, fileControllers);
    processedFiles.add(fileName);
  }

  const match = fileControllers.find((c) => c.className === className);
  if (match) {
    controllers.push(match);
    collectDependencies(match.referencedTypes, processedFiles);
  }
};
