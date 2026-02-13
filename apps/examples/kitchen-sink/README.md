# kitchen-sink

Example that exercises all IPC controller options:

- **Multiple controllers**: `counter`, `echo`, `util`
- **Config**: `createIpcApp` with `controllers`, `correlation: true`, and custom `resolver`; Vite plugin with explicit `main` and `output`
- **Method decorators**: `@IpcHandle`, `@IpcHandleOnce`, `@IpcOn`, `@IpcOnce`
- **Param decorators**: `@Channel`, `@CorrelationId`, `@Sender`, `@Window`, `@ProcessId`, `@Origin`, `@RawEvent`
- **Types**: simple and complex payloads (nested objects, enums, unions, optionals, arrays)

## Run

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
```
