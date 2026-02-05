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
  let namespace = className.replace(/Controller$/, "");
  namespace = namespace.charAt(0).toLowerCase() + namespace.slice(1);

  // Check for custom namespace argument: @Controller("custom")
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

  return {
    className,
    filePath: sourceFile.fileName,
    methods,
    namespace,
  };
};
