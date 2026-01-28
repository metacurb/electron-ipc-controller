import Container from "typedi";

import { createControllerMetadata } from "../metadata/controller-metadata";
import { IpcControllerMetadata } from "../metadata/types";

import { IpcController } from "./ipc-controller";
import { IPC_PENDING_HANDLERS } from "./utils/create-ipc-decorator";

jest.mock("../metadata/controller-metadata");

const mockCreateControllerMetadata = jest.mocked(createControllerMetadata);

describe("IpcController decorator", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Container.reset();
  });

  test("should register class in Container", () => {
    @IpcController()
    class TestController {}

    expect(Container.has(TestController)).toBe(true);
    expect(Container.get(TestController)).toBeInstanceOf(TestController);
  });

  test("should set default namespace from class name", () => {
    @IpcController()
    class UserProfileController {}

    expect(mockCreateControllerMetadata).toHaveBeenCalledWith(UserProfileController);
  });

  test("should register pending handlers", () => {
    const handlers = new Map();

    mockCreateControllerMetadata.mockReturnValue({
      handlers,
      id: "id",
      namespace: "test",
      target: class {},
    } as IpcControllerMetadata);

    const pending = [{ handler: jest.fn(), methodName: "handleSomething", type: "handle" }];

    class TestController {}
    Reflect.defineMetadata(IPC_PENDING_HANDLERS, pending, TestController);

    IpcController()(TestController);

    expect(handlers.get("handleSomething")).toBe(pending[0]);
  });

  test("should throw on duplicate handlers", () => {
    const handlers = new Map();
    handlers.set("handleSomething", {});

    mockCreateControllerMetadata.mockReturnValue({
      handlers,
      id: "id",
      namespace: "test",
      target: class {},
    } as IpcControllerMetadata);

    const pending = [{ handler: jest.fn(), methodName: "handleSomething", type: "handle" }];

    class TestController {}
    Reflect.defineMetadata(IPC_PENDING_HANDLERS, pending, TestController);

    expect(() => IpcController()(TestController)).toThrow("Duplicate handler name handleSomething");
  });
});
