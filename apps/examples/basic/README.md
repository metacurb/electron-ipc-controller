# Basic Example

A minimal Electron application using `electron-ipc-bridge` with a pre-bundled preload script.

## Overview

This example demonstrates:

- **No bundler** - Uses `tsc` directly for TypeScript compilation
- **Pre-bundled Preload** - Uses the library's built-in sandbox-safe preload script
- **Manual controller instantiation** - No DI container

## Structure

```
src/
├── main/
│   ├── index.ts                  # Electron main process
│   └── controllers/
│       └── counter.controller.ts # IPC controller
├── preload/
│   └── index.ts                  # Preload script with context bridge
└── renderer/
    └── index.html                # Renderer with inline script
```

## Running

```bash
# Install dependencies (from workspace root)
pnpm install

# Build and start
pnpm --filter @electron-ipc-bridge/example-basic start

# Or from this directory
pnpm start
```

## Key Concepts

### Controller Definition

Controllers use decorators to define IPC handlers:

```ts
@IpcController()
export class CounterController {
  @IpcHandle()
  async ping(): Promise<string> {
    return "pong";
  }

  @IpcOn()
  reset(): void {
    // Fire-and-forget handler
  }
}
```

### Main Process Setup

Register controllers with `createIpcApp()`:

```ts
const ipcApp = createIpcApp({
  controllers: [CounterController],
  resolver: {
    resolve: (Controller) => new Controller(),
  },
});
```

### Preload Script

This example uses the pre-bundled preload script provided by the library, which is sandbox-safe and requires no additional bundling configuration:

```ts
// src/main/index.ts
webPreferences: {
  preload: require.resolve("electron-ipc-bridge/preload.js"),
},
```

### Renderer Usage

The API is exposed as `window.ipc` by default. Since the preload sets up the API asynchronously (it fetches the contract from the main process), the renderer must wait for it to be available.

```ts
// src/renderer/index.html
function waitForIpc() {
  // Simple polling to wait for window.ipc
}

const ipc = await waitForIpc();
const pong = await ipc.counter.ping();
```

## Trade-offs

| Aspect           | Basic Approach | Vite Plugin Approach |
| ---------------- | -------------- | -------------------- |
| Setup complexity | Simple         | Requires vite config |
| Build tooling    | Just `tsc`     | Vite + plugin        |
| Preload          | Zero-config    | Customizable         |
| Type safety      | Manual types   | Auto-generated types |

For larger projects with better TypeScript integration, consider using the Vite plugin.
