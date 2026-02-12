---
title: Decorators Reference
sidebar_position: 3
---

# Decorators Reference

## Class decorator

### `@IpcController(namespace?: string)`

- Marks a class as an IPC controller
- Optional `namespace` defines renderer API root (for example `window.ipc.users`)
- If omitted, namespace is derived from class name (`UserController` -> `user`)

## Method decorators

### `@IpcHandle(name?: string)`

- Request/response handler (`ipcMain.handle`)
- Renderer call shape is async (`Promise<TReturn>`)

### `@IpcOn(name?: string)`

- Fire-and-forget listener (`ipcMain.on`)
- Renderer call shape returns `void`

### `@IpcHandleOnce(name?: string)` and `@IpcOnce(name?: string)`

- Same behaviours as above, but the listener is removed after the first trigger

### Method naming/collision rules

- If `name` is omitted, method name is used
- Duplicate handler names inside a controller are rejected

## Parameter decorators

### `@Sender()`

- Injects `event.sender` (`WebContents`)

### `@Window()`

- Injects `BrowserWindow.fromWebContents(event.sender)`
- **Nullable**: `null` if no matching window exists (e.g. sender is a webview or frame without a window)

### `@ProcessId()`

- Injects sender process ID (`number`)

### `@RawEvent()`

- Injects raw Electron event (`IpcMainEvent | IpcMainInvokeEvent`)

### `@Origin()`

- Injects sender frame (`WebFrameMain`)

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
