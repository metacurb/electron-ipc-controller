---
title: Method decorators
sidebar_position: 2
---

# Method decorators

These decorators register methods to listen for IPC events. Types are generated for these methods and exposed to the renderer.

## `@IpcHandle(name?: string)`

Registers a **bidirectional** handler (Request/Response) using [`ipcMain.handle`](https://www.electronjs.org/docs/latest/api/ipc-main#ipcmainhandlechannel-listener).

In the example below, the method will be registered as `window.ipc.settings.methodName`.

```ts
@IpcController()
class SettingsController {
  @IpcHandle()
  methodName() {}
}
```

If `name` is provided, it defines the API schema in the same way as the controller decorator.

The below example would resolve to `window.ipc.settings.get`.

```ts
@IpcController()
class SettingsController {
  @IpcHandle("get")
  methodName() {}
}
```

## `@IpcOn(name?: string)`

Registers a **one-way** listener using [`ipcMain.on`](https://www.electronjs.org/docs/latest/api/ipc-main#ipcmainonchannel-listener).

- **Usage:** For fire-and-forget events where the renderer doesn't wait for a result.
- **Naming:** Same rules as `@IpcHandle`.
- The renderer **does not receive a return value**
- The generated renderer method returns `void`
- Internally uses [`ipcRenderer.send`](https://www.electronjs.org/docs/latest/api/ipc-renderer#ipcrenderersendchannel-args)

## `@IpcHandleOnce` & `@IpcOnce`

Same as above, but the listener is removed after the first trigger.

- `@IpcHandleOnce` uses [`ipcMain.handleOnce`](https://www.electronjs.org/docs/latest/api/ipc-main#ipcmainhandleoncechannel-listener)
- `@IpcOnce` uses [`ipcMain.once`](https://www.electronjs.org/docs/latest/api/ipc-main#ipcmainoncechannel-listener)
