---
title: Troubleshooting
sidebar_position: 2
---

# Troubleshooting

Common issues and fast fixes.

## Types are not generated

### Symptoms

- `window.ipc` has no type hints
- `ipc.types.ts` / `ipc.d.ts` files are missing

### Checks

- Vite config includes `electronIpcController(...)`
- `main` option points to the correct file containing `createIpcApp(...)`
- Controller classes are discoverable from that entrypoint

### Fix

- Correct plugin `main`/`preload` paths
- Move overly dynamic controller wiring to a statically analysable pattern
- If using a custom preload namespace, confirm generated globals match your expected `window` key

## `window.ipc` is undefined at runtime

### Symptoms

- Renderer throws on `window.ipc.*`

### Checks

- Preload script is actually attached to `BrowserWindow`
- `setupPreload()` runs successfully
- `contextIsolation` is enabled and bridge exposure is valid

### Fix

- Ensure `webPreferences.preload` points to built preload file
- Verify preload startup errors in dev/prod logs
- If using a custom namespace, verify renderer calls target the exposed key instead of `window.ipc`

## Duplicate namespace error

### Symptoms

- App throws: duplicate namespace found in controllers

### Cause

- Two controllers resolve to the same namespace (explicit or derived)

### Fix

- Set explicit unique namespaces with `@IpcController("...")`
- Rename controller classes if relying on derived names

## Resolver failures

### Symptoms

- App throws while resolving controller instances

### Cause

- `resolver.resolve(...)` throws or returns invalid instance

### Fix

- Validate DI container registration
- Confirm controller providers are bound before `createIpcApp(...)`

## Correlation ID is undefined

### Symptoms

- `@CorrelationId()` or `getCorrelationId()` returns `undefined`

### Cause

- Correlation is disabled or call is outside active request context

### Fix

- Enable `correlation: true` in `createIpcApp(...)`
- Only expect values inside handler execution chain

## Decorator metadata issues

### Symptoms

- Decorators behave unexpectedly or no handlers are registered

### Checks

- TypeScript config has `experimentalDecorators: true`
- `emitDecoratorMetadata: true` is enabled
- `reflect-metadata` is imported before decorators execute

### Fix

- Import `reflect-metadata` at main startup entry (top of file)

## Contract/preload handshake issues

### Symptoms

- Preload setup fails while fetching contract channel

### Checks

- Main process app initialized before preload tries to call contract channel
- No custom code overrides/removes handler unexpectedly

### Fix

- Ensure `createIpcApp(...)` runs in app startup before renderer interaction
- Avoid disposing IPC app too early
