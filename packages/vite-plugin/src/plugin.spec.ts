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
});
