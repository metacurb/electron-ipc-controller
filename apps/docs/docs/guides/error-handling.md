---
title: Error Handling
sidebar_position: 6
---

# Error Handling

When your controller methods throw an error (or reject a promise), `@electron-ipc-bridge` ensures the error is propagated back to the renderer process.

## Default Behaviour

If a controller method throws an Error:

```ts
@IpcHandle()
async getUser(id: string) {
  if (!id) {
    throw new Error("ID is required");
  }
}
```

The renderer will reject with an Error object that has the same `message`.

```ts
try {
  await window.ipc.users.getUser("");
} catch (err) {
  console.log(err.message); // "ID is required"
}
```

:::warning
Standard `Error` objects lose their custom properties (like `code` or `status`) when passing through Electron's IPC serialization. Only the `message` property is reliably preserved by default.
:::

## Structured Errors

To pass structured error data (like error codes or validation details) to the renderer, you should serialize your error into a plain object or JSON string, or rely on the `message` string as your contract.

### Example: JSON in Message

A simple pattern is to JSON-serialize your error details into the message.

```ts
throw new Error(JSON.stringify({ code: "USER_NOT_FOUND", id }));
```

```ts
try {
  await window.ipc.users.getUser("123");
} catch (err) {
  const error = JSON.parse(err.message);
  if (error.code === "USER_NOT_FOUND") {
    // handle specific case
  }
}
```
