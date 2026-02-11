import path from "path";
import { Decorator } from "typescript";

import { extractControllerMetadata } from "./extract-metadata";
import { getDecorator } from "./get-decorator";
import { parseController } from "./parse-controller";
import { createFixtureProgram } from "./test-utils";
import { ControllerMetadata } from "./types";

jest.mock("./get-decorator");
jest.mock("./parse-controller");

const mockGetDecorator = jest.mocked(getDecorator);
const mockParseController = jest.mocked(parseController);

describe("extractControllerMetadata", () => {
  const fixturesDir = path.resolve(__dirname, "fixtures/simple");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls parseController when IpcController decorator is found", () => {
    mockGetDecorator.mockReturnValue({} as Decorator);
    mockParseController.mockReturnValue({
      className: "MockController",
      filePath: "/src/mock.controller.ts",
      methods: [],
      namespace: "mock",
      referencedTypes: [],
    });

    const { sourceFile, typeChecker } = createFixtureProgram(fixturesDir, "counter.controller.ts");
    const controllers = extractControllerMetadata(sourceFile, typeChecker);

    expect(mockGetDecorator).toHaveBeenCalledWith(expect.anything(), "IpcController");
    expect(mockParseController).toHaveBeenCalled();
    expect(controllers).toHaveLength(1);
    expect(controllers[0].className).toBe("MockController");
  });

  it("does not call parseController if decorator is not found", () => {
    mockGetDecorator.mockReturnValue(undefined);

    const { sourceFile, typeChecker } = createFixtureProgram(fixturesDir, "counter.controller.ts");
    const controllers = extractControllerMetadata(sourceFile, typeChecker);

    expect(mockGetDecorator).toHaveBeenCalled();
    expect(mockParseController).not.toHaveBeenCalled();
    expect(controllers).toHaveLength(0);
  });
});
