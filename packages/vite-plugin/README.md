<h1 align="center">@electron-ipc-bridge/vite-plugin</h1>

<p align="center">
  A <a href="https://vitejs.dev/">Vite</a> plugin for <a href="https://metacurb.github.io/electron-ipc-bridge/">Electron IPC Bridge</a>. It parses your main entry, discovers controllers registered with <code>createIpcApp</code>, and generates global (e.g. <code>Window</code>) and/or runtime type modules so the renderer gets typed IPC (e.g. <code>window.ipc</code>).
</p>

## Install

```bash
npm install -D @electron-ipc-bridge/vite-plugin
```

Peer: `vite` ^5 / ^6 / ^7, `typescript` ^5.

## Usage

```ts
// vite.config.ts
import { electronIpcController } from "@electron-ipc-bridge/vite-plugin";

export default {
  plugins: [electronIpcController()],
};
```

## Options

| Option          | Description                                                                                                                   |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `main`          | Path to main process entry. Default: `"src/main/index.ts"`                                                                    |
| `preload`       | Path to preload entry. Default: `"src/preload/index.ts"`                                                                      |
| `types.global`  | Output path for generated global `Window` augmentation (`.d.ts`). Default: preload dir + `ipc.d.ts`. Set `false` to disable.  |
| `types.runtime` | Output path for generated runtime types module. Default: auto (e.g. `src/renderer/src/ipc.types.ts`). Set `false` to disable. |

Full defaults and semantics: [Plugin Options](https://metacurb.github.io/electron-ipc-bridge/reference/vite-plugin/plugin-options) · [Generation Behaviour](https://metacurb.github.io/electron-ipc-bridge/reference/vite-plugin/generation-behaviour).

## Documentation

[metacurb.github.io/electron-ipc-bridge](https://metacurb.github.io/electron-ipc-bridge/)
