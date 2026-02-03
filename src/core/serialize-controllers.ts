import { getControllerMetadata } from "../metadata/get-controller-metadata";
import { Constructor } from "../metadata/types";

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

export const serializeControllers = (controllers: Constructor[]): SerializedIpcContract => ({
  controllers: controllers.map((Controller) => {
    const metadata = getControllerMetadata(Controller);
    return {
      handlers: Array.from(metadata.handlers.values()).map((handler) => ({
        channel: handler.channel,
        methodName: handler.methodName,
        type: handler.type,
      })),
      id: metadata.id,
      namespace: metadata.namespace,
    };
  }),
});
