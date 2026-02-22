import fs from "fs";
import path from "path";
import { Logger } from "vite";

import { generateIpc } from "./generate-ipc.js";
import { findControllers } from "./parser/find-controllers.js";
import { PluginState } from "./plugin-state.js";
import { resolveTypePaths } from "./resolve-type-paths.js";

jest.mock("fs");
jest.mock("path", () => {
  const originalPath = jest.requireActual<typeof import("path")>("path");

  return {
    ...originalPath,
    dirname: jest.fn(),
    relative: jest.fn(),
    resolve: jest.fn(),
  };
});

jest.mock("./generator/generate-global-types.js", () => ({
  generateGlobalTypes: jest.fn().mockReturnValue("mockGlobalTypes"),
}));

jest.mock("./generator/generate-runtime-types.js", () => ({
  generateRuntimeTypes: jest.fn().mockReturnValue("mockRuntimeTypes"),
}));

jest.mock("./parser/find-controllers.js", () => ({
  findControllers: jest.fn().mockReturnValue({
    controllers: ["mockController"],
    processedFiles: ["mockFile.ts"],
    program: {},
  }),
}));

jest.mock("./preload/resolve-api-root.js", () => ({
  resolveApiRootFromPreload: jest.fn().mockReturnValue({
    dependencies: ["mockPreloadDep.ts"],
    namespace: {},
  }),
}));

jest.mock("./resolve-type-paths.js", () => ({
  resolveTypePaths: jest.fn().mockReturnValue({
    globalPath: "/root/dist/global.d.ts",
    runtimePath: "/root/dist/runtime.ts",
  }),
}));

const mockExistsSync = jest.mocked(fs.existsSync);
const mockMkdirSync = jest.mocked(fs.mkdirSync);
const mockWriteFileSync = jest.mocked(fs.writeFileSync);
const mockResolve = jest.mocked(path.resolve);
const mockDirname = jest.mocked(path.dirname);
const mockRelative = jest.mocked(path.relative);

describe("generateIpc", () => {
  const mockRoot = "/root";
  const mockOptions = {
    main: "src/main.ts",
    preload: "src/preload.ts",
    types: {},
  };
  let mockState: PluginState;

  const mockLogger: jest.Mocked<Logger> = {
    clearScreen: jest.fn(),
    error: jest.fn(),
    hasErrorLogged: jest.fn(),
    hasWarned: false,
    info: jest.fn(),
    warn: jest.fn(),
    warnOnce: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockState = new PluginState();

    // Setup default mock behaviors
    mockExistsSync.mockReturnValue(true);
    mockMkdirSync.mockImplementation(() => "foo");
    mockWriteFileSync.mockImplementation(() => {});
    mockResolve.mockImplementation((...args: string[]) => args.join("/"));
    mockDirname.mockImplementation((p: string) => p.substring(0, p.lastIndexOf("/")));
    mockRelative.mockImplementation((_from: string, to: string) => `relative/${to}`);
  });

  it("should generate types when main entry exists", () => {
    generateIpc(mockRoot, mockLogger, mockState, mockOptions);

    expect(fs.existsSync).toHaveBeenCalledWith("/root/src/main.ts");
    expect(fs.writeFileSync).toHaveBeenCalledWith("/root/dist/runtime.ts", "mockRuntimeTypes");
    expect(fs.writeFileSync).toHaveBeenCalledWith("/root/dist/global.d.ts", "mockGlobalTypes");
  });

  it("should warn and return if main entry does not exist", () => {
    mockExistsSync.mockReturnValue(false);

    generateIpc(mockRoot, mockLogger, mockState, mockOptions);

    expect(mockLogger.warn).toHaveBeenCalledWith(expect.stringContaining("Main entry not found"));
    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });

  it("should pass resolutionStrategy to findControllers when provided", () => {
    generateIpc(mockRoot, mockLogger, mockState, {
      ...mockOptions,
      resolutionStrategy: "nest",
    });

    expect(findControllers).toHaveBeenCalledWith(expect.any(String), undefined, undefined, "nest");
  });

  it("should catch errors during generation and log them", () => {
    jest.mocked(findControllers).mockImplementationOnce(() => {
      throw new Error("mock error");
    });

    generateIpc(mockRoot, mockLogger, mockState, mockOptions);

    expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining("Type generation failed: mock error"));
  });

  it("should warn if no createIpcApp call found", () => {
    jest.mocked(findControllers).mockReturnValueOnce({
      controllers: [],
      processedFiles: ["mockFile.ts"],
      program: {},
    } as any);

    generateIpc(mockRoot, mockLogger, mockState, mockOptions);

    expect(mockLogger.warn).toHaveBeenCalledWith(expect.stringContaining("No createIpcApp() call found"));
  });

  it("should warn if both runtime and global type outputs are disabled", () => {
    jest.mocked(resolveTypePaths).mockReturnValueOnce({
      globalPath: undefined,
      runtimePath: undefined,
    } as any);

    generateIpc(mockRoot, mockLogger, mockState, mockOptions);

    expect(mockLogger.warn).toHaveBeenCalledWith(
      expect.stringContaining("Both runtime and global type outputs are disabled"),
    );
  });
});
