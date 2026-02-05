import path from "path";
import { createProgram, forEachChild, isCallExpression, isIdentifier } from "typescript";

import { processCreateIpcAppCall } from "./process-create-ipc-app-call";
import { resolveController } from "./resolve-controller";
import { ControllerMetadata } from "./types";

jest.mock("./resolve-controller");

describe("processCreateIpcAppCall", () => {
  const fixturesDir = path.resolve(__dirname, "fixtures/simple");

  const parseFixture = (filename: string) => {
    const filePath = path.join(fixturesDir, filename);

    const program = createProgram([filePath], {
      emitDecoratorMetadata: true,
      experimentalDecorators: true,
    });

    const sourceFile = program.getSourceFile(filePath);
    if (!sourceFile) throw new Error(`Could not get source file: ${filePath}`);

    return { sourceFile, typeChecker: program.getTypeChecker() };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("processes createIpcApp call and calls resolveController", () => {
    const { sourceFile, typeChecker } = parseFixture("index.ts");
    const processedFiles = new Set<string>();
    const controllers: ControllerMetadata[] = [];
    let processed = false;

    forEachChild(sourceFile, function visit(node) {
      if (isCallExpression(node) && isIdentifier(node.expression) && node.expression.text === "createIpcApp") {
        processCreateIpcAppCall(node, typeChecker, processedFiles, controllers);
        processed = true;
      }
      forEachChild(node, visit);
    });

    expect(processed).toBe(true);
    expect(resolveController).toHaveBeenCalled();
  });
});
