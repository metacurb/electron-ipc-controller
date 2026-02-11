import {
  createPrinter,
  EmitHint,
  forEachChild,
  isEnumDeclaration,
  isInterfaceDeclaration,
  isTypeAliasDeclaration,
  isTypeReferenceNode,
  Node,
  TypeChecker,
} from "typescript";

import { TypeDefinition } from "./types.js";

const printer = createPrinter();

const BUILTIN_TYPE_NAMES = new Set([
  "Promise",
  "Array",
  "Map",
  "Set",
  "WeakMap",
  "WeakSet",
  "Date",
  "RegExp",
  "Function",
  "Symbol",
  "Error",
  "Record",
  "Partial",
  "Required",
  "Readonly",
  "Pick",
  "Omit",
  "Exclude",
  "Extract",
  "NonNullable",
  "ReturnType",
  "Parameters",
  "InstanceType",
  "ConstructorParameters",
  "__type",
  "undefined",
]);

export const collectTypeDefinitions = (
  node: Node,
  typeChecker: TypeChecker,
  seen = new Set<string>(),
): TypeDefinition[] => {
  const result: TypeDefinition[] = [];
  walkForTypeRefs(node, typeChecker, seen, result);
  return result;
};

const walkForTypeRefs = (node: Node, typeChecker: TypeChecker, seen: Set<string>, out: TypeDefinition[]): void => {
  if (isTypeReferenceNode(node)) {
    const sym = typeChecker.getSymbolAtLocation(node.typeName);
    if (sym) {
      const pickDeclaration = (symbol: typeof sym | undefined) =>
        symbol
          ?.getDeclarations()
          ?.find((d) => isTypeAliasDeclaration(d) || isInterfaceDeclaration(d) || isEnumDeclaration(d));

      let decl = pickDeclaration(sym);
      if (!decl) {
        try {
          const aliased = typeChecker.getAliasedSymbol(sym);
          const aliasedDecl = pickDeclaration(aliased);
          if (aliasedDecl) {
            decl = aliasedDecl;
          }
        } catch {
          // Not an alias; fall back to original symbol
        }
      }

      if (decl && (isTypeAliasDeclaration(decl) || isInterfaceDeclaration(decl) || isEnumDeclaration(decl))) {
        const name = decl.name.text;

        if (!BUILTIN_TYPE_NAMES.has(name) && !seen.has(name)) {
          seen.add(name);

          const sourceFile = decl.getSourceFile();
          if (!sourceFile.fileName.includes("node_modules")) {
            const referencedTypes: TypeDefinition[] = [];
            walkForTypeRefs(decl, typeChecker, seen, referencedTypes);

            const definition = printer
              .printNode(EmitHint.Unspecified, decl, sourceFile)
              .replace(/^\s*export\s+/, "")
              .replace(/^\s*declare\s+/, "")
              .trim();

            if (definition) {
              out.push({ definition, name, referencedTypes, sourceFile: sourceFile.fileName });
            }
          }
        }
      }
    }

    if (node.typeArguments) {
      node.typeArguments.forEach((arg) => walkForTypeRefs(arg, typeChecker, seen, out));
    }
    return;
  }

  forEachChild(node, (child) => walkForTypeRefs(child, typeChecker, seen, out));
};
