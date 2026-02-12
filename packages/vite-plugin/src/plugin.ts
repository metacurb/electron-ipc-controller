import crypto from "crypto";
import fs from "fs";
import path from "path";

import pkg from "../package.json" with { type: "json" };

import { DEFAULT_MAIN_ENTRY, DEFAULT_PRELOAD_ENTRY } from "./constants.js";
import { generateGlobalTypes } from "./generator/generate-global-types.js";
import { generateRuntimeTypes } from "./generator/generate-runtime-types.js";
import { normalizePath } from "./normalize-path.js";
import { findControllers } from "./parser/find-controllers.js";
import { PluginState } from "./plugin-state.js";
import { resolveApiRootFromPreload } from "./preload/resolve-api-root.js";
import { resolveTypePaths } from "./resolve-type-paths.js";

export interface PluginTypesOptions {
  /** Output path for generated global Window augmentation d.ts. @default auto-detected */
  global?: string | false;
  /** Output path for generated runtime types module. @default auto-detected */
  runtime?: string | false;
}

/**
 * Options for the electron-ipc-controller Vite plugin.
 */
export interface PluginOptions {
  /** Path to your main process entry file. @default "src/main/index.ts" */
  main?: string;
  /** Path to your preload entry file. @default "src/preload/index.ts" */
  preload?: string;
  /** Output configuration for generated types. */
  types?: PluginTypesOptions;
}
export interface ElectronIpcControllerPlugin {
  buildStart?(): void | Promise<void>;
  configResolved?(config: { root: string }): void | Promise<void>;
  configureServer?(server: {
    watcher: { add: (path: string) => void; on: (e: "change", fn: (path: string) => void) => void };
  }): void;
  name: string;
  transform?(code: string, id: string): null | Promise<null>;
}

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
 * import { electronIpcController } from "@electron-ipc-controller/vite-plugin";
 *
 * export default defineConfig({
 *   plugins: [electronIpcController(options)],
 * });
 * ```
 */
export function electronIpcController({
  main = DEFAULT_MAIN_ENTRY,
  preload = DEFAULT_PRELOAD_ENTRY,
  types = {},
}: PluginOptions = {}): ElectronIpcControllerPlugin {
  let root = process.cwd();
  const state = new PluginState();

  const generate = () => {
    try {
      const preloadPath = path.resolve(root, preload);
      const { dependencies: preloadDependencies, namespace: resolvedApiRoot } = resolveApiRootFromPreload(preloadPath);
      const entryPath = path.resolve(root, main);
      if (!fs.existsSync(entryPath)) {
        console.warn(`[${pkg.name}] Main entry not found at: ${entryPath}`);
        return;
      }

      console.log(`[${pkg.name}] Generating IPC types from ${entryPath}...`);
      const { controllers, processedFiles, program } = findControllers(entryPath, undefined, state.getProgram());
      state.setProgram(program);

      if (controllers.length === 0) {
        console.warn(`[${pkg.name}] No createIpcApp() call found in ${entryPath}; generated types will be empty.`);
      }

      state.setControllerFiles(new Set([...processedFiles, ...preloadDependencies].map(normalizePath)));

      const { globalPath, runtimePath } = resolveTypePaths({
        hasRendererRuntimeDir: (absPath) => fs.existsSync(absPath),
        preloadPath,
        root,
        types,
      });

      if (!runtimePath && !globalPath) {
        console.warn(`[${pkg.name}] Both runtime and global type outputs are disabled; nothing to generate.`);
        return;
      }

      let runtimeTypesContent: string | null = null;
      let globalTypesContent: string | null = null;

      if (runtimePath) {
        runtimeTypesContent = generateRuntimeTypes(controllers);
      }

      if (globalPath) {
        const ipcApiImportPath = (() => {
          if (!runtimePath) {
            throw new Error("Global type generation requires a runtime types output path.");
          }
          const rel = path
            .relative(path.dirname(globalPath), runtimePath)
            .replace(/\\/g, "/")
            .replace(/\.tsx?$/, ".ts")
            .replace(/(\.d)?\.ts$/, "");
          return rel.startsWith(".") ? rel : `./${rel}`;
        })();
        globalTypesContent = generateGlobalTypes(resolvedApiRoot, ipcApiImportPath);
      }

      const combinedHash = crypto
        .createHash("md5")
        .update(runtimeTypesContent ?? "")
        .update(globalTypesContent ?? "")
        .digest("hex");

      if (!state.updateHash(combinedHash)) return;

      if (runtimePath && runtimeTypesContent != null) {
        fs.mkdirSync(path.dirname(runtimePath), { recursive: true });
        fs.writeFileSync(runtimePath, runtimeTypesContent);
        console.log(`[${pkg.name}] Runtime types generated at ${path.relative(root, runtimePath)}`);
      }

      if (globalPath && globalTypesContent != null) {
        fs.mkdirSync(path.dirname(globalPath), { recursive: true });
        fs.writeFileSync(globalPath, globalTypesContent);
        console.log(`[${pkg.name}] Global types generated at ${path.relative(root, globalPath)}`);
      }
    } catch (err) {
      console.error(`[${pkg.name}] Type generation failed:`, err);
    }
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
    name: "electron-ipc-controller",
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
