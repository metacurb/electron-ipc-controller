import { IPC_CONTROLLER_METADATA } from "./constants";
import type { Constructor } from "./types";

export const isIpcController = (value: unknown): value is Constructor => {
  if (typeof value !== "function") return false;
  if (!("prototype" in value) || value.prototype === undefined) return false;
  const meta = Reflect.getMetadata(IPC_CONTROLLER_METADATA, value);
  return meta !== undefined;
};
