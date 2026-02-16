import fs from "fs";
import path from "path";

import { generateIpc } from "./generate-ipc.js";
import { PluginState } from "./plugin-state.js";

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
    generateIpc(mockRoot, mockState, mockOptions);

    expect(fs.existsSync).toHaveBeenCalledWith("/root/src/main.ts");
    expect(fs.writeFileSync).toHaveBeenCalledWith("/root/dist/runtime.ts", "mockRuntimeTypes");
    expect(fs.writeFileSync).toHaveBeenCalledWith("/root/dist/global.d.ts", "mockGlobalTypes");
  });

  it("should warn and return if main entry does not exist", () => {
    mockExistsSync.mockReturnValue(false);
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    generateIpc(mockRoot, mockState, mockOptions);

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Main entry not found"));
    expect(fs.writeFileSync).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
