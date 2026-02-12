---
sidebar_position: 5
title: Preload Integration
---

# Preload Integration

Electron IPC Bridge supports two preload integration strategies, depending on how much control you need. Both options work with contextIsolation: true and sandbox mode.

## Option 1: Fully Managed Preload (Zero Config)

For simple setups, the library provides a ready-made preload script that exposes the IPC API automatically. This option:

- Requires no custom preload code
- Exposes only the generated IPC API

```typescript title="src/main/index.ts"
new BrowserWindow({
  webPreferences: {
    preload: require.resolve("@electron-ipc-bridge/core/preload.js"),
  },
});
```

## Option 2: Manual Preload Composition

If you already have a preload script or need to expose additional APIs, a utility is provided to compose IPC Controller with your existing setup.

This allows you to:

- Combine IPC Controller with other preload utilities
- Control exactly what is exposed to the renderer
- Integrate with existing Electron tooling

```typescript title="src/preload/index.ts"
import { setupPreload } from "@electron-ipc-bridge/core/preload";
import { electronAPI } from "@electron-toolkit/preload";
import { contextBridge } from "electron";

// Calls contextBridge.exposeInMainWorld behind the scenes
setupPreload().catch(console.error);

try {
  contextBridge.exposeInMainWorld("electron", electronAPI);
} catch (error) {
  console.error(error);
}
```

## Customising the API Namespace

By default, `setupPreload()` attaches the generated API to `window.ipc`. However, you might want to expose your API under a different namespace, or you might have multiple isolated APIs. You can change this by passing a custom namespace to `setupPreload`.

```typescript title="src/preload/index.ts"
import { setupPreload } from "@electron-ipc-bridge/core/preload";

setupPreload({
  // Your API will now be bound to window.myCustomApi
  namespace: "myCustomApi",
});
```

If you're using `@electron-ipc-bridge/vite-plugin`, types are updated automatically.
For namespace inference caveats (especially with dynamic preload patterns), see [Generation Behaviour](../reference/vite-plugin/generation-behaviour.md).

For details on how the underlying IPC channels are named (e.g. for debugging), see [Channels & Interoperability](./channels.md).
