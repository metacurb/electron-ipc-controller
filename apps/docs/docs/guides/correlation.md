---
sidebar_position: 6
title: Correlation Tracking
---

# Correlation Tracking

The library includes built-in support for request tracing using Node.js [`AsyncLocalStorage`](https://nodejs.org/api/async_context.html). This allows you to track a request flow across asynchronous operations without passing a context object manually.

## 1. Enable it in `createIpcApp`

```typescript title="src/main/index.ts" {3-6}
const ipcApp = createIpcApp({
  controllers: [MyController],
  correlation: true,
  resolver: {
    resolve: (Controller) => new Controller(),
  },
});
```

## 2. Access the Correlation ID

You can access the ID via the decorator or the helper function anywhere in your async stack.

```typescript {5,12}
import { IpcHandle, CorrelationId, getCorrelationId } from "@electron-ipc-controller/core";

export class LoggerController {
  @IpcHandle()
  log(@CorrelationId() traceId: string, message: string) {
    console.log(`[${traceId}] ${message}`);
  }

  @IpcHandle()
  async complexOp() {
    const traceId = getCorrelationId();
    console.log(`Processing ${traceId}...`);
  }
}
```

## 3. Practical Usage: Logging

Correlation tracking is particularly useful for logging. Instead of manually passing a trace ID to every service and function, you can simply call `getCorrelationId()` within your logging utility.

This ensures that every log line related to a specific IPC request shares the same ID, making debugging significantly easier.

```typescript {6}
import pino from "pino";
import { getCorrelationId } from "@electron-ipc-controller/core";

const logger = pino({
  mixin() {
    return { traceId: getCorrelationId() };
  },
});

// Now every log call automatically includes the traceId
logger.info("Processing data...");
// Output: {"level":30,"time":...,"traceId":"...","msg":"Processing data..."}
```
