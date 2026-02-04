import { IPC_PENDING_HANDLERS } from "../../metadata/constants";
import { PendingHandlerMetadata } from "../../metadata/types";

import { IpcOn } from "./ipc-on";

describe("IpcOn decorator", () => {
  test("should attach metadata with on type", () => {
    class TestController {
      @IpcOn()
      fooHandler() {
        return "bar";
      }
    }

    const [meta]: PendingHandlerMetadata[] = Reflect.getOwnMetadata(IPC_PENDING_HANDLERS, TestController.prototype);

    expect(meta.handler).toBeDefined();
    expect(meta.type).toBe("on");
  });
});
