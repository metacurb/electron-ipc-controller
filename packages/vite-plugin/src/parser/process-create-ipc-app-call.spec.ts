import path from "path";
import { forEachChild, isCallExpression, isIdentifier } from "typescript";

import { processCreateIpcAppCall } from "./process-create-ipc-app-call";
import { resolveController } from "./resolve-controller";
import { createFixtureProgram } from "./test-utils";
import { ControllerMetadata } from "./types";

jest.mock("./resolve-controller");

describe("processCreateIpcAppCall", () => {
  const fixturesDir = path.resolve(__dirname, "fixtures/simple");
  const nestFixturesDir = path.resolve(__dirname, "fixtures/nest-module");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("processes createIpcApp call and calls resolveController", () => {
    const { sourceFile, typeChecker } = createFixtureProgram(fixturesDir, "index.ts");
    const processedFiles = new Set<string>();
    const controllers: ControllerMetadata[] = [];
    let processed = false;

    forEachChild(sourceFile, function visit(node) {
      if (isCallExpression(node) && isIdentifier(node.expression) && node.expression.text === "createIpcApp") {
        processCreateIpcAppCall(node, typeChecker, processedFiles, controllers, new Map());
        processed = true;
      }
      forEachChild(node, visit);
    });

    expect(processed).toBe(true);
    expect(resolveController).toHaveBeenCalled();
  });

  it("resolves controllers from module providers when passed via helper", () => {
    const { sourceFile, typeChecker } = createFixtureProgram(nestFixturesDir, "index.ts");
    const processedFiles = new Set<string>();
    const controllers: ControllerMetadata[] = [];
    let processed = false;

    forEachChild(sourceFile, function visit(node) {
      if (isCallExpression(node) && isIdentifier(node.expression) && node.expression.text === "createIpcApp") {
        processCreateIpcAppCall(node, typeChecker, processedFiles, controllers, new Map());
        processed = true;
      }
      forEachChild(node, visit);
    });

    expect(processed).toBe(true);
    expect(resolveController).toHaveBeenCalledTimes(1);
  });
});
