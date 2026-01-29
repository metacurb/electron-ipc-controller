import { IpcHandlerMetadata } from "../../metadata/types";

import { createIpcHandlerDecorator, IPC_PENDING_HANDLERS } from "./create-ipc-handler-decorator";

describe("createIpcHandlerDecorator", () => {
  const TestDecorator = createIpcHandlerDecorator("handle");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should attach metadata", () => {
    class TestController {
      @TestDecorator()
      methodName() {}
    }

    const [meta]: IpcHandlerMetadata[] = Reflect.getOwnMetadata(
      IPC_PENDING_HANDLERS,
      TestController.prototype,
    );

    expect(meta).toEqual<IpcHandlerMetadata>({
      handler: expect.any(Function),
      methodName: "methodName",
      type: "handle",
    });
  });
});
