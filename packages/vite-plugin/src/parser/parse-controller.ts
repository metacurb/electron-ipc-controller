import { deriveNamespace } from "@electron-ipc-bridge/shared";
import {
  ClassDeclaration,
  Decorator,
  isCallExpression,
  isIdentifier,
  isMethodDeclaration,
  isStringLiteral,
  SourceFile,
  TypeChecker,
} from "typescript";

import { parseMethod } from "./parse-method.js";
import { ControllerMetadata, MethodMetadata } from "./types.js";

export const parseController = (
  node: ClassDeclaration,
  decorator: Decorator,
  sourceFile: SourceFile,
  typeChecker: TypeChecker,
): ControllerMetadata => {
  const className = node.name!.text;
  let namespace = deriveNamespace(className);

  if (isCallExpression(decorator.expression)) {
    const args = decorator.expression.arguments;
    if (args.length > 0 && isStringLiteral(args[0])) {
      namespace = args[0].text;
    }
  }

  const methods: MethodMetadata[] = [];

  node.members.forEach((member) => {
    if (isMethodDeclaration(member) && member.name && isIdentifier(member.name)) {
      const methodMeta = parseMethod(member, typeChecker);
      if (methodMeta) {
        methods.push(methodMeta);
      }
    }
  });

  const referencedTypes = methods.flatMap((m) => m.referencedTypes);

  return {
    className,
    filePath: sourceFile.fileName,
    methods,
    namespace,
    referencedTypes,
  };
};
