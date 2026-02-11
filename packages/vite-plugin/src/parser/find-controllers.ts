import path from "path";
import {
  CallExpression,
  CompilerOptions,
  createProgram,
  findConfigFile,
  forEachChild,
  isCallExpression,
  isIdentifier,
  parseJsonConfigFileContent,
  Program,
  readConfigFile,
  sys,
  TypeChecker,
} from "typescript";

import { processCreateIpcAppCall } from "./process-create-ipc-app-call.js";
import { ControllerMetadata } from "./types.js";

export interface FindControllersResult {
  controllers: ControllerMetadata[];
  processedFiles: Set<string>;
  program: Program;
}

const isCreateIpcAppCall = (node: CallExpression, typeChecker: TypeChecker): boolean => {
  if (!isIdentifier(node.expression)) return false;
  const sym = typeChecker.getSymbolAtLocation(node.expression);
  if (!sym) return false;
  let target = sym;
  try {
    const aliased = typeChecker.getAliasedSymbol(sym);
    if (aliased) target = aliased;
  } catch {
    // Not an alias; use original symbol (e.g. local createIpcApp)
  }
  return target.name === "createIpcApp";
};

export const findControllers = (
  entryFile: string,
  tsConfigPath?: string,
  oldProgram?: Program,
): FindControllersResult => {
  const searchConfig = tsConfigPath || "tsconfig.node.json";
  let configFile = findConfigFile(path.dirname(entryFile), sys.fileExists, searchConfig);

  if (!configFile && !tsConfigPath) {
    configFile = findConfigFile(path.dirname(entryFile), sys.fileExists, "tsconfig.json");
  }

  let compilerOptions: CompilerOptions = {};
  if (configFile) {
    const { config } = readConfigFile(configFile, sys.readFile);
    const { options } = parseJsonConfigFileContent(config, sys, path.dirname(configFile));
    compilerOptions = options;
  }

  const program = createProgram([entryFile], compilerOptions, undefined, oldProgram);
  const typeChecker = program.getTypeChecker();
  const sourceFile = program.getSourceFile(entryFile);

  if (!sourceFile) {
    return { controllers: [], processedFiles: new Set(), program };
  }

  const controllers: ControllerMetadata[] = [];
  const processedFiles = new Set<string>();
  const fileCache = new Map<string, ControllerMetadata[]>();

  processedFiles.add(path.resolve(entryFile));

  forEachChild(sourceFile, function visit(node) {
    if (isCallExpression(node) && isCreateIpcAppCall(node, typeChecker)) {
      processCreateIpcAppCall(node, typeChecker, processedFiles, controllers, fileCache);
    }
    forEachChild(node, visit);
  });

  return { controllers, processedFiles, program };
};
