import { IPC_CONTRACT_CHANNEL, IPC_DEFAULT_API_ROOT, SerializedIpcContract } from "@electron-ipc-bridge/shared";
import { contextBridge, ipcRenderer } from "electron";

import { setupPreload } from "./setup-preload";

const mockIpcRenderer = jest.mocked(ipcRenderer);
const mockContextBridge = jest.mocked(contextBridge);

describe("setupPreload", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should resolve with api when contract is received", async () => {
    const contract: SerializedIpcContract = { controllers: [] };

    mockIpcRenderer.invoke.mockResolvedValue(contract);

    const api = await setupPreload();

    expect(mockIpcRenderer.invoke).toHaveBeenCalledWith(IPC_CONTRACT_CHANNEL);
    expect(api).toEqual({});
  });

  it("should expose api via contextBridge with default key", async () => {
    const contract: SerializedIpcContract = { controllers: [] };
    mockIpcRenderer.invoke.mockResolvedValue(contract);

    await setupPreload();

    expect(mockContextBridge.exposeInMainWorld).toHaveBeenCalledWith(IPC_DEFAULT_API_ROOT, {});
  });

  it("should expose api via contextBridge with custom key", async () => {
    const contract: SerializedIpcContract = { controllers: [] };
    mockIpcRenderer.invoke.mockResolvedValue(contract);

    await setupPreload({ namespace: "myCustomApi" });

    expect(mockContextBridge.exposeInMainWorld).toHaveBeenCalledWith("myCustomApi", {});
  });
});
