---
title: Decorators Reference
sidebar_position: 3
description: Complete list of class, method, and parameter decorators with signatures.
---

# Decorators Reference

## Class decorator

### `@IpcController(namespace?: string)`

- Marks a class as an IPC controller
- Optional `namespace` defines renderer API root (for example `window.ipc.users`)
- If omitted, namespace is derived from class name (`UserController` -> `user`)

## Method decorators

### `@IpcHandle(name?: string)`

- Request/response handler ([`ipcMain.handle`](https://www.electronjs.org/docs/latest/api/ipc-main#ipcmainhandlechannel-listener))
- Renderer call shape is async ([`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)-based)

### `@IpcOn(name?: string)`

- Fire-and-forget listener ([`ipcMain.on`](https://www.electronjs.org/docs/latest/api/ipc-main#ipcmainonchannel-listener))
- Renderer call shape returns `void`

### `@IpcHandleOnce(name?: string)` and `@IpcOnce(name?: string)`

- Same behaviours as above, but the listener is removed after the first trigger

### Method naming/collision rules

- If `name` is omitted, method name is used
- Duplicate handler names inside a controller are rejected

## Parameter decorators

### `@Sender()`

- Injects `event.sender` ([`WebContents`](https://www.electronjs.org/docs/latest/api/web-contents#class-webcontents))

### `@Window()`

- Injects [BrowserWindow.fromWebContents](https://www.electronjs.org/docs/latest/api/browser-window#browserwindowfromwebcontentswebcontents)(event.sender)
- **Nullable**: `null` if no matching window exists (e.g. sender is a webview or frame without a window)

### `@ProcessId()`

- Injects sender process ID (`number`)

### `@RawEvent()`

- Injects raw Electron event ([`IpcMainEvent`](https://www.electronjs.org/docs/latest/api/structures/ipc-main-event) | [`IpcMainInvokeEvent`](https://www.electronjs.org/docs/latest/api/structures/ipc-main-invoke-event))

### `@Channel()`

- Injects the IPC channel name for the current handler (e.g. `"users.get_profile"`).

### `@Origin()`

- Injects sender frame ([`WebFrameMain`](https://www.electronjs.org/docs/latest/api/web-frame-main))

### `@CorrelationId()`

- Injects current correlation ID (`string | undefined`)

## Custom parameter decorators

### `createParamDecorator<T>(resolver): (data?: T) => ParameterDecorator`

Create project-specific injection decorators from event context.

## Related deep-dive guides

- [Class decorators](../../guides/decorators/class-decorators.md)
- [Method decorators](../../guides/decorators/method-decorators.md)
- [Parameter decorators](../../guides/decorators/parameter-decorators.md)
- [Create your own decorators](../../guides/decorators/custom-parameter-decorators.md)
