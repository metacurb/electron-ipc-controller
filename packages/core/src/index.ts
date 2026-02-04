export { IpcController } from "./decorators/class/ipc-controller";

export { IpcHandle } from "./decorators/method/ipc-handle";
export { IpcHandleOnce } from "./decorators/method/ipc-handle-once";
export { IpcOn } from "./decorators/method/ipc-on";
export { IpcOnce } from "./decorators/method/ipc-once";

export { RawEvent } from "./decorators/param/raw-event";
export { Sender } from "./decorators/param/sender";
export { ProcessId } from "./decorators/param/process-id";
export { Origin } from "./decorators/param/origin";
export { Window } from "./decorators/param/window";

export { createParamDecorator } from "./decorators/utils/create-param-decorator";

export { createIpcApp, IpcApp, IpcAppOptions } from "./core/create-ipc-app";

export { getCorrelationId } from "./correlation/get-correlation-id";

export { setupPreload } from "./preload";
export type { InferIpcApi, IpcContract } from "./preload/infer-ipc-api";
export type { Disposer, HandleMethod, PreloadApi, PreloadNamespace } from "./preload/types";
