import { IpcHandlerType } from "@electron-ipc-bridge/shared";
import { IpcMainEvent, IpcMainInvokeEvent } from "electron";

export interface IpcControllerMetadata {
  handlers: Map<string, IpcHandlerMetadata>;
  id: string;
  namespace: string;
  target: Constructor;
}

export interface IpcHandlerMetadata {
  channel: string;
  handler: (...args: unknown[]) => unknown;
  methodName: string;
  paramInjections?: ParameterInjection[];
  type: IpcHandlerType;
}

export interface ParameterInjectionContext {
  channel: string;
}

export interface ParameterInjection<T = unknown> {
  data?: unknown;
  index: number;
  resolver: (event: IpcMainEvent | IpcMainInvokeEvent, context: ParameterInjectionContext, data?: T) => unknown;
}

export type PendingHandlerMetadata = Omit<IpcHandlerMetadata, "channel">;

export interface IpcApplicationMetadata {
  controllers: Map<string, IpcControllerMetadata>;
  disposers: Disposer[];
}

export interface Constructor<T = unknown> {
  new (...args: unknown[]): T;
  prototype: T;
}

export type Disposer = () => void;
