import { IPC_DEFAULT_API_ROOT } from "@electron-ipc-controller/shared";
import fs from "fs";
import {
  createSourceFile,
  forEachChild,
  isCallExpression,
  isIdentifier,
  isStringLiteral,
  ScriptTarget,
} from "typescript";

export const resolveApiRootFromPreload = (preloadPath: string): { namespace: string; dependencies: Set<string> } => {
  const dependencies = new Set<string>();
  dependencies.add(preloadPath);
  let namespace: string = IPC_DEFAULT_API_ROOT;

  if (!fs.existsSync(preloadPath)) {
    return { dependencies, namespace };
  }

  const content = fs.readFileSync(preloadPath, "utf-8");
  const sourceFile = createSourceFile(preloadPath, content, ScriptTarget.Latest, true);

  const visit = (node: import("typescript").Node) => {
    if (isCallExpression(node) && isIdentifier(node.expression) && node.expression.text === "setupPreload") {
      const args = node.arguments;
      if (args.length > 0 && isStringLiteral(args[0])) {
        namespace = args[0].text;
      }
    }
    forEachChild(node, visit);
  };

  forEachChild(sourceFile, visit);

  return { dependencies, namespace };
};
