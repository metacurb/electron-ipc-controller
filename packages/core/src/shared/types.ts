export type IpcHandlerType = "handle" | "handleOnce" | "on" | "once";

export interface SerializedHandler {
  channel: string;
  methodName: string;
  type: IpcHandlerType;
}

export interface SerializedController {
  handlers: SerializedHandler[];
  id: string;
  namespace: string;
}

export interface SerializedIpcContract {
  controllers: SerializedController[];
}
