import { Expression, TypeChecker } from "typescript";

import { extractControllerMetadata } from "./extract-metadata.js";
import { ControllerMetadata } from "./types.js";

export const resolveController = (
  node: Expression,
  typeChecker: TypeChecker,
  processedFiles: Set<string>,
  controllers: ControllerMetadata[],
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
  const sourceFile = targetDecl.getSourceFile();
  const fileName = sourceFile.fileName;

  if (processedFiles.has(fileName)) return;
  processedFiles.add(fileName);

  const fileControllers = extractControllerMetadata(sourceFile, typeChecker);
  controllers.push(...fileControllers);
};
