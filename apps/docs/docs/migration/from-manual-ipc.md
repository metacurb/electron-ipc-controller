---
title: Migrate from Manual IPC
sidebar_position: 1
---

# Migrate from Manual IPC

This guide shows how to move from manual `ipcMain` + custom preload wiring to controller-based IPC with generated renderer types.

## Migration goals

- Replace stringly-typed channels with controller methods
- Remove duplicated preload wiring
- Centralize API shape in main-process controller signatures

## Step 1: Replace manual handlers with controller methods

Before:

```ts
ipcMain.handle("users.get_profile", async (_event, userId: string) => {
  return userService.getProfile(userId);
});
```

After:

```ts
@IpcController("users")
class UsersController {
  @IpcHandle("getProfile")
  async getProfile(userId: string) {
    return userService.getProfile(userId);
  }
}
```

## Step 2: Register controllers at startup

```ts
createIpcApp({
  controllers: [UsersController],
  resolver: {
    resolve: (Controller) => new Controller(),
  },
});
```

If you already use DI, [adapt `resolve` to your container](../guides/dependency-injection.md).

## Step 3: Replace manual preload bridge with `setupPreload`

Before:

```ts
contextBridge.exposeInMainWorld("api", {
  getProfile: (id: string) => ipcRenderer.invoke("users.get_profile", id),
});
```

After:

```ts
import { setupPreload } from "@electron-ipc-bridge/core/preload";

void setupPreload(); // exposes window.ipc by default
```

## Step 4: Update renderer calls

Before:

```ts
const profile = await window.api.getProfile(userId);
```

After:

```ts
const profile = await window.ipc.users.getProfile(userId);
```

## Step 5: Validate behaviour and remove legacy code

- Remove old `ipcMain.handle`/`ipcMain.on` registrations for migrated endpoints
- Remove redundant preload bridge methods that are now generated
- Keep `reflect-metadata` import at main entrypoint
- Confirm renderer compiles against generated API types

## Common migration pitfalls

- Namespace collisions across controllers
- Missing decorator/metadata TypeScript config
- Preload path mismatch in packaged builds
- Dynamic controller registration patterns that break plugin analysis

## Suggested incremental rollout

1. Migrate one domain controller (for example, `users`)
2. Keep legacy channels for untouched domains
3. Verify behaviour and typing in renderer
4. Migrate remaining domains and remove legacy bridge
