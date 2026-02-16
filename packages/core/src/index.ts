import "reflect-metadata";

export { IpcController } from "./decorators/class";
export { IpcHandle, IpcHandleOnce, IpcOn, IpcOnce } from "./decorators/method";
export { Channel, CorrelationId, Origin, ProcessId, RawEvent, Sender, Validate, Window } from "./decorators/param";

export { createParamDecorator } from "./decorators/utils/create-param-decorator";
export { getCorrelationId } from "./correlation/get-correlation-id";
export type { ParameterInjectionContext } from "./metadata/types";

export { createIpcApp } from "./core/create-ipc-app";
export type { IpcApp, IpcAppOptions } from "./core/create-ipc-app";
export { isIpcController } from "./metadata/is-ipc-controller";
