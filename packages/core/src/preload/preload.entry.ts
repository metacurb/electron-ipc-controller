import { setupPreload } from "./setup-preload";

setupPreload()
  .then(() => console.log("[electron-ipc-bridge] IPC API ready"))
  .catch((err) => console.error("[electron-ipc-bridge] Failed to setup IPC API:", err));
