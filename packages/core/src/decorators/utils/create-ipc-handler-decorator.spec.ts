import { IPC_PARAM_INJECTIONS, IPC_PENDING_HANDLERS } from "../../metadata/constants";
import { ParameterInjection, PendingHandlerMetadata } from "../../metadata/types";

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

    const [meta]: PendingHandlerMetadata[] = Reflect.getOwnMetadata(IPC_PENDING_HANDLERS, TestController.prototype);

    expect(meta).toEqual<PendingHandlerMetadata>({
      handler: expect.any(Function),
      methodName: "methodName",
      paramInjections: undefined,
      type: "handle",
    });
  });

  test("should support custom method name", () => {
    class TestController {
      @TestDecorator("customName")
      methodName() {}
    }

    const [meta]: PendingHandlerMetadata[] = Reflect.getOwnMetadata(IPC_PENDING_HANDLERS, TestController.prototype);

    expect(meta).toEqual<PendingHandlerMetadata>({
      handler: expect.any(Function),
      methodName: "customName",
      paramInjections: undefined,
      type: "handle",
    });
  });

  test("should include parameter injections if present", () => {
    class TestController {
      methodName() {}
    }

    const mockInjections: ParameterInjection[] = [{ index: 0, resolver: () => {} }];

    Reflect.defineMetadata(IPC_PARAM_INJECTIONS, mockInjections, TestController.prototype, "methodName");

    const descriptor = Object.getOwnPropertyDescriptor(TestController.prototype, "methodName")!;

    createIpcHandlerDecorator("handle")()(TestController.prototype, "methodName", descriptor);

    const meta: PendingHandlerMetadata[] = Reflect.getOwnMetadata(IPC_PENDING_HANDLERS, TestController.prototype);

    const lastMeta = meta[meta.length - 1];

    expect(lastMeta.paramInjections).toEqual(mockInjections);
  });

  test("should throw if multiple decorators applied to same method", () => {
    expect(() => {
      class TestController {
        @TestDecorator()
        @TestDecorator()
        methodName() {}
      }
    }).toThrow("Method 'methodName' already has an IPC decorator.");
  });

  test("should throw if applied to a non-method", () => {
    expect(() => {
      class TestController {
        // @ts-expect-error This is a method decorator, but we're validating it anyway
        @TestDecorator()
        notAMethod = "string";
      }
    }).toThrow("IPC decorators can only be applied to methods.");
  });
});
