import { IPC_METHOD_DECORATOR_NAMES } from "@electron-ipc-bridge/shared";

import { IpcHandle } from "./ipc-handle";
import { IpcHandleOnce } from "./ipc-handle-once";
import { IpcOn } from "./ipc-on";
import { IpcOnce } from "./ipc-once";

type MethodDecoratorName = (typeof IPC_METHOD_DECORATOR_NAMES)[number];

export const IPC_METHOD_DECORATORS = {
  IpcHandle,
  IpcHandleOnce,
  IpcOn,
  IpcOnce,
} satisfies Record<MethodDecoratorName, (name?: string) => MethodDecorator>;

export { IpcHandle, IpcHandleOnce, IpcOn, IpcOnce };
