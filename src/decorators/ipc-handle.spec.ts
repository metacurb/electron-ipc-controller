import { IpcHandlerMetadata } from "../metadata/types";

import { IpcController } from "./ipc-controller";
import { IpcHandle } from "./ipc-handle";
import { IPC_PENDING_HANDLERS } from "./utils/create-ipc-handler-decorator";

describe("IpcHandle decorator", () => {
  test("should attach metadata with handle type", () => {
    @IpcController()
    class TestController {
      @IpcHandle()
      fooHandler() {
        return "bar";
      }
    }

    const [meta]: IpcHandlerMetadata[] = Reflect.getOwnMetadata(
      IPC_PENDING_HANDLERS,
      TestController.prototype,
    );

    expect(meta.handler).toBeDefined();
    expect(meta.type).toBe("handle");
  });
});
