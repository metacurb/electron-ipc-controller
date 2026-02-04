import { Constructor } from "../metadata/types";

export interface ControllerResolver {
  resolve<T>(controller: Constructor<T>): T;
}

export interface SerializedHandler {
  channel: string;
  methodName: string;
  type: string;
}

export interface SerializedController {
  handlers: SerializedHandler[];
  id: string;
  namespace: string;
}

export interface SerializedIpcContract {
  controllers: SerializedController[];
}
