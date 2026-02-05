import crypto from "crypto";
import fs from "fs";
import path from "path";
import { Plugin } from "vite";

import pkg from "../package.json" with { type: "json" };

import { generateTypes } from "./generator/generate-types.js";
import { findControllers } from "./parser/find-controllers.js";

export interface PluginOptions {
  main?: string;
  output?: string;
}

export function electronIpcController({
  main = "src/main/index.ts",
  output = "src/ipc.d.ts",
}: PluginOptions = {}): Plugin {
  // Normalize paths to forward slashes for consistent comparison (TypeScript uses forward slashes)
  const normalizePath = (p: string) => p.replace(/\\/g, "/");

  let root = process.cwd();
  let lastHash: string | null = null;
  let controllerFiles: Set<string> | null = null;
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  let hasGeneratedOnce = false;
  const DEBOUNCE_MS = 100;

  const generate = () => {
    try {
      const entryPath = path.resolve(root, main);

      if (!fs.existsSync(entryPath)) {
        console.warn(`[${pkg.name}] Main entry not found at: ${entryPath}`);
        return;
      }

      console.log(`[${pkg.name}] Generating IPC types from ${entryPath}...`);
      const { controllers, processedFiles } = findControllers(entryPath);

      // Normalize all paths in the set to forward slashes
      controllerFiles = new Set([...processedFiles].map(normalizePath));

      const typeDef = generateTypes(controllers);

      const hash = crypto.createHash("md5").update(typeDef).digest("hex");
      if (hash === lastHash) {
        return;
      }
      lastHash = hash;

      const absOutput = path.resolve(root, output);
      fs.mkdirSync(path.dirname(absOutput), { recursive: true });
      fs.writeFileSync(absOutput, typeDef);
      console.log(`[${pkg.name}] Types generated at ${output}`);
    } catch (err) {
      console.error(`[${pkg.name}] Type generation failed:`, err);
    }
  };

  const scheduleGenerate = () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      generate();
      debounceTimer = null;
    }, DEBOUNCE_MS);
  };

  return {
    buildStart() {
      // Only generate on the very first build, not on HMR rebuilds
      if (!hasGeneratedOnce) {
        generate();
        hasGeneratedOnce = true;
      }
    },
    configResolved() {
      root = process.cwd();
    },
    name: "electron-ipc-controller",
    transform(_code, id) {
      if (id.includes("node_modules") || id.endsWith(".d.ts")) return null;

      const absId = normalizePath(path.resolve(id));
      const mainEntryPath = normalizePath(path.resolve(root, main));
      const isControllerFile = controllerFiles?.has(absId);
      const isMainEntry = absId === mainEntryPath;

      if (isControllerFile || isMainEntry) {
        scheduleGenerate();
      }
      return null;
    },
  };
}
