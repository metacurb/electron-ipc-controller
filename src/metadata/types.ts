export interface IpcControllerMetadata {
  handlers: Map<string, IpcHandlerMetadata>;
  id: string;
  namespace: string;
  target: Constructor;
}

export type IpcHandlerType = "handle" | "handleOnce" | "on" | "once";

export interface IpcHandlerMetadata {
  handler: (...args: unknown[]) => unknown;
  methodName: string;
  rawEvent: boolean;
  type: IpcHandlerType;
}

export interface IpcApplicationMetadata {
  controllers: Map<string, IpcControllerMetadata>;
}

export type Constructor<T = unknown> = new (...args: unknown[]) => T;

export type ControllerConstructor<T = unknown> = new (...args: unknown[]) => T;

export type Disposer = () => void;

export interface IpcDecoratorOptions {
  rawEvent?: boolean;
}
