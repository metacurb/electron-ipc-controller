# electron-vite-nest

Electron + Vite + React + TypeScript example using **NestJS core** (`@nestjs/core` / `@nestjs/common`) for dependency injection with [electron-ipc-controller](https://github.com/electron-ipc-controller/electron-ipc-controller).

Controllers are registered as Nest providers (`@Injectable()`) in `IpcModule` and resolved via `NestFactory.createApplicationContext(IpcModule)` and `context.get(Controller)`. See `src/main/ipc.module.ts`, `src/main/controllers/counter.controller.ts`, and `src/main/index.ts`.

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
