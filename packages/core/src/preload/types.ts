import { IpcHandlerType } from "@electron-ipc-bridge/shared";

export type Disposer = () => void;

export type HandleMethod<TArgs extends unknown[] = unknown[], TReturn = unknown> = (...args: TArgs) => Promise<TReturn>;

export type SendMethod<TArgs extends unknown[] = unknown[]> = (...args: TArgs) => void;

export type PreloadNamespace = Record<string, HandleMethod | SendMethod>;

export type PreloadApi = Record<string, PreloadNamespace>;

export type MethodCreator = (channel: string, type: IpcHandlerType) => HandleMethod | SendMethod;
