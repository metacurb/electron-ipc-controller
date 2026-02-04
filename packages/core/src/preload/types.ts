import { IpcHandlerType } from "../metadata/types";

// Disposer function returned by event subscriptions
export type Disposer = () => void;

// Handler types based on IPC method type
export type HandleMethod<TArgs extends unknown[] = unknown[], TReturn = unknown> = (
  ...args: TArgs
) => Promise<TReturn>;

export type SendMethod<TArgs extends unknown[] = unknown[]> = (...args: TArgs) => void;

// Namespace contains methods
export type PreloadNamespace = Record<string, HandleMethod | SendMethod>;

// Full preload API structure
export type PreloadApi = Record<string, PreloadNamespace>;

// Method creator signature for type-safe implementation
export type MethodCreator = (channel: string, type: IpcHandlerType) => HandleMethod | SendMethod;
