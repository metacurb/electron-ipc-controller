# Example: Usage of Class-Based Electron IPC Framework

---

## 1. Controller Definition (Main Process)

```ts
// main/controllers/settings.controller.ts
import { Controller, IpcHandle, IpcOn } from "framework";

@Controller()
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  // Request/Response style
  @IpcHandle()
  async get() {
    return this.settingsService.getSettings();
  }

  @IpcHandle()
  async set(newSettings: { theme: string }) {
    return this.settingsService.setSettings(newSettings);
  }

  // Event / Subscription style
  @IpcOn()
  reset() {
    return this.settingsService.resetSettings();
  }
}
```

**Key points:**

- `@IpcHandle` | `@IpcHandleOnce` = request-response (`ipcMain.handle` or `ipcMain.handleOnce`)
- `@IpcOn` | `@IpcOnOnce` = event listener (`ipcMain.on` or `ipcMain.once`)
- Metadata captures channels and handler info automatically

---

## 2. Application Bootstrap (Main Process)

```ts
// main/ipc-app.ts
import { createIpcApp } from "framework";
import { SettingsController } from "./controllers/settings.controller";

export const app = createIpcApp({
  controllers: [SettingsController],
  correlation: true,
  resolver: (controller) => controllerResolvingMechanism(controller),
  window: browserWindow,
});
```

**What happens under the hood:**

- Controllers instantiated
- IPC handlers registered with `ipcMain`
- Correlation IDs optionally enabled
- Metadata collected for preload generation

---

## 3. Preload API Generation

```ts
// preload/ipc.ts
import { app } from "../main/ipc-app";
import { contextBridge } from "electron";

const preloadApi = app.generatePreloadApi();

contextBridge.exposeInMainWorld("ipc", preloadApi);
```

**Developer experience:**

- No channel strings in renderer
- Fully typed API
- Safe `contextBridge` exposure

---

## 4. Renderer Usage

```ts
// renderer/settings.ts
declare global {
  interface Window {
    ipc: {
      settings: {
        get(): Promise<{ theme: string }>;
        set(newSettings: { theme: string }): Promise<{ theme: string }>;
        changed(callback: (settings: { theme: string }) => void): void;
      };
    };
  }
}

// Reading settings
const current = await window.ipc.settings.get();
console.log("Current theme:", current.theme);

// Updating settings
await window.ipc.settings.set({ theme: "dark" });

// Listening for changes
window.ipc.settings.reset((updated) => {
  console.log("Settings changed:", updated.theme);
});
```

**Key points:**

- Renderer never imports Electron modules
- No duplication of channel names
- Fully typed (if using TypeScript)
- Clean, intuitive, and maintainable API

---

## 5. Observability Example (Correlation IDs)

- Every IPC request automatically generates a **correlation ID**
- Available in the main process via the async context
- Useful for logging, tracing, or debugging multi-step workflows

Example (simplified):

```ts
import { getCorrelationId, IpcHandle } from "framework";

@IpcHandle()
async getSettings() {
  console.log("Handling getSettings request", { correlationId: getCorrelationId() });
  return this.settings;
}
```

---

## 6. Summary of Developer Experience

| Phase            | Developer Writes                  | Framework Provides                         |
| ---------------- | --------------------------------- | ------------------------------------------ |
| Main Process     | Controllers + decorators          | IPC registration, correlation wrapping     |
| Preload Process  | `contextBridge` call              | Preload API derived automatically          |
| Renderer Process | Type-safe calls to `window.ipc`   | Automatic channel routing, typed proxy     |
| Logging/Tracing  | Optional access to correlation ID | Unique IDs per IPC request, no boilerplate |

**Key Benefits:**

- One place to define IPC behavior
- Zero duplication of strings
- Fully typed renderer API
- Observable, testable, secure
- Mirrors backend frameworks (NestJS style) for familiar mental model
