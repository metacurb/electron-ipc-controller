import { IpcHandlerType } from "@electron-ipc-bridge/shared";
import { ipcMain, IpcMainInvokeEvent } from "electron";

import { wrapWithCorrelation } from "../correlation/wrap-with-correlation";
import { IpcHandlerMetadata } from "../metadata/types";
import { createChannelName } from "../utils/create-channel-name";

import { registerHandler } from "./register-handler";

jest.mock("../correlation/wrap-with-correlation");
jest.mock("../utils/create-channel-name");

const mockCreateChannelName = jest.mocked(createChannelName);
const mockWrapWithCorrelation = jest.mocked(wrapWithCorrelation);

const mockChannel = "mock_channel";

const rawEventResolver = (event: IpcMainInvokeEvent, _data: unknown) => event;

const mockIpcMain = jest.mocked(ipcMain);

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
    expect(mockWrapWithCorrelation).toHaveBeenCalledWith(expect.any(Function), false);
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
    expect(mockWrapWithCorrelation).toHaveBeenCalledWith(expect.any(Function), false);
    expect(dispose).toBeDefined();
    dispose!();
    expect(removeFn).toHaveBeenCalledWith(mockChannel, expect.any(Function));
  });

  describe("parameter injection", () => {
    test("should inject event at index 0", () => {
      const handler: IpcHandlerMetadata = {
        ...createHandler("handle"),
        paramInjections: [{ index: 0, resolver: rawEventResolver }],
      };

      registerHandler(handler, mockInstance, { correlation: false });

      const registeredHandler = mockIpcMain.handle.mock.calls[0][1];
      const mockEvent = { sender: { id: 123 } } as IpcMainInvokeEvent;
      registeredHandler(mockEvent, "payload1", "payload2");

      expect(mockInstance.testMethod).toHaveBeenCalledWith(mockEvent, "payload1", "payload2");
    });

    test("should inject event at index 1", () => {
      const handler: IpcHandlerMetadata = {
        ...createHandler("handle"),
        paramInjections: [{ index: 1, resolver: rawEventResolver }],
      };

      registerHandler(handler, mockInstance, { correlation: false });

      const registeredHandler = mockIpcMain.handle.mock.calls[0][1];
      const mockEvent = { sender: { id: 123 } } as IpcMainInvokeEvent;

      registeredHandler(mockEvent, "payload1", "payload2");

      expect(mockInstance.testMethod).toHaveBeenCalledWith("payload1", mockEvent, "payload2");
    });

    test("should inject event at index 2 (last)", () => {
      const handler: IpcHandlerMetadata = {
        ...createHandler("handle"),
        paramInjections: [{ index: 2, resolver: rawEventResolver }],
      };

      registerHandler(handler, mockInstance, { correlation: false });

      const registeredHandler = mockIpcMain.handle.mock.calls[0][1];
      const mockEvent = { sender: { id: 123 } } as IpcMainInvokeEvent;
      registeredHandler(mockEvent, "payload1", "payload2");

      expect(mockInstance.testMethod).toHaveBeenCalledWith("payload1", "payload2", mockEvent);
    });

    test("should strip event when no injections are present", () => {
      const handler: IpcHandlerMetadata = {
        ...createHandler("handle"),
        paramInjections: [],
      };

      registerHandler(handler, mockInstance, { correlation: false });

      const registeredHandler = mockIpcMain.handle.mock.calls[0][1];
      const mockEvent = { sender: { id: 123 } } as IpcMainInvokeEvent;
      registeredHandler(mockEvent, "payload1", "payload2");

      expect(mockInstance.testMethod).toHaveBeenCalledWith("payload1", "payload2");
      expect(mockInstance.testMethod).not.toHaveBeenCalledWith(
        expect.objectContaining({ sender: expect.anything() }),
        expect.anything(),
        expect.anything(),
      );
    });

    test("should work with correlation and event injection", () => {
      const handler: IpcHandlerMetadata = {
        ...createHandler("handle"),
        paramInjections: [{ index: 1, resolver: rawEventResolver }],
      };

      registerHandler(handler, mockInstance, { correlation: true });

      const registeredHandler = mockIpcMain.handle.mock.calls[0][1];
      const mockEvent = { sender: { id: 123 } } as IpcMainInvokeEvent;
      registeredHandler(mockEvent, "payload");

      expect(mockWrapWithCorrelation).toHaveBeenCalledWith(expect.any(Function), true);
      expect(mockInstance.testMethod).toHaveBeenCalledWith("payload", mockEvent);
    });
  });
});
