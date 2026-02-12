import { deriveNamespace } from "@electron-ipc-bridge/shared";
import { randomUUID } from "node:crypto";

import { Constructor, IpcControllerMetadata } from "./types";

export const generateMetadata = (target: Constructor, namespace?: string): IpcControllerMetadata => ({
  handlers: new Map(),
  id: randomUUID(),
  namespace: namespace || deriveNamespace(target.name),
  target,
});
