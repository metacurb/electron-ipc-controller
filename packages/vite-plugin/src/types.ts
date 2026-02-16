export interface PluginTypesOptions {
  /** Output path for generated global Window augmentation d.ts. @default auto-detected */
  global?: string | false;
  /** Output path for generated runtime types module. @default auto-detected */
  runtime?: string | false;
}

/**
 * Options for the electron-ipc-bridge Vite plugin.
 */
export interface PluginOptions {
  /** Path to your main process entry file. @default "src/main/index.ts" */
  main?: string;
  /** Path to your preload entry file. @default "src/preload/index.ts" */
  preload?: string;
  /** Output configuration for generated types. */
  types?: PluginTypesOptions;
}
