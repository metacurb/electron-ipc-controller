// Must mock vite before importing plugin
const mockViteLogger = {
  clearScreen: jest.fn(),
  error: jest.fn(),
  hasErrorLogged: jest.fn(),
  hasWarned: false,
  info: jest.fn(),
  warn: jest.fn(),
  warnOnce: jest.fn(),
};

jest.mock("vite", () => ({
  createLogger: jest.fn(() => mockViteLogger),
}));

import { createLogger } from "vite";

import { electronIpcBridge } from "./plugin";

describe("electronIpcBridge", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockViteLogger.warn.mockClear();
    mockViteLogger.info.mockClear();
    mockViteLogger.error.mockClear();
  });

  it("should return a plugin object", () => {
    const plugin = electronIpcBridge();
    expect(plugin.name).toBe("electron-ipc-bridge");
    expect(typeof plugin.configureServer).toBe("function");
    expect(typeof plugin.transform).toBe("function");
    expect(typeof plugin.buildStart).toBe("function");
  });

  it("should accept options", () => {
    const plugin = electronIpcBridge({
      main: "custom/main.ts",
      preload: "custom/preload.ts",
    });
    expect(plugin.name).toBe("electron-ipc-bridge");
  });

  it("should use custom logger", async () => {
    const customLogger = {
      clearScreen: jest.fn(),
      error: jest.fn(),
      hasErrorLogged: jest.fn(),
      hasWarned: false,
      info: jest.fn(),
      warn: jest.fn(),
      warnOnce: jest.fn(),
    };
    const plugin = electronIpcBridge({
      // @ts-expect-error Mocking partial logger
      logger: customLogger,
    });

    if (plugin.configResolved) {
      // @ts-expect-error Mocking partial config
      await plugin.configResolved({
        clearScreen: true,
        customLogger: undefined,
        logLevel: "info",
        root: process.cwd(),
      });
    }

    if (plugin.buildStart) {
      await plugin.buildStart();
    }

    // Since main entry likely doesn't exist, it should warn using CUSTOM logger
    expect(customLogger.warn).toHaveBeenCalled();
    expect(customLogger.warn).toHaveBeenCalledWith(expect.stringContaining("Main entry not found at"));

    // Should NOT use vite's default logger
    expect(mockViteLogger.warn).not.toHaveBeenCalled();
  });

  it("should use default logger if none provided", async () => {
    const plugin = electronIpcBridge();

    if (plugin.configResolved) {
      // @ts-expect-error Mocking partial config
      await plugin.configResolved({
        clearScreen: true,
        customLogger: undefined,
        logLevel: "info",
        root: process.cwd(),
      });
    }

    if (plugin.buildStart) {
      await plugin.buildStart();
    }

    // Should call createLogger
    expect(createLogger).toHaveBeenCalledWith("info", expect.objectContaining({
      allowClearScreen: true,
      prefix: expect.stringContaining("electron-ipc-bridge"),
    }));

    // Should use the logger returned by createLogger (which is mockViteLogger)
    expect(mockViteLogger.warn).toHaveBeenCalledWith(expect.stringContaining("Main entry not found at"));
  });
});
