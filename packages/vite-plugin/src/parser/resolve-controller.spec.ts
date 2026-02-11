import path from "path";
import {
  forEachChild,
  isArrayLiteralExpression,
  isCallExpression,
  isIdentifier,
  isObjectLiteralExpression,
  isPropertyAssignment,
} from "typescript";

import { extractControllerMetadata } from "./extract-metadata";
import { resolveController } from "./resolve-controller";
import { createFixtureProgram } from "./test-utils";
import { ControllerMetadata } from "./types";

jest.mock("./extract-metadata");

const mockExtractControllerMetadata = jest.mocked(extractControllerMetadata);

describe("resolveController", () => {
  const fixturesDir = path.resolve(__dirname, "fixtures/simple");

  beforeEach(() => {
    jest.clearAllMocks();
    mockExtractControllerMetadata.mockReturnValue([
      { className: "OtherController", namespace: "other", referencedTypes: [] },
      { className: "CounterController", namespace: "counter", referencedTypes: [] },
    ] as ControllerMetadata[]);
  });

  it("resolves controller from symbol and pushes only the matching class", () => {
    const { sourceFile, typeChecker } = createFixtureProgram(fixturesDir, "index.ts");
    const processedFiles = new Set<string>();
    const controllers: ControllerMetadata[] = [];
    const fileCache = new Map<string, ControllerMetadata[]>();
    let resolved = false;

    forEachChild(sourceFile, function visit(node) {
      if (isCallExpression(node) && isIdentifier(node.expression) && node.expression.text === "createIpcApp") {
        const options = node.arguments[0];
        if (isObjectLiteralExpression(options)) {
          const prop = options.properties.find((p) => p.name?.getText() === "controllers");
          if (prop && isPropertyAssignment(prop) && isArrayLiteralExpression(prop.initializer)) {
            const controllerRef = prop.initializer.elements[0];
            resolveController(controllerRef, typeChecker, processedFiles, controllers, fileCache);
            resolved = true;
          }
        }
      }
      forEachChild(node, visit);
    });

    expect(resolved).toBe(true);
    expect(extractControllerMetadata).toHaveBeenCalled();
    expect(controllers).toHaveLength(1);
    expect(controllers[0].className).toBe("CounterController");
    expect(controllers[0].namespace).toBe("counter");
    expect(processedFiles.size).toBe(1);
  });
});
