export interface IpcControllerMetadata {
  handlers: Map<string, IpcHandlerMetadata>;
  id: string;
  namespace: string;
  target: Constructor;
}

export type IpcHandlerType = "handle" | "handleOnce" | "on" | "once";

export interface IpcHandlerMetadata {
  channel: string;
  handler: (...args: unknown[]) => unknown;
  methodName: string;
  type: IpcHandlerType;
}

export type PendingHandlerMetadata = Omit<IpcHandlerMetadata, "channel">;

export interface IpcApplicationMetadata {
  controllers: Map<string, IpcControllerMetadata>;
  disposers: Disposer[];
}

export type Constructor<T = unknown> = new (...args: unknown[]) => T;

export type Disposer = () => void;
