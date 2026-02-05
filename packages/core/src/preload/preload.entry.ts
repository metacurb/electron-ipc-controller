import { setupPreload } from "./setup-preload";

setupPreload()
  .then(() => console.log("[electron-ipc-controller] IPC API ready"))
  .catch((err) => console.error("[electron-ipc-controller] Failed to setup IPC API:", err));
