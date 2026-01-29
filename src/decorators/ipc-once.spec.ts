import { IpcHandlerMetadata } from "../metadata/types";

import { IpcOnce } from "./ipc-once";
import { IPC_PENDING_HANDLERS } from "./utils/create-ipc-handler-decorator";

describe("IpcOnce decorator", () => {
  test("should attach metadata with once type", () => {
    class TestController {
      @IpcOnce()
      fooHandler() {
        return "bar";
      }
    }

    const [meta]: IpcHandlerMetadata[] = Reflect.getOwnMetadata(
      IPC_PENDING_HANDLERS,
      TestController.prototype,
    );

    expect(meta.handler).toBeDefined();
    expect(meta.type).toBe("once");
  });
});
