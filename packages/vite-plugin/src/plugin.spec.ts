import { electronIpcBridge } from "./plugin";

describe("electronIpcBridge", () => {
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
    const mockLogger = {
      error: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
    };
    const plugin = electronIpcBridge({
      logger: mockLogger,
    });

    if (plugin.buildStart) {
      await plugin.buildStart();
    }

    // Since main entry likely doesn't exist, it should warn
    expect(mockLogger.warn).toHaveBeenCalled();
    expect(mockLogger.warn).toHaveBeenCalledWith(expect.stringContaining("Main entry not found at"));
  });

  it("should use default logger if none provided", async () => {
    const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();

    const plugin = electronIpcBridge();
    if (plugin.buildStart) {
      await plugin.buildStart();
    }

    expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining("Main entry not found at"));

    consoleWarnSpy.mockRestore();
  });
});
