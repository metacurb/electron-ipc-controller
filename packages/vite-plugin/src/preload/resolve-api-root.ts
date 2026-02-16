import { IPC_DEFAULT_API_ROOT } from "@electron-ipc-bridge/shared";
import fs from "fs";
import {
  createSourceFile,
  forEachChild,
  isCallExpression,
  isIdentifier,
  isObjectLiteralExpression,
  isPropertyAssignment,
  isStringLiteral,
  ScriptTarget,
} from "typescript";

export const resolveApiRootFromPreload = async (preloadPath: string): Promise<{ namespace: string; dependencies: Set<string> }> => {
  const dependencies = new Set<string>();
  dependencies.add(preloadPath);
  let namespace: string = IPC_DEFAULT_API_ROOT;

  try {
    const content = await fs.promises.readFile(preloadPath, "utf-8");
    const sourceFile = createSourceFile(preloadPath, content, ScriptTarget.Latest, true);

    const visit = (node: import("typescript").Node) => {
      if (isCallExpression(node) && isIdentifier(node.expression) && node.expression.text === "setupPreload") {
        const args = node.arguments;
        if (args.length > 0) {
          const first = args[0];
          if (isStringLiteral(first)) {
            namespace = first.text;
          } else if (isObjectLiteralExpression(first)) {
            const namespaceProp = first.properties.find(
              (p) => isPropertyAssignment(p) && isIdentifier(p.name) && p.name.text === "namespace",
            );
            if (namespaceProp && isPropertyAssignment(namespaceProp) && isStringLiteral(namespaceProp.initializer)) {
              namespace = namespaceProp.initializer.text;
            }
          }
        }
      }
      forEachChild(node, visit);
    };

    forEachChild(sourceFile, visit);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error;
    }
  }

  return { dependencies, namespace };
};
