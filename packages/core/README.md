<h1 align="center">@electron-ipc-bridge/core</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Electron-2B2E3A?style=for-the-badge&logo=electron&logoColor=9FEAF9" alt="Electron" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
</p>

<p align="center">
  A type-safe, class-based IPC framework for Electron — inspired by NestJS.<br/>
  Define controllers in main, <strong>automatically</strong> get fully typed APIs in the renderer.
</p>

<p align="center">
  <a href="https://metacurb.github.io/electron-ipc-bridge/"><strong>Documentation</strong></a> ·
  <a href="https://metacurb.github.io/electron-ipc-bridge/quickstart"><strong>Quickstart</strong></a> ·
  <a href="https://metacurb.github.io/electron-ipc-bridge/examples"><strong>Examples</strong></a>
</p>

## Install

```bash
npm install @electron-ipc-bridge/core reflect-metadata
```

`reflect-metadata` is required for decorator metadata at runtime. Peer: `electron` >= 28.

## What it provides

- **Decorators:** `@IpcController`, `@IpcHandle`, `@IpcHandleOnce`, `@IpcOn`, `@IpcOnce`, and parameter decorators (`@Sender`, `@Window`, `@RawEvent`, `@Channel`, etc.)
- **Runtime:** `createIpcApp()`, `IpcApp`, `IpcAppOptions`
- **Preload:** `setupPreload()` and the managed entry `@electron-ipc-bridge/core/preload.js`
- **Advanced:** `createParamDecorator`, `getCorrelationId`, `isIpcController`

## Minimal example

**Main process:**

```ts
import "reflect-metadata";
import { createIpcApp, IpcController, IpcHandle } from "@electron-ipc-bridge/core";

@IpcController("users")
export class UserController {
  @IpcHandle()
  async getUser(id: string) {
    return { id, name: "Alice" };
  }
}

createIpcApp({
  controllers: [UserController],
  resolver: { resolve: (Cls) => new Cls() },
});
```

**Renderer:**

```ts
const user = await window.ipc.users.getUser("123");
```

## Subpath exports

- **`@electron-ipc-bridge/core`** — main entry (decorators, `createIpcApp`, etc.)
- **`@electron-ipc-bridge/core/preload`** — TypeScript types and `setupPreload` for custom preload scripts
- **`@electron-ipc-bridge/core/preload.js`** — zero-config preload entry that runs `setupPreload()` with default namespace `"ipc"`
