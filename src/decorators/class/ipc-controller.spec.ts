import { IPC_PENDING_HANDLERS } from "../../metadata/constants";
import { getControllerMetadata } from "../../metadata/get-controller-metadata";
import { setControllerMetadata } from "../../metadata/set-controller-metadata";
import { IpcHandlerMetadata } from "../../metadata/types";
import { createChannelName } from "../../utils/create-channel-name";
import { IpcHandle } from "../method/ipc-handle";

import { IpcController } from "./ipc-controller";

jest.mock("../metadata/set-controller-metadata");
jest.mock("../utils/create-channel-name");

const mockSetControllerMetadata = jest.mocked(setControllerMetadata);
const mockCreateChannelName = jest.mocked(createChannelName);

describe("IpcController decorator", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateChannelName.mockReturnValue("test");
  });

  test("should register pending handlers", () => {
    const handlers = new Map();

    mockCreateChannelName.mockReturnValue("test");
    mockSetControllerMetadata.mockReturnValue({
      handlers,
      id: "id",
      namespace: "test",
      target: class {},
    });

    const pending = [
      { channel: "test", handler: jest.fn(), methodName: "handleSomething", type: "handle" },
    ];

    class TestController {}
    Reflect.defineMetadata(IPC_PENDING_HANDLERS, pending, TestController.prototype);

    IpcController()(TestController);

    expect(mockCreateChannelName).toHaveBeenCalledWith("test", "handleSomething");
    expect(handlers.get("handleSomething")).toEqual(pending[0]);
  });

  test("should throw on duplicate handlers", () => {
    const handlerMeta: IpcHandlerMetadata = {
      channel: "test",
      handler: jest.fn(),
      methodName: "handleSomething",
      type: "handle",
    };

    const handlers = new Map(Object.entries({ handleSomething: handlerMeta }));

    mockSetControllerMetadata.mockReturnValue({
      handlers,
      id: "id",
      namespace: "test",
      target: class {},
    });

    const pending = [{ handler: jest.fn(), methodName: "handleSomething", type: "handle" }];

    class TestController {}
    Reflect.defineMetadata(IPC_PENDING_HANDLERS, pending, TestController.prototype);

    expect(() => IpcController()(TestController)).toThrow("Duplicate handler name handleSomething");
  });
});
