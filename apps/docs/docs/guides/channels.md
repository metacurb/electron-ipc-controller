---
title: Channels & Interoperability
sidebar_position: 6
---

# Channels & Interoperability

Electron IPC Controller abstracts away the underlying Electron IPC channel names, but understanding how they are generated is useful for debugging, auditing, or manual interoperability.

## Channel Naming Convention

Channels are generated using a consistent pattern:

`[namespace].[method_name]`

Where:

- `namespace`: The controller's namespace. E.g., `users` for `UsersController` (or your custom namespace)
- `method_name`: The method name, converted to **snake_case**.

### Snake Case Conversion

Method names are automatically converted from `camelCase` to `snake_case` to follow common IPC conventions.

**Examples:**

| Class Method        | Generated Channel           |
| :------------------ | :-------------------------- |
| `getUser`           | `users.get_user`            |
| `createUserProfile` | `users.create_user_profile` |
| `updateID`          | `users.update_id`           |

## Debugging

Because the channels are standard Electron IPC channels, you can use standard tools to spectate or debug them.

- **[electron-debug](https://github.com/sindresorhus/electron-debug)**: Can log IPC messages to the console.
- **DevTools**: You can monitor network/IPC traffic in some DevTools extensions or by simply logging in the main process.

## Manual Invocation

While we recommend using the type-safe `window.ipc` object (or your custom namespace), you can manually invoke these channels from the renderer if necessary.

```ts
// Invoking a handle (Promise-based)
const user = await window.electron.ipcRenderer.invoke("users.get_user", { id: 1 });

// Sending a message (Fire-and-forget)
window.electron.ipcRenderer.send("analytics.track_event", { name: "login" });
```

:::warning
Manually invoking channels bypasses the type safety provided by the library. Use this only when necessary for interoperability with other languages or tools.
