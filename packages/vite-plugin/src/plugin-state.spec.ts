import { PluginState } from "./plugin-state.js";

describe("PluginState", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("debounces scheduleGenerate calls", () => {
    const state = new PluginState(100);
    const callback = jest.fn();

    state.scheduleGenerate(callback);
    state.scheduleGenerate(callback);
    state.scheduleGenerate(callback);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("tracks file changes correctly", () => {
    const state = new PluginState();
    state.setControllerFiles(new Set(["/a.ts", "/b.ts"]));

    expect(state.shouldRegenerate("/a.ts", "/main.ts", "/preload.ts")).toBe(true);
    expect(state.shouldRegenerate("/c.ts", "/main.ts", "/preload.ts")).toBe(false);
    expect(state.shouldRegenerate("/main.ts", "/main.ts", "/preload.ts")).toBe(true);
    expect(state.shouldRegenerate("/preload.ts", "/main.ts", "/preload.ts")).toBe(true);
  });

  it("updates hash only when changed", () => {
    const state = new PluginState();

    expect(state.updateHash("hash1")).toBe(true);
    expect(state.updateHash("hash1")).toBe(false);
    expect(state.updateHash("hash2")).toBe(true);
  });

  it("updates metadata hash only when changed", () => {
    const state = new PluginState();

    expect(state.updateMetadataHash("meta1")).toBe(true);
    expect(state.updateMetadataHash("meta1")).toBe(false);
    expect(state.updateMetadataHash("meta2")).toBe(true);
  });

  it("claims initial generation only once", () => {
    const state = new PluginState();

    expect(state.claimInitialGeneration()).toBe(true);
    expect(state.claimInitialGeneration()).toBe(false);
  });
});
