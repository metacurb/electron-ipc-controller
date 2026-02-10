import path from "path";

import {
  DEFAULT_GLOBAL_TYPES_FILENAME,
  DEFAULT_RENDERER_RUNTIME_DIR,
  DEFAULT_RUNTIME_TYPES_FILENAME,
} from "./constants.js";
import type { PluginTypesOptions } from "./plugin.js";

export interface ResolveTypePathsOptions {
  hasRendererRuntimeDir: (absPath: string) => boolean;
  preloadPath: string;
  root: string;
  types: PluginTypesOptions;
}

export interface ResolvedTypePaths {
  globalPath: string | null;
  runtimePath: string | null;
}

export const resolveTypePaths = ({
  hasRendererRuntimeDir,
  preloadPath,
  root,
  types,
}: ResolveTypePathsOptions): ResolvedTypePaths => {
  const runtimePath =
    types.runtime === false
      ? null
      : types.runtime
        ? path.resolve(root, types.runtime)
        : (() => {
            const rendererSrc = path.resolve(root, DEFAULT_RENDERER_RUNTIME_DIR);
            if (hasRendererRuntimeDir(rendererSrc)) {
              return path.join(rendererSrc, DEFAULT_RUNTIME_TYPES_FILENAME);
            }
            return path.resolve(root, path.join("src", DEFAULT_RUNTIME_TYPES_FILENAME));
          })();

  const globalPath =
    types.global === false
      ? null
      : types.global
        ? path.resolve(root, types.global)
        : path.join(path.dirname(preloadPath), DEFAULT_GLOBAL_TYPES_FILENAME);

  return { globalPath, runtimePath };
};
