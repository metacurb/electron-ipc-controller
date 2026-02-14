import { IPC_METHOD_DECORATOR_NAMES, IPC_PARAM_INJECTION_DECORATOR_NAMES } from "@electron-ipc-bridge/shared";
import type { Decorator } from "typescript";
import { Identifier, isCallExpression, isStringLiteral, MethodDeclaration, TypeChecker } from "typescript";

import { collectTypeDefinitions, collectTypeDefinitionsFromType } from "./extract-type.js";
import { getDecorator } from "./get-decorator.js";
import { resolveReturnType } from "./resolve-return-type.js";
import { MethodMetadata, ParamMetadata, TypeDefinition } from "./types.js";

export const parseMethod = (node: MethodDeclaration, typeChecker: TypeChecker): MethodMetadata | null => {
  let found: (typeof IPC_METHOD_DECORATOR_NAMES)[number] | null = null;
  let decorator: Decorator | null = null;
  for (const d of IPC_METHOD_DECORATOR_NAMES) {
    const dec = getDecorator(node, d);
    if (dec) {
      found = d;
      decorator = dec;
      break;
    }
  }
  if (!found || !decorator) return null;

  let name = (node.name as Identifier).text;

  if (isCallExpression(decorator.expression)) {
    const args = decorator.expression.arguments;
    if (args.length > 0 && isStringLiteral(args[0])) {
      name = args[0].text;
    }
  }

  const signature = typeChecker.getSignatureFromDeclaration(node);
  const returnType = resolveReturnType(node, signature ?? undefined, typeChecker);

  const referencedTypes: TypeDefinition[] = [];
  const seen = new Set<string>();

  const paramInfos = node.parameters.map((param) => {
    const hasInjection = IPC_PARAM_INJECTION_DECORATOR_NAMES.some((d) => getDecorator(param, d));
    return { hasInjection, param };
  });

  const params: ParamMetadata[] = [];
  for (const { hasInjection, param } of paramInfos) {
    const type = typeChecker.getTypeAtLocation(param);
    const typeString = typeChecker.typeToString(type);
    const extracted = !hasInjection && param.type ? collectTypeDefinitions(param.type, typeChecker, seen) : [];
    referencedTypes.push(...extracted);
    params.push({
      name: param.name.getText(),
      optional: !!param.questionToken || !!param.initializer,
      type: typeString,
    });
  }

  const filteredParams = params.filter((_, index) => !paramInfos[index].hasInjection);

  if (node.type) {
    const returnTypeRefs = collectTypeDefinitions(node.type, typeChecker, seen);
    referencedTypes.push(...returnTypeRefs);
  } else if (signature) {
    const returnTypeRefs = collectTypeDefinitionsFromType(signature.getReturnType(), typeChecker, seen);
    referencedTypes.push(...returnTypeRefs);
  }

  return {
    decoratorName: found,
    name,
    params: filteredParams,
    referencedTypes,
    returnType,
  };
};
