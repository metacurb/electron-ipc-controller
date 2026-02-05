import path from "path";
import {
  createProgram,
  forEachChild,
  isArrayLiteralExpression,
  isCallExpression,
  isIdentifier,
  isObjectLiteralExpression,
  isPropertyAssignment,
} from "typescript";

import { extractControllerMetadata } from "./extract-metadata";
import { resolveController } from "./resolve-controller";
import { ControllerMetadata } from "./types";

jest.mock("./extract-metadata");

const mockExtractControllerMetadata = jest.mocked(extractControllerMetadata);

describe("resolveController", () => {
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
    mockExtractControllerMetadata.mockReturnValue([{ className: "MockController" }] as ControllerMetadata[]);
  });

  it("resolves controller from symbol and calls extractControllerMetadata", () => {
    const { sourceFile, typeChecker } = parseFixture("index.ts");
    const processedFiles = new Set<string>();
    const controllers: ControllerMetadata[] = [];
    let resolved = false;

    forEachChild(sourceFile, function visit(node) {
      if (isCallExpression(node) && isIdentifier(node.expression) && node.expression.text === "createIpcApp") {
        const options = node.arguments[0];
        if (isObjectLiteralExpression(options)) {
          const prop = options.properties.find((p) => p.name?.getText() === "controllers");
          if (prop && isPropertyAssignment(prop) && isArrayLiteralExpression(prop.initializer)) {
            const controllerRef = prop.initializer.elements[0];
            resolveController(controllerRef, typeChecker, processedFiles, controllers);
            resolved = true;
          }
        }
      }
      forEachChild(node, visit);
    });

    expect(resolved).toBe(true);
    expect(extractControllerMetadata).toHaveBeenCalled();
    expect(controllers).toHaveLength(1);
    expect(controllers[0].className).toBe("MockController");
    expect(processedFiles.size).toBe(1);
  });
});
