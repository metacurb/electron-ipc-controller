import { IPC_PENDING_HANDLERS } from "../../metadata/constants";
import { IpcHandlerMetadata } from "../../metadata/types";
import { IpcController } from "../class/ipc-controller";

import { IpcHandleOnce } from "./ipc-handle-once";

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
