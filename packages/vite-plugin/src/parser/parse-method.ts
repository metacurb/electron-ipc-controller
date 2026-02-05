import {
  getModifiers,
  Identifier,
  isCallExpression,
  isStringLiteral,
  MethodDeclaration,
  SyntaxKind,
  TypeChecker,
} from "typescript";

import { getDecorator } from "./get-decorator.js";
import { MethodMetadata, ParamMetadata } from "./types.js";

const METHOD_DECORATORS = ["IpcHandle", "IpcOn", "IpcHandleOnce", "IpcOnce"] as const;
const INJECTION_DECORATORS = ["Sender", "RawEvent", "ProcessId", "Origin", "Window", "CorrelationId"];

export const parseMethod = (node: MethodDeclaration, typeChecker: TypeChecker): MethodMetadata | null => {
  const found = METHOD_DECORATORS.find((d) => getDecorator(node, d));
  if (!found) return null;

  const decorator = getDecorator(node, found)!;
  let name = (node.name as Identifier).text;

  // Check for custom method name: @IpcHandle("custom")
  if (isCallExpression(decorator.expression)) {
    const args = decorator.expression.arguments;
    if (args.length > 0 && isStringLiteral(args[0])) {
      name = args[0].text;
    }
  }

  const signature = typeChecker.getSignatureFromDeclaration(node);
  const returnType = signature ? typeChecker.typeToString(signature.getReturnType()) : "Promise<unknown>";

  const params: ParamMetadata[] = node.parameters.map((param) => {
    const type = typeChecker.getTypeAtLocation(param);
    const typeString = typeChecker.typeToString(type);

    return {
      name: param.name.getText(),
      optional: !!param.questionToken || !!param.initializer,
      type: typeString,
    };
  });

  const filteredParams = params.filter((_, index) => {
    const paramNode = node.parameters[index];
    const hasInjection = INJECTION_DECORATORS.some((d) => getDecorator(paramNode, d));
    return !hasInjection;
  });

  return {
    decoratorName: found,
    isAsync: !!getModifiers(node)?.some((m) => m.kind === SyntaxKind.AsyncKeyword),
    name,
    params: filteredParams,
    returnType,
  };
};
