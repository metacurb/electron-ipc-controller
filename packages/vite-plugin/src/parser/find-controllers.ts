import path from "path";
import {
  CompilerOptions,
  createProgram,
  findConfigFile,
  forEachChild,
  isCallExpression,
  isIdentifier,
  parseJsonConfigFileContent,
  readConfigFile,
  sys,
} from "typescript";

import { processCreateIpcAppCall } from "./process-create-ipc-app-call.js";
import { ControllerMetadata } from "./types.js";

export interface FindControllersResult {
  controllers: ControllerMetadata[];
  processedFiles: Set<string>;
}

export const findControllers = (entryFile: string, tsConfigPath?: string): FindControllersResult => {
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

  const program = createProgram([entryFile], compilerOptions);
  const typeChecker = program.getTypeChecker();
  const sourceFile = program.getSourceFile(entryFile);

  if (!sourceFile) {
    return { controllers: [], processedFiles: new Set() };
  }

  const controllers: ControllerMetadata[] = [];
  const processedFiles = new Set<string>();

  processedFiles.add(path.resolve(entryFile));

  forEachChild(sourceFile, function visit(node) {
    if (isCallExpression(node) && isIdentifier(node.expression) && node.expression.text === "createIpcApp") {
      processCreateIpcAppCall(node, typeChecker, processedFiles, controllers);
    }
    forEachChild(node, visit);
  });

  return { controllers, processedFiles };
};
