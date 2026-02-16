import path from "path";
import { createLogger, type Logger, type Plugin } from "vite";

import { DEFAULT_MAIN_ENTRY, DEFAULT_PRELOAD_ENTRY } from "./constants.js";
import { generateIpc } from "./generate-ipc.js";
import { normalizePath } from "./normalize-path.js";
import { PluginState } from "./plugin-state.js";
import type { electronIpcBridgePlugin, PluginOptions } from "./types.js";
import { ConsoleLogger } from "./utils/logger.js";

export { type electronIpcBridgePlugin, type PluginOptions, type PluginTypesOptions } from "./types.js";

/**
 * Creates a Vite plugin that generates TypeScript type definitions
 * for your IPC controllers, enabling type-safe `window` usage in the renderer.
 *
 * @param options - Plugin configuration
 * @returns Vite plugin instance
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import { electronIpcBridge } from "@electron-ipc-bridge/vite-plugin";
 *
 * export default defineConfig({
 *   plugins: [electronIpcBridge(options)],
 * });
 * ```
 */
export function electronIpcBridge({
  main = DEFAULT_MAIN_ENTRY,
  preload = DEFAULT_PRELOAD_ENTRY,
  types = {},
}: PluginOptions = {}): electronIpcBridgePlugin {
  let root = process.cwd();
  const state = new PluginState();
  const logger = new ConsoleLogger(`[${pkg.name}]`);

  const generate = () => {
    generateIpc(root, state, { main, preload, types });
  };

  return {
    buildStart() {
      if (state.claimInitialGeneration()) {
        generate();
      }
    },
    configResolved(config) {
      root = config.root;
    },
    configureServer(server) {
      const preloadPath = path.resolve(root, preload);
      server.watcher.add(preloadPath);
      server.watcher.on("change", (file) => {
        if (normalizePath(file) === normalizePath(preloadPath)) {
          state.scheduleGenerate(generate);
        }
      });
    },
    name: "electron-ipc-bridge",
    transform(_code, id) {
      if (id.includes("node_modules") || id.endsWith(".d.ts")) return null;

      const absId = normalizePath(path.resolve(id));
      const mainEntryPath = normalizePath(path.resolve(root, main));
      const preloadEntryPath = normalizePath(path.resolve(root, preload));

      if (state.shouldRegenerate(absId, mainEntryPath, preloadEntryPath)) {
        state.scheduleGenerate(generate);
      }
      return null;
    },
  };
}
