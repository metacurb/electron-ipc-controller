---
title: Parameter decorators
sidebar_position: 3
description: "Sender, Window, ProcessId, CorrelationId and other injectable context."
---

# Parameter decorators

You can inject Electron-specific context directly into your controller methods without parsing the raw `event` object manually.

| Decorator          | Injects                                                                                                            | Type                                                                                                                                                                                          |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@Channel()`       | The IPC channel name for this handler (e.g. `"users.get_profile"`)                                                 | `string`                                                                                                                                                                                      |
| `@CorrelationId()` | The unique ID for the current request context. If you have correlation disabled, this will always return undefined | `string`                                                                                                                                                                                      |
| `@Origin()`        | The sender frame                                                                                                   | [`WebFrameMain`](https://www.electronjs.org/docs/latest/api/web-frame-main)                                                                                                                   |
| `@ProcessId()`     | The ID of the renderer process                                                                                     | `number`                                                                                                                                                                                      |
| `@RawEvent()`      | The native Electron event object                                                                                   | [`IpcMainEvent`](https://www.electronjs.org/docs/latest/api/structures/ipc-main-event) \| [`IpcMainInvokeEvent`](https://www.electronjs.org/docs/latest/api/structures/ipc-main-invoke-event) |
| `@Sender()`        | The `WebContents` that sent the message                                                                            | [`WebContents`](https://www.electronjs.org/docs/latest/api/web-contents#class-webcontents)                                                                                                    |
| `@Window()`        | **Nullable**. The `BrowserWindow` that sent the message                                                            | [`BrowserWindow`](https://www.electronjs.org/docs/latest/api/browser-window#class-browserwindow-extends-basewindow)                                                                           |

**Example:**

```typescript
import type { WebContents } from "electron/main";

@IpcHandle()
getUserProfile(
  @Sender() sender: WebContents,
  userId: string
) {
  console.log(`Request from window: ${sender.id}`);
  return this.userService.findById(userId);
}
```

:::note
When using the generated types in the frontend, these injected parameters are automatically removed from the function signature. You simply call `getUserProfile('123')`.
:::
