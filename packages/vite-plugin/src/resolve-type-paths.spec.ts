import path from "path";

import {
  DEFAULT_GLOBAL_TYPES_FILENAME,
  DEFAULT_MAIN_ENTRY,
  DEFAULT_PRELOAD_ENTRY,
  DEFAULT_RENDERER_RUNTIME_DIR,
  DEFAULT_RUNTIME_TYPES_FILENAME,
} from "./constants.js";
import { resolveTypePaths } from "./resolve-type-paths.js";

describe("defaults", () => {
  it("exposes main and preload defaults as constants", () => {
    expect(DEFAULT_MAIN_ENTRY).toBe("src/main/index.ts");
    expect(DEFAULT_PRELOAD_ENTRY).toBe("src/preload/index.ts");
  });

  it("resolves runtime and global paths with renderer dir present", () => {
    const root = "C:\\project";
    const preloadPath = path.join(root, DEFAULT_PRELOAD_ENTRY);

    const { globalPath, runtimePath } = resolveTypePaths({
      hasRendererRuntimeDir: (absPath) => absPath === path.join(root, DEFAULT_RENDERER_RUNTIME_DIR),
      preloadPath,
      root,
      types: {},
    });

    expect(runtimePath).toBe(path.join(root, DEFAULT_RENDERER_RUNTIME_DIR, DEFAULT_RUNTIME_TYPES_FILENAME));
    expect(globalPath).toBe(path.join(path.dirname(preloadPath), DEFAULT_GLOBAL_TYPES_FILENAME));
  });

  it("resolves runtime path outside renderer when renderer dir missing", () => {
    const root = "C:\\project";
    const preloadPath = path.join(root, DEFAULT_PRELOAD_ENTRY);

    const { globalPath, runtimePath } = resolveTypePaths({
      hasRendererRuntimeDir: () => false,
      preloadPath,
      root,
      types: {},
    });

    expect(runtimePath).toBe(path.join(root, "src", DEFAULT_RUNTIME_TYPES_FILENAME));
    expect(globalPath).toBe(path.join(path.dirname(preloadPath), DEFAULT_GLOBAL_TYPES_FILENAME));
  });

  it("honours explicit overrides and disabled flags", () => {
    const root = "/project";
    const preloadPath = path.join(root, DEFAULT_PRELOAD_ENTRY);

    const { globalPath, runtimePath } = resolveTypePaths({
      hasRendererRuntimeDir: () => true,
      preloadPath,
      root,
      types: {
        global: false,
        runtime: "custom/runtime.ts",
      },
    });

    expect(runtimePath).toBe(path.resolve(root, "custom/runtime.ts"));
    expect(globalPath).toBeNull();
  });
});
