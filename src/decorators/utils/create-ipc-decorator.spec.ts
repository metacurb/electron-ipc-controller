import { IpcHandlerMetadata } from "../../metadata/types";

import { createIpcDecorator, IPC_PENDING_HANDLERS } from "./create-ipc-decorator";

describe("createIpcDecorator", () => {
  const TestDecorator = createIpcDecorator("handle");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should attach metadata", () => {
    class TestController {
      @TestDecorator("foo")
      method() {}
    }

    const [meta]: IpcHandlerMetadata[] = Reflect.getOwnMetadata(
      IPC_PENDING_HANDLERS,
      TestController.prototype,
    );

    expect(meta).toEqual<IpcHandlerMetadata>({
      handler: expect.any(Function),
      methodName: "method",
      rawEvent: false,
      type: "handle",
    });
  });

  test("should support custom options", () => {
    class TestController {
      @TestDecorator("bar", { rawEvent: true })
      method() {}
    }

    const [meta]: IpcHandlerMetadata[] = Reflect.getOwnMetadata(
      IPC_PENDING_HANDLERS,
      TestController.prototype,
    );

    expect(meta.rawEvent).toBe(true);
  });
});
