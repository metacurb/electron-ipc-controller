import { getControllerMetadata } from "../metadata/get-controller-metadata";
import { Constructor, IpcControllerMetadata, IpcHandlerMetadata } from "../metadata/types";

import { assembleIpc } from "./assemble-ipc";
import { registerHandler } from "./register-handler";
import { ControllerResolver } from "./types";

jest.mock("./register-handler");
jest.mock("../metadata/get-controller-metadata");

const mockRegisterHandler = jest.mocked(registerHandler);
const mockGetControllerMetadata = jest.mocked(getControllerMetadata);

describe("assembleIpc", () => {
  const mockDisposer = jest.fn();
  const mockResolver: ControllerResolver = {
    resolve: jest.fn((controller) => new controller()),
  };

  const createMockHandler = (methodName: string, type: IpcHandlerMetadata["type"] = "handle"): IpcHandlerMetadata => ({
    channel: `test_channel_${methodName}`,
    handler: jest.fn(),
    methodName,
    type,
  });

  const createMockMetadata = (handlers: IpcHandlerMetadata[]): IpcControllerMetadata => ({
    handlers: new Map(handlers.map((h) => [h.methodName, h])),
    id: "test-id",
    namespace: "test-namespace",
    target: class {} as Constructor,
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockRegisterHandler.mockReturnValue(mockDisposer);
  });

  test("should resolve each controller using the provided resolver", () => {
    class ControllerA {}
    class ControllerB {}

    const handler = createMockHandler("method");
    const metadata = createMockMetadata([handler]);

    mockGetControllerMetadata.mockReturnValue(metadata);

    assembleIpc([ControllerA, ControllerB], { resolver: mockResolver });

    expect(mockResolver.resolve).toHaveBeenCalledTimes(2);
    expect(mockResolver.resolve).toHaveBeenCalledWith(ControllerA);
    expect(mockResolver.resolve).toHaveBeenCalledWith(ControllerB);
  });

  test("should get metadata for each controller", () => {
    class ControllerA {}
    class ControllerB {}

    const handler = createMockHandler("method");
    const metadata = createMockMetadata([handler]);

    mockGetControllerMetadata.mockReturnValue(metadata);

    assembleIpc([ControllerA, ControllerB], { resolver: mockResolver });

    expect(mockGetControllerMetadata).toHaveBeenCalledTimes(2);
    expect(mockGetControllerMetadata).toHaveBeenCalledWith(ControllerA);
    expect(mockGetControllerMetadata).toHaveBeenCalledWith(ControllerB);
  });

  test("should register each handler from the controller metadata", () => {
    class Controller {}

    const handler1 = createMockHandler("method1", "handle");
    const handler2 = createMockHandler("method2", "on");
    const metadata = createMockMetadata([handler1, handler2]);

    mockGetControllerMetadata.mockReturnValue(metadata);

    assembleIpc([Controller], { resolver: mockResolver });

    expect(mockRegisterHandler).toHaveBeenCalledTimes(2);
    expect(mockRegisterHandler).toHaveBeenCalledWith(handler1, expect.any(Controller), {
      correlation: undefined,
    });
    expect(mockRegisterHandler).toHaveBeenCalledWith(handler2, expect.any(Controller), {
      correlation: undefined,
    });
  });

  test("should pass correlation option to registerHandler", () => {
    class Controller {}

    const handler = createMockHandler("method");
    const metadata = createMockMetadata([handler]);

    mockGetControllerMetadata.mockReturnValue(metadata);

    assembleIpc([Controller], { correlation: true, resolver: mockResolver });

    expect(mockRegisterHandler).toHaveBeenCalledWith(handler, expect.any(Controller), {
      correlation: true,
    });
  });

  test("should pass correlation: false to registerHandler when specified", () => {
    class Controller {}

    const handler = createMockHandler("method");
    const metadata = createMockMetadata([handler]);

    mockGetControllerMetadata.mockReturnValue(metadata);

    assembleIpc([Controller], { correlation: false, resolver: mockResolver });

    expect(mockRegisterHandler).toHaveBeenCalledWith(handler, expect.any(Controller), {
      correlation: false,
    });
  });

  test("should collect and return all disposers from registerHandler", () => {
    class Controller {}

    const disposer1 = jest.fn();
    const disposer2 = jest.fn();

    const handler1 = createMockHandler("method1");
    const handler2 = createMockHandler("method2");
    const metadata = createMockMetadata([handler1, handler2]);

    mockGetControllerMetadata.mockReturnValue(metadata);
    mockRegisterHandler.mockReturnValueOnce(disposer1).mockReturnValueOnce(disposer2);

    const disposers = assembleIpc([Controller], { resolver: mockResolver });

    expect(disposers).toHaveLength(2);
    expect(disposers).toContain(disposer1);
    expect(disposers).toContain(disposer2);
  });

  test("should not include undefined disposers in the returned array", () => {
    class Controller {}

    const disposer1 = jest.fn();

    const handler1 = createMockHandler("method1");
    const handler2 = createMockHandler("method2");
    const metadata = createMockMetadata([handler1, handler2]);

    mockGetControllerMetadata.mockReturnValue(metadata);
    mockRegisterHandler.mockReturnValueOnce(disposer1).mockReturnValueOnce(undefined);

    const disposers = assembleIpc([Controller], { resolver: mockResolver });

    expect(disposers).toHaveLength(1);
    expect(disposers).toContain(disposer1);
  });

  test("should return empty array when no controllers are provided", () => {
    const disposers = assembleIpc([], { resolver: mockResolver });

    expect(disposers).toEqual([]);
    expect(mockGetControllerMetadata).not.toHaveBeenCalled();
    expect(mockRegisterHandler).not.toHaveBeenCalled();
  });

  test("should return empty array and warn when controller has no handlers", () => {
    const consoleWarn = jest.spyOn(console, "warn").mockImplementation();
    class Controller {}

    const metadata = createMockMetadata([]);

    mockGetControllerMetadata.mockReturnValue(metadata);

    const disposers = assembleIpc([Controller], { resolver: mockResolver });

    expect(disposers).toEqual([]);
    expect(mockRegisterHandler).not.toHaveBeenCalled();
    expect(consoleWarn).toHaveBeenCalledWith("Controller 'Controller' has no IPC handlers registered.");

    consoleWarn.mockRestore();
  });

  test("should handle multiple controllers with multiple handlers", () => {
    class ControllerA {}
    class ControllerB {}

    const handlerA1 = createMockHandler("methodA1");
    const handlerA2 = createMockHandler("methodA2");
    const handlerB1 = createMockHandler("methodB1");

    const metadataA = createMockMetadata([handlerA1, handlerA2]);
    const metadataB = createMockMetadata([handlerB1]);

    mockGetControllerMetadata.mockReturnValueOnce(metadataA).mockReturnValueOnce(metadataB);

    const disposer1 = jest.fn();
    const disposer2 = jest.fn();
    const disposer3 = jest.fn();
    mockRegisterHandler.mockReturnValueOnce(disposer1).mockReturnValueOnce(disposer2).mockReturnValueOnce(disposer3);

    const disposers = assembleIpc([ControllerA, ControllerB], { resolver: mockResolver });

    expect(mockRegisterHandler).toHaveBeenCalledTimes(3);
    expect(disposers).toHaveLength(3);
    expect(disposers).toContain(disposer1);
    expect(disposers).toContain(disposer2);
    expect(disposers).toContain(disposer3);
  });

  test("should rethrow with context if resolver fails", () => {
    class Controller {}
    const error = new Error("Resolution failed");
    (mockResolver.resolve as jest.Mock).mockImplementation(() => {
      throw error;
    });

    expect(() => assembleIpc([Controller], { resolver: mockResolver })).toThrow(
      "Failed to resolve controller 'Controller': Resolution failed",
    );
  });
});
