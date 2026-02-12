import { IPC_CONTRACT_CHANNEL } from "@electron-ipc-bridge/shared";
import { ipcMain, IpcMainInvokeEvent } from "electron";

import { registerContractHandler } from "./register-contract-handler";
import { serializeControllers } from "./serialize-controllers";

jest.mock("./serialize-controllers");

const mockSerializeControllers = jest.mocked(serializeControllers);
const mockIpcMain = jest.mocked(ipcMain);

describe("registerContractHandler", () => {
  const controllers = [class A {}];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should register a handler for the contract channel", () => {
    registerContractHandler(controllers);

    expect(mockIpcMain.handle).toHaveBeenCalledWith(IPC_CONTRACT_CHANNEL, expect.any(Function));
  });

  it("should return a disposer that removes the handler", () => {
    const disposer = registerContractHandler(controllers);

    disposer();

    expect(mockIpcMain.removeHandler).toHaveBeenCalledWith(IPC_CONTRACT_CHANNEL);
  });

  it("should return serialized controllers when the handler is called", () => {
    const mockSerialized = { controllers: [] };
    mockSerializeControllers.mockReturnValue(mockSerialized);

    registerContractHandler(controllers);

    const handler = mockIpcMain.handle.mock.calls[0][1];
    const result = handler({} as IpcMainInvokeEvent, {});

    expect(mockSerializeControllers).toHaveBeenCalledWith(controllers);
    expect(result).toBe(mockSerialized);
  });
});
