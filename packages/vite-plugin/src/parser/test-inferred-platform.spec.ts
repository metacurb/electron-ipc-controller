import path from "path";
import { forEachChild, isClassDeclaration, isMethodDeclaration, MethodDeclaration, SourceFile } from "typescript";

import { parseMethod } from "./parse-method";
import { createFixtureProgram } from "./test-utils";

const getMethod = (sourceFile: SourceFile, className: string, methodName: string): MethodDeclaration => {
  let method: MethodDeclaration | undefined;

  forEachChild(sourceFile, (node) => {
    if (isClassDeclaration(node) && node.name?.text === className) {
      node.members.forEach((member) => {
        if (isMethodDeclaration(member) && member.name.getText() === methodName) {
          method = member;
        }
      });
    }
  });

  if (!method) {
    throw new Error(`Method ${className}.${methodName} not found in source file`);
  }
  return method;
};

describe("parseMethod with inferred types", () => {
  const nodeTypesFixturesDir = path.resolve(__dirname, "fixtures/node-types");

  it("handles inferred Platform type correctly", () => {
    const { sourceFile, typeChecker } = createFixtureProgram(nodeTypesFixturesDir, "inferred-platform.controller.ts", {
      types: ["node"],
    });
    const method = getMethod(sourceFile, "InferredPlatformController", "getPlatform");

    const metadata = parseMethod(method, typeChecker);

    expect(metadata).toBeDefined();
    expect(metadata?.returnType).toBe("NodeJS.Platform");
    expect(metadata?.requiredReferenceTypes).toContain("node");
  });
});
