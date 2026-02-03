import { IPC_PENDING_HANDLERS } from "../../metadata/constants";
import { PendingHandlerMetadata } from "../../metadata/types";

import { createIpcHandlerDecorator } from "./create-ipc-handler-decorator";

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

    const [meta]: PendingHandlerMetadata[] = Reflect.getOwnMetadata(
      IPC_PENDING_HANDLERS,
      TestController.prototype,
    );

    expect(meta).toEqual<PendingHandlerMetadata>({
      handler: expect.any(Function),
      methodName: "methodName",
      type: "handle",
    });
  });
});
