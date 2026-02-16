import crypto from "crypto";
import fs from "fs";
import path from "path";

import pkg from "../package.json" with { type: "json" };

import { generateGlobalTypes } from "./generator/generate-global-types.js";
import { generateRuntimeTypes } from "./generator/generate-runtime-types.js";
import { normalizePath } from "./normalize-path.js";
import { findControllers } from "./parser/find-controllers.js";
import { PluginState } from "./plugin-state.js";
import { resolveApiRootFromPreload } from "./preload/resolve-api-root.js";
import { resolveTypePaths } from "./resolve-type-paths.js";
import type { PluginTypesOptions } from "./types.js";

export function generateIpc(
  root: string,
  state: PluginState,
  options: {
    main: string;
    preload: string;
    types: PluginTypesOptions;
  },
): void {
  try {
    const { main, preload, types } = options;
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
}
