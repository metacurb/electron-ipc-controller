import path from "path";
import { createProgram, Decorator } from "typescript";

import { extractControllerMetadata } from "./extract-metadata";
import { getDecorator } from "./get-decorator";
import { parseController } from "./parse-controller";
import { ControllerMetadata } from "./types";

jest.mock("./get-decorator");
jest.mock("./parse-controller");

const mockGetDecorator = jest.mocked(getDecorator);
const mockParseController = jest.mocked(parseController);

describe("extractControllerMetadata", () => {
  const fixturesDir = path.resolve(__dirname, "fixtures/simple");

  const parseFixture = (filename: string) => {
    const filePath = path.join(fixturesDir, filename);

    const program = createProgram([filePath], {
      emitDecoratorMetadata: true,
      experimentalDecorators: true,
    });

    const sourceFile = program.getSourceFile(filePath);
    if (!sourceFile) throw new Error(`Could not get source file: ${filePath}`);

    const typeChecker = program.getTypeChecker();
    return extractControllerMetadata(sourceFile, typeChecker);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls parseController when IpcController decorator is found", () => {
    mockGetDecorator.mockReturnValue({} as Decorator);
    mockParseController.mockReturnValue({ className: "MockController", namespace: "mock" } as ControllerMetadata);

    const controllers = parseFixture("counter.controller.ts");

    expect(mockGetDecorator).toHaveBeenCalledWith(expect.anything(), "IpcController");
    expect(mockParseController).toHaveBeenCalled();
    expect(controllers).toHaveLength(1);
    expect(controllers[0].className).toBe("MockController");
  });

  it("does not call parseController if decorator is not found", () => {
    mockGetDecorator.mockReturnValue(undefined);

    const controllers = parseFixture("counter.controller.ts");

    expect(mockGetDecorator).toHaveBeenCalled();
    expect(mockParseController).not.toHaveBeenCalled();
    expect(controllers).toHaveLength(0);
  });
});
