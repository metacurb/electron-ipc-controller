import { ipcMain } from "electron";

import { IpcHandlerMetadata } from "../metadata/types";
import { buildChannel } from "../utils/naming";

import { registerHandler } from "./register-handler";

jest.mock("electron", () => ({
  ipcMain: {
    handle: jest.fn(),
    handleOnce: jest.fn(),
    on: jest.fn(),
    once: jest.fn(),
    removeHandler: jest.fn(),
    removeListener: jest.fn(),
  },
}));

jest.mock("../utils/naming");

const mockBuildChannel = jest.mocked(buildChannel);

const testNamespace = "test-namespace";
const mockChannel = "mock_channel";

describe("registerHandler", () => {
  const mockInstance = {
    testMethod: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockBuildChannel.mockReturnValue(mockChannel);
  });

  const createHandler = (type: IpcHandlerMetadata["type"]): IpcHandlerMetadata => ({
    handler: mockInstance.testMethod,
    methodName: "method",
    rawEvent: false,
    type,
  });

  test("should register 'handle' and return disposer", () => {
    const handler = createHandler("handle");
    const dispose = registerHandler(handler, mockInstance, {
      correlation: false,
      namespace: testNamespace,
    });

    expect(ipcMain.handle).toHaveBeenCalledWith(mockChannel, expect.any(Function));

    expect(dispose).toBeDefined();
    dispose!();
    expect(ipcMain.removeHandler).toHaveBeenCalledWith(mockChannel);
  });

  test("should register 'handleOnce' and return disposer", () => {
    const handler = createHandler("handleOnce");
    const dispose = registerHandler(handler, mockInstance, {
      correlation: false,
      namespace: testNamespace,
    });

    expect(ipcMain.handleOnce).toHaveBeenCalledWith(mockChannel, expect.any(Function));

    expect(dispose).toBeDefined();
    dispose!();
    expect(ipcMain.removeHandler).toHaveBeenCalledWith(mockChannel);
  });

  test("should register 'on' and return disposer", () => {
    const handler = createHandler("on");
    const dispose = registerHandler(handler, mockInstance, {
      correlation: false,
      namespace: testNamespace,
    });

    expect(ipcMain.on).toHaveBeenCalledWith(mockChannel, expect.any(Function));

    expect(dispose).toBeDefined();
    dispose!();
    expect(ipcMain.removeListener).toHaveBeenCalledWith(mockChannel, expect.any(Function));
  });

  test("should register 'once' and return disposer", () => {
    const handler = createHandler("once");
    const dispose = registerHandler(handler, mockInstance, {
      correlation: false,
      namespace: testNamespace,
    });

    expect(ipcMain.once).toHaveBeenCalledWith(mockChannel, expect.any(Function));

    expect(dispose).toBeDefined();
    dispose!();
    expect(ipcMain.removeListener).toHaveBeenCalledWith(mockChannel, expect.any(Function));
  });
});
