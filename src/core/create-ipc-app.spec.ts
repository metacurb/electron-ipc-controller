import { BrowserWindow } from "electron";

import { registerHandlers } from "../metadata/register-handlers";

import { createIpcApp } from "./create-ipc-app";

jest.mock("../metadata/register-handlers");

const mockRegisterHandlers = jest.mocked(registerHandlers);

describe("createIpcApp", () => {
  const mockWindow = {} as BrowserWindow;
  const mockEmitMetadata = jest.fn();
  const mockDisposer = jest.fn();
  const mockControllersMeta = new Map();

  beforeEach(() => {
    jest.clearAllMocks();
    mockRegisterHandlers.mockReturnValue({
      controllersMeta: mockControllersMeta,
      disposers: [mockDisposer],
      emitMetadata: mockEmitMetadata,
    });
  });

  test("should call registerHandlers with controllers and correlation", () => {
    const controllers = [class A {}, class B {}];
    createIpcApp({
      controllers,
      correlation: false,
      window: mockWindow,
    });

    expect(mockRegisterHandlers).toHaveBeenCalledWith(controllers, false);
  });

  test("should use default correlation value of true", () => {
    createIpcApp({
      controllers: [],
      window: mockWindow,
    });

    expect(mockRegisterHandlers).toHaveBeenCalledWith([], true);
  });

  test("should call emitMetadata with controllersMeta and window", () => {
    createIpcApp({
      controllers: [],
      window: mockWindow,
    });

    expect(mockEmitMetadata).toHaveBeenCalledWith(mockControllersMeta, mockWindow);
  });

  test("should return an object with a dispose method that calls all disposers", () => {
    const disposer1 = jest.fn();
    const disposer2 = jest.fn();
    mockRegisterHandlers.mockReturnValue({
      controllersMeta: mockControllersMeta,
      disposers: [disposer1, disposer2],
      emitMetadata: mockEmitMetadata,
    });

    const app = createIpcApp({
      controllers: [],
      window: mockWindow,
    });

    app.dispose();

    expect(disposer1).toHaveBeenCalled();
    expect(disposer2).toHaveBeenCalled();
  });
});
