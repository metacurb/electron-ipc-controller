---
title: Plugin Options
sidebar_position: 2
description: "electronIpcBridge plugin options: main, preload, and type output paths."
---

# Plugin Options

## `electronIpcBridge(options?: PluginOptions)`

Creates a Vite plugin that parses controller metadata from your main entry and generates renderer-consumable type files.

```ts
interface PluginTypesOptions {
  global?: string | false;
  runtime?: string | false;
}

interface PluginOptions {
  main?: string;
  preload?: string;
  types?: PluginTypesOptions;
}
```

## Exported Types

The plugin exports the following types for use in your configuration files:

- `electronIpcBridgePlugin`: The return type of the plugin function.
- `PluginOptions`: The configuration object interface.

```ts
import type { PluginOptions } from "@electron-ipc-bridge/vite-plugin";
```

## Defaults

- `main`: `"src/main/index.ts"`
- `preload`: `"src/preload/index.ts"`
- `types.runtime`:
  - prefers `"src/renderer/src/ipc.types.ts"` when `src/renderer/src` exists
  - otherwise falls back to `"src/ipc.types.ts"`
- `types.global`: defaults to preload directory + `"ipc.d.ts"`

## Option semantics

- `types.runtime = false`: skip runtime type module generation
- `types.global = false`: skip global `Window` augmentation generation
- both disabled: plugin logs warning and generates nothing
- `types.global` requires runtime output (plugin throws if global generation is requested without runtime output)

## Namespace shape in generated globals

If your preload namespace is not a valid JavaScript identifier (for example `"my-api"`), the generated `Window` augmentation uses a computed property key (`window["my-api"]`) rather than dot notation.

## Minimal example

```ts
import { electronIpcBridge } from "@electron-ipc-bridge/vite-plugin";

export default {
  plugins: [
    electronIpcBridge({
      main: "src/main/index.ts",
      preload: "src/preload/index.ts",
      types: {
        runtime: "src/renderer/src/ipc.types.ts",
        global: "src/preload/ipc.d.ts",
      },
    }),
  ],
};
```
