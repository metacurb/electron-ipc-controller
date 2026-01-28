import { IpcHandlerMetadata } from "../metadata/types";

import { IpcController } from "./ipc-controller";
import { IpcHandleOnce } from "./ipc-handle-once";
import { IPC_PENDING_HANDLERS } from "./utils/create-ipc-decorator";

describe("IpcHandleOnce decorator", () => {
  test("should attach metadata with handleOnce type", () => {
    @IpcController()
    class TestController {
      @IpcHandleOnce()
      fooHandler() {
        return "bar";
      }
    }

    const [meta]: IpcHandlerMetadata[] = Reflect.getOwnMetadata(
      IPC_PENDING_HANDLERS,
      TestController.prototype,
    );

    expect(meta.handler).toBeDefined();
    expect(meta.type).toBe("handleOnce");
  });
});
