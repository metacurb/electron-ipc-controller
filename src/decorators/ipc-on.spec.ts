import { IpcHandlerMetadata } from "../metadata/types";

import { IpcOn } from "./ipc-on";
import { IPC_PENDING_HANDLERS } from "./utils/create-ipc-decorator";

describe("IpcOn decorator", () => {
  test("should attach metadata with on type", () => {
    class TestController {
      @IpcOn("foo")
      fooHandler() {
        return "bar";
      }
    }

    const [meta]: IpcHandlerMetadata[] = Reflect.getOwnMetadata(
      IPC_PENDING_HANDLERS,
      TestController.prototype,
    );

    expect(meta.handler).toBeDefined();
    expect(meta.type).toBe("on");
  });
});
