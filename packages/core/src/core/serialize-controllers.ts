import { getControllerMetadata } from "../metadata/get-controller-metadata";
import { Constructor } from "../metadata/types";

import { SerializedIpcContract } from "./types";

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
