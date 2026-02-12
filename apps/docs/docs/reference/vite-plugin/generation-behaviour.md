---
title: Generation Behaviour
sidebar_position: 3
---

# Generation Behaviour

## What is analysed

- Main entry file (`PluginOptions.main`)
- Reachable controller files discovered from `createIpcApp(...)`
- Preload entry (`PluginOptions.preload`) to infer API root from `setupPreload(...)` when statically detectable

## What is generated

- Runtime types module (for importable `IpcApi` contract)
- Global declaration file (`Window[namespace]` augmentation)

## Regeneration triggers

- Main entry file change
- Preload entry file change
- Any tracked controller/dependency file change

## Performance behaviour

- Generation is debounced (plugin state)
- Generated output is content-hashed; unchanged output is not rewritten
- Existing TypeScript `Program` is reused where possible

## Warnings you may see

- Main entry not found
- No `createIpcApp()` call found (generated API may be empty)
- Both runtime and global outputs disabled

## Practical constraints

- Parser expects statically analysable controller wiring in `createIpcApp(...)`
- API-root inference is syntax-dependent; dynamic preload patterns may fall back to default `ipc`
- Highly dynamic runtime registration patterns may reduce generation accuracy

## Parser limitations

- Controllers must be discoverable from a static `controllers: [...]` shape (or supported module/provider patterns)
- Namespace inference from preload is limited to statically detectable `setupPreload(...)` usage
- When namespace inference is not possible, generated global types default to `window.ipc`
