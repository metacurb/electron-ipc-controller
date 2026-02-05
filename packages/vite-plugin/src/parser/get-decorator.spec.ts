import path from "path";
import { createProgram, forEachChild, isClassDeclaration } from "typescript";

import { getDecorator } from "./get-decorator";

describe("getDecorator", () => {
  const fixturesDir = path.resolve(__dirname, "fixtures/simple");

  const parseFixture = (filename: string) => {
    const filePath = path.join(fixturesDir, filename);

    const program = createProgram([filePath], {
      emitDecoratorMetadata: true,
      experimentalDecorators: true,
    });

    const sourceFile = program.getSourceFile(filePath);
    if (!sourceFile) throw new Error(`Could not get source file: ${filePath}`);

    return sourceFile;
  };

  it("finds a decorator by name", () => {
    const sourceFile = parseFixture("counter.controller.ts");
    let found = false;

    forEachChild(sourceFile, (node) => {
      if (isClassDeclaration(node) && node.name?.text === "CounterController") {
        const decorator = getDecorator(node, "IpcController");
        expect(decorator).toBeDefined();
        found = true;
      }
    });

    expect(found).toBe(true);
  });

  it("returns undefined if decorator is not found", () => {
    const sourceFile = parseFixture("counter.controller.ts");
    let checked = false;

    forEachChild(sourceFile, (node) => {
      if (isClassDeclaration(node) && node.name?.text === "CounterController") {
        const decorator = getDecorator(node, "NonExistentDecorator");
        expect(decorator).toBeUndefined();
        checked = true;
      }
    });

    expect(checked).toBe(true);
  });
});
