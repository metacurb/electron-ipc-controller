import type { Signature } from "typescript";
import { createPrinter, EmitHint, MethodDeclaration, TypeChecker, TypeFormatFlags } from "typescript";

import { isTruncatedTypeString } from "./is-truncated-type-string.js";

const printer = createPrinter();

export const resolveReturnType = (
  node: MethodDeclaration,
  signature: Signature | undefined,
  typeChecker: TypeChecker,
): string => {
  if (node.type) {
    return printer.printNode(EmitHint.Unspecified, node.type, node.getSourceFile()).trim();
  }
  const inferred =
    signature != null
      ? typeChecker.typeToString(signature.getReturnType(), undefined, TypeFormatFlags.NoTruncation)
      : "unknown";
  return isTruncatedTypeString(inferred) ? "unknown" : inferred;
};
