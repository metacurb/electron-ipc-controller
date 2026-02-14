import {
  createPrinter,
  EmitHint,
  forEachChild,
  isEnumDeclaration,
  isInterfaceDeclaration,
  isTypeAliasDeclaration,
  isTypeReferenceNode,
  Node,
  Symbol,
  Type,
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

export const collectTypeDefinitionsFromType = (
  type: Type,
  typeChecker: TypeChecker,
  seen = new Set<string>(),
): TypeDefinition[] => {
  const result: TypeDefinition[] = [];
  walkTypeForTypeRefs(type, typeChecker, seen, result);
  return result;
};

const pickDeclaration = (symbol: Symbol | undefined) =>
  symbol
    ?.getDeclarations()
    ?.find((d) => isTypeAliasDeclaration(d) || isInterfaceDeclaration(d) || isEnumDeclaration(d));

const resolveDeclarationFromSymbol = (symbol: Symbol | undefined, typeChecker: TypeChecker) => {
  let decl = pickDeclaration(symbol);
  if (!decl && symbol) {
    try {
      const aliased = typeChecker.getAliasedSymbol(symbol);
      const aliasedDecl = pickDeclaration(aliased);
      if (aliasedDecl) {
        decl = aliasedDecl;
      }
    } catch {
      // Not an alias; fall back to original symbol
    }
  }
  return decl;
};

const addDefinitionFromDeclaration = (
  decl: ReturnType<typeof pickDeclaration>,
  typeChecker: TypeChecker,
  seen: Set<string>,
  out: TypeDefinition[],
): void => {
  if (!decl || !(isTypeAliasDeclaration(decl) || isInterfaceDeclaration(decl) || isEnumDeclaration(decl))) {
    return;
  }
  const name = decl.name.text;
  if (BUILTIN_TYPE_NAMES.has(name) || seen.has(name)) {
    return;
  }
  seen.add(name);

  const sourceFile = decl.getSourceFile();
  if (sourceFile.fileName.includes("node_modules")) {
    return;
  }

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
};

const walkForTypeRefs = (node: Node, typeChecker: TypeChecker, seen: Set<string>, out: TypeDefinition[]): void => {
  if (isTypeReferenceNode(node)) {
    const sym = typeChecker.getSymbolAtLocation(node.typeName);
    addDefinitionFromDeclaration(resolveDeclarationFromSymbol(sym, typeChecker), typeChecker, seen, out);

    if (node.typeArguments) {
      node.typeArguments.forEach((arg) => walkForTypeRefs(arg, typeChecker, seen, out));
    }
    return;
  }

  forEachChild(node, (child) => walkForTypeRefs(child, typeChecker, seen, out));
};

const walkTypeForTypeRefs = (type: Type, typeChecker: TypeChecker, seen: Set<string>, out: TypeDefinition[]): void => {
  addDefinitionFromDeclaration(resolveDeclarationFromSymbol(type.getSymbol(), typeChecker), typeChecker, seen, out);

  const typeWithAlias = type as Type & { aliasSymbol?: Symbol };
  addDefinitionFromDeclaration(
    resolveDeclarationFromSymbol(typeWithAlias.aliasSymbol, typeChecker),
    typeChecker,
    seen,
    out,
  );

  const typeWithNested = type as Type & {
    aliasTypeArguments?: readonly Type[];
    typeArguments?: readonly Type[];
    types?: readonly Type[];
  };

  typeWithNested.aliasTypeArguments?.forEach((arg) => walkTypeForTypeRefs(arg, typeChecker, seen, out));
  typeWithNested.typeArguments?.forEach((arg) => walkTypeForTypeRefs(arg, typeChecker, seen, out));
  typeWithNested.types?.forEach((nested) => walkTypeForTypeRefs(nested, typeChecker, seen, out));
};
