---
title: Runtime API
sidebar_position: 2
---

# Runtime API

## `createIpcApp(options: IpcAppOptions): IpcApp`

Registers controller methods as Electron IPC handlers and returns an app handle for cleanup.

```ts
interface IpcAppOptions {
  controllers: Constructor[];
  correlation?: boolean;
  resolver: {
    resolve<T>(controller: Constructor<T>): T;
  };
}

interface IpcApp {
  dispose(): void;
}
```

### Required options

- `controllers`: array of classes decorated with `@IpcController(...)`
- `resolver`: object with a `resolve()` function used to instantiate/fetch each controller

### Optional options

- `correlation`: enables correlation storage for request tracing (used by `@CorrelationId` and `getCorrelationId()`)

### Runtime validation and errors

`createIpcApp` throws when:

- `controllers` is not an array
- `controllers` contains a non-constructor value
- `resolver.resolve` is missing or not a function
- two controllers resolve to the same namespace

### Disposal semantics

- `dispose()` unregisters handlers/listeners created by this app instance
- disposer failures are caught and logged so cleanup continues for remaining handlers

## Namespace and channel behaviour

- Namespace defaults are derived from controller class names (`MyController` -> `my`)
- Method channel names are built from `namespace + methodName`, converted to `snake_case`
- Namespace collisions are rejected at startup
- See [Channels & Interoperability](../../guides/channels.md) for detailed naming rules

## Related references

- [Class decorators](../../guides/decorators/class-decorators.md)
- [Method decorators](../../guides/decorators/method-decorators.md)
- [Lifecycle & cleanup](../../guides/lifecycle.md)
