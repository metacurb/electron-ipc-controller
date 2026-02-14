import path from "path";
import { forEachChild, isClassDeclaration, isMethodDeclaration, MethodDeclaration, Node, SourceFile } from "typescript";

import { collectTypeDefinitions, collectTypeDefinitionsFromType } from "./extract-type";
import { createFixtureProgram } from "./test-utils";

const fixturesDir = path.resolve(__dirname, "fixtures/complex-types");

const getControllerMethodParamType = (sourceFile: SourceFile, className: string, methodName: string): Node => {
  let typeNode: Node | undefined;

  forEachChild(sourceFile, (node) => {
    if (isClassDeclaration(node) && node.name?.text === className) {
      node.members.forEach((member) => {
        if (isMethodDeclaration(member) && member.name.getText() === methodName && member.parameters[0]?.type) {
          typeNode = member.parameters[0].type;
        }
      });
    }
  });

  if (!typeNode) {
    throw new Error(`Type node for ${className}.${methodName} parameter not found`);
  }

  return typeNode;
};

const getControllerMethod = (sourceFile: SourceFile, className: string, methodName: string): MethodDeclaration => {
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
    throw new Error(`Method node for ${className}.${methodName} not found`);
  }

  return method;
};

describe("collectTypeDefinitions", () => {
  it("extracts custom types from complex-types fixture and recurses into referenced types", () => {
    const { sourceFile, typeChecker } = createFixtureProgram(fixturesDir, "types.controller.ts");

    const typeNode = getControllerMethodParamType(sourceFile, "TypesController", "test");
    const results = collectTypeDefinitions(typeNode, typeChecker);

    const names = results.map((r) => r.name);
    expect(names).toContain("ComplexInput");

    const complex = results.find((r) => r.name === "ComplexInput");
    expect(complex).toBeDefined();
    const nestedNames = complex!.referencedTypes.map((r) => r.name);
    expect(nestedNames).toContain("AnotherType");
  });

  it("deduplicates with shared seen set", () => {
    const { sourceFile, typeChecker } = createFixtureProgram(fixturesDir, "types.controller.ts");
    const typeNode = getControllerMethodParamType(sourceFile, "TypesController", "test");

    const seen = new Set<string>();
    const first = collectTypeDefinitions(typeNode, typeChecker, seen);
    const second = collectTypeDefinitions(typeNode, typeChecker, seen);

    expect(first.length).toBeGreaterThan(0);
    expect(second.length).toBe(0);
  });

  it("strips export and declare keywords from emitted definitions", () => {
    const { sourceFile, typeChecker } = createFixtureProgram(fixturesDir, "types.controller.ts");
    const typeNode = getControllerMethodParamType(sourceFile, "TypesController", "test");

    const results = collectTypeDefinitions(typeNode, typeChecker);

    expect(results.length).toBeGreaterThan(0);
    for (const def of results) {
      expect(def.definition.startsWith("export ")).toBe(false);
      expect(def.definition.startsWith("declare ")).toBe(false);
    }
  });

  it("collects definitions from inferred return type symbols", () => {
    const simpleDir = path.resolve(__dirname, "fixtures/simple");
    const { sourceFile, typeChecker } = createFixtureProgram(simpleDir, "counter.controller.ts");

    const method = getControllerMethod(sourceFile, "CounterController", "getInferredList");
    const signature = typeChecker.getSignatureFromDeclaration(method);

    expect(signature).toBeDefined();
    const results = collectTypeDefinitionsFromType(signature!.getReturnType(), typeChecker);
    const names = results.map((r) => r.name);
    expect(names).toContain("ListModel");
  });
});
