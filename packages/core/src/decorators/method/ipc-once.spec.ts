import { IPC_PENDING_HANDLERS } from "../../metadata/constants";
import { PendingHandlerMetadata } from "../../metadata/types";

import { IpcOnce } from "./ipc-once";

describe("IpcOnce decorator", () => {
  test("should attach metadata with once type", () => {
    class TestController {
      @IpcOnce()
      fooHandler() {
        return "bar";
      }
    }

    const [meta]: PendingHandlerMetadata[] = Reflect.getOwnMetadata(
      IPC_PENDING_HANDLERS,
      TestController.prototype,
    );

    expect(meta.handler).toBeDefined();
    expect(meta.type).toBe("once");
  });
});
