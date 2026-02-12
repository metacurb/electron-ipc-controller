---
title: Class decorators
sidebar_position: 1
---

# Class decorators

## `@IpcController(namespace?: string)`

Marks a class as an IPC controller. Without this decorator, no methods on the class will be bound.

If no namespace is passed, the class name will be taken, the `Controller` suffix will be removed, and the name will be converted to camelCase.

In the example below, the controller will be registered as `window.ipc.myFun`.

```ts
@IpcController()
class MyFunController {
  // ...
}
```

If a `namespace` _is_ passed, this will be used as the API namespace for the controller's methods.

In this example, the controller will be registered as `window.ipc.users`.

```ts
@IpcController("users")
class MyFunController {
  // ...
}
```
