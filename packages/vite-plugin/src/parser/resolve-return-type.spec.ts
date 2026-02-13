import path from "path";
import { forEachChild, isClassDeclaration, isMethodDeclaration, MethodDeclaration, SourceFile } from "typescript";

import { resolveReturnType } from "./resolve-return-type";
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

describe("resolveReturnType", () => {
  const fixturesDir = path.resolve(__dirname, "fixtures/simple");

  it("uses declared return type when annotation is present", () => {
    const { sourceFile, typeChecker } = createFixtureProgram(fixturesDir, "counter.controller.ts");
    const method = getMethod(sourceFile, "CounterController", "getCount");
    const signature = typeChecker.getSignatureFromDeclaration(method);

    expect(resolveReturnType(method, signature ?? undefined, typeChecker)).toBe("number");
  });

  it("uses inferred return type when no annotation", () => {
    const { sourceFile, typeChecker } = createFixtureProgram(fixturesDir, "counter.controller.ts");
    const method = getMethod(sourceFile, "CounterController", "noReturnType");
    const signature = typeChecker.getSignatureFromDeclaration(method);

    expect(resolveReturnType(method, signature ?? undefined, typeChecker)).toBe("number");
  });

  it("falls back to unknown when signature is undefined", () => {
    const { sourceFile, typeChecker } = createFixtureProgram(fixturesDir, "counter.controller.ts");
    const method = getMethod(sourceFile, "CounterController", "noReturnType");

    expect(resolveReturnType(method, undefined, typeChecker)).toBe("unknown");
  });
});
