import { ipcMain } from "electron";

import { wrapWithCorrelation } from "../correlation/wrap-with-correlation";
import { IpcHandlerMetadata, IpcHandlerType } from "../metadata/types";
import { createChannelName } from "../utils/create-channel-name";

import { registerHandler } from "./register-handler";

jest.mock("../correlation/wrap-with-correlation");
jest.mock("../utils/create-channel-name");

const mockCreateChannelName = jest.mocked(createChannelName);
const mockWrapWithCorrelation = jest.mocked(wrapWithCorrelation);

const mockChannel = "mock_channel";

describe("registerHandler", () => {
  const mockInstance = {
    testMethod: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockCreateChannelName.mockReturnValue(mockChannel);
    mockWrapWithCorrelation.mockImplementation((handler) => handler);
  });

  const createHandler = (type: IpcHandlerMetadata["type"]): IpcHandlerMetadata => ({
    channel: mockChannel,
    handler: mockInstance.testMethod,
    methodName: "method",
    type,
  });

  test.each([
    ["handle", ipcMain.handle, ipcMain.removeHandler],
    ["handleOnce", ipcMain.handleOnce, ipcMain.removeHandler],
  ])("should register %s and return disposer", (type, registerFn, removeFn) => {
    const handler = createHandler(type as IpcHandlerType);
    const dispose = registerHandler(handler, mockInstance, {
      correlation: false,
    });

    expect(registerFn).toHaveBeenCalledWith(mockChannel, expect.any(Function));
    expect(mockWrapWithCorrelation).toHaveBeenCalledWith(mockInstance.testMethod, false);
    expect(dispose).toBeDefined();
    dispose!();
    expect(removeFn).toHaveBeenCalledWith(mockChannel);
  });

  test.each([
    ["on", ipcMain.on, ipcMain.removeListener],
    ["once", ipcMain.once, ipcMain.removeListener],
  ])("should register '%s' and return disposer", (type, registerFn, removeFn) => {
    const handler = createHandler(type as IpcHandlerType);
    const dispose = registerHandler(handler, mockInstance, {
      correlation: false,
    });

    expect(registerFn).toHaveBeenCalledWith(mockChannel, expect.any(Function));
    expect(mockWrapWithCorrelation).toHaveBeenCalledWith(mockInstance.testMethod, false);
    expect(dispose).toBeDefined();
    dispose!();
    expect(removeFn).toHaveBeenCalledWith(mockChannel, expect.any(Function));
  });
});
