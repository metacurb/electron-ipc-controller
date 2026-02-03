import { BrowserWindow } from "electron";

import { assembleIpc } from "./assemble-ipc";
import { createIpcApp } from "./create-ipc-app";
import { emitIpcContract } from "./emit-ipc-contract";
import { ControllerResolver } from "./types";

jest.mock("./assemble-ipc");
jest.mock("./emit-ipc-contract");

const mockAssembleIpc = jest.mocked(assembleIpc);
const mockEmitIpcContract = jest.mocked(emitIpcContract);

const mockResolver: ControllerResolver = {
  resolve: (Controller) => new Controller(),
};

const controllers = [class A {}, class B {}];

describe("createIpcApp", () => {
  const mockWindow = {} as BrowserWindow;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should call assembleIpc with correct args, and emit IPC contract", () => {
    const mockDisposer = jest.fn();
    mockAssembleIpc.mockReturnValue([mockDisposer]);

    createIpcApp({
      controllers,
      correlation: false,
      resolver: mockResolver,
      window: mockWindow,
    });

    expect(mockAssembleIpc).toHaveBeenCalledWith(controllers, {
      correlation: false,
      resolver: mockResolver,
    });
    expect(mockEmitIpcContract).toHaveBeenCalledWith(controllers, mockWindow);
  });

  test("should return an object with a dispose method that calls all disposers", () => {
    const disposer1 = jest.fn();
    const disposer2 = jest.fn();
    mockAssembleIpc.mockReturnValue([disposer1, disposer2]);

    const app = createIpcApp({
      controllers,
      resolver: mockResolver,
      window: mockWindow,
    });

    app.dispose();

    expect(disposer1).toHaveBeenCalled();
    expect(disposer2).toHaveBeenCalled();
  });
});
