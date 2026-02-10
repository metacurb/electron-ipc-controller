import { IPC_DEFAULT_API_ROOT } from "@electron-ipc-controller/shared";
import fs from "fs";
import {
  createSourceFile,
  forEachChild,
  isCallExpression,
  isIdentifier,
  isStringLiteral,
  Node,
  ScriptKind,
  ScriptTarget,
} from "typescript";

export const resolveApiRootFromPreload = (preloadPath: string): string => {
  if (!fs.existsSync(preloadPath)) return IPC_DEFAULT_API_ROOT;
  const sourceText = fs.readFileSync(preloadPath, "utf8");
  const sourceFile = createSourceFile(preloadPath, sourceText, ScriptTarget.Latest, true, ScriptKind.TS);
  let found: string | null = null;
  const visit = (node: Node) => {
    if (found) return;
    if (isCallExpression(node)) {
      if (isIdentifier(node.expression) && node.expression.text === "setupPreload") {
        const args = node.arguments;
        if (args.length === 0) {
          found = IPC_DEFAULT_API_ROOT;
          return;
        }
        if (args.length > 0 && isStringLiteral(args[0])) {
          found = args[0].text;
          return;
        }
      }
    }
    forEachChild(node, visit);
  };
  forEachChild(sourceFile, visit);
  return found || IPC_DEFAULT_API_ROOT;
};
