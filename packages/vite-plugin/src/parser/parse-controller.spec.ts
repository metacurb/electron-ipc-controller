import path from "path";
import { createProgram, forEachChild, isClassDeclaration } from "typescript";

import { getDecorator } from "./get-decorator";
import { parseController } from "./parse-controller";
import { parseMethod } from "./parse-method";
import { MethodMetadata } from "./types";

jest.mock("./parse-method");

const mockParseMethod = jest.mocked(parseMethod);

describe("parseController", () => {
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
    mockParseMethod.mockReturnValue({
      decoratorName: "IpcHandle",
      name: "mockMethod",
      params: [],
      returnType: "void",
    } as unknown as MethodMetadata);
  });

  it("parses controller metadata calls parseMethod using IpcController decorator", () => {
    const { sourceFile, typeChecker } = parseFixture("counter.controller.ts");
    let parsed = false;

    forEachChild(sourceFile, (node) => {
      if (isClassDeclaration(node) && node.name?.text === "CounterController") {
        const decorator = getDecorator(node, "IpcController");
        if (decorator) {
          const metadata = parseController(node, decorator, sourceFile, typeChecker);
          expect(metadata.className).toBe("CounterController");
          expect(metadata.namespace).toBe("counter");
          expect(mockParseMethod).toHaveBeenCalled();
          expect(metadata.methods).toContainEqual(expect.objectContaining({ name: "mockMethod" }));
          parsed = true;
        }
      }
    });

    expect(parsed).toBe(true);
  });
});
