import "reflect-metadata";

export { IpcController } from "./decorators/class/ipc-controller";

export { IpcHandle } from "./decorators/method/ipc-handle";
export { IpcHandleOnce } from "./decorators/method/ipc-handle-once";
export { IpcOn } from "./decorators/method/ipc-on";
export { IpcOnce } from "./decorators/method/ipc-once";

export { CorrelationId } from "./decorators/param/correlation-id";
export { Origin } from "./decorators/param/origin";
export { ProcessId } from "./decorators/param/process-id";
export { RawEvent } from "./decorators/param/raw-event";
export { Sender } from "./decorators/param/sender";
export { Window } from "./decorators/param/window";

export { createParamDecorator } from "./decorators/utils/create-param-decorator";

export { createIpcApp } from "./core/create-ipc-app";
export type { IpcApp, IpcAppOptions } from "./core/create-ipc-app";

export { getCorrelationId } from "./correlation/get-correlation-id";
