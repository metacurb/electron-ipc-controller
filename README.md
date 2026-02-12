![](https://img.shields.io/badge/Electron-2B2E3A?style=for-the-badge&logo=electron&logoColor=9FEAF9) ![](https://img.shields.io/badge/pnpm-yellow?style=for-the-badge&logo=pnpm&logoColor=white) ![](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

<p align="center">
  <img src="apps/docs/static/img/logo.png" alt="Electron IPC Controller" width="120" />
</p>

# Electron IPC Controller

A **type-safe, class-based** IPC framework for Electron applications. Use Controllers and decorators in the main process; the Vite plugin generates TypeScript definitions for the renderer so types stay in sync.

**Documentation:** [apps/docs](apps/docs) — run `pnpm build` in `apps/docs` to build the docs, or read the markdown in `apps/docs/docs/`.

## Quick start

```bash
pnpm add @electron-ipc-controller/core reflect-metadata
pnpm add -D @electron-ipc-controller/vite-plugin
```

Import `reflect-metadata` at the top of your main entry, then use `createIpcApp({ controllers, resolver })` and `setupPreload()` in your preload script. See the [documentation](apps/docs/docs/getting-started/quickstart.md) for full setup, decorators, preload options, and more.
