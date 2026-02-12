# electron-vite-typedi

Electron + Vite + React + TypeScript example using **TypeDI** for dependency injection with [electron-ipc-bridge](https://github.com/metacurb/electron-ipc-bridge).

Controllers are registered as TypeDI services (`@Service()`) and resolved via `Container.get(Controller)` in the IPC app resolver. See `src/main/controllers/counter.controller.ts` for `@Service()` + `@IpcController()` and `src/main/index.ts` for the typedi-based resolver.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### Install

```bash
$ pnpm install
```

### Development

```bash
$ pnpm dev
```

### Build

```bash
# For windows
$ pnpm build:win

# For macOS
$ pnpm build:mac

# For Linux
$ pnpm build:linux
```
