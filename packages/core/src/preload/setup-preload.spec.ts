import { ipcRenderer, IpcRendererEvent } from "electron";

import { IPC_CONTRACT_CHANNEL } from "../core/constants";
import { SerializedIpcContract } from "../core/types";

import { setupPreload } from "./setup-preload";

const mockIpcRender = jest.mocked(ipcRenderer);

describe("setupPreload", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should resolve with api when contract is received", async () => {
    const contract: SerializedIpcContract = { controllers: [] };

    mockIpcRender.once.mockImplementation((channel, listener) => {
      if (channel === IPC_CONTRACT_CHANNEL) {
        listener({} as IpcRendererEvent, contract);
      }

      return mockIpcRender;
    });

    const api = await setupPreload();

    expect(mockIpcRender.once).toHaveBeenCalledWith(IPC_CONTRACT_CHANNEL, expect.any(Function));
    expect(api).toEqual({});
  });
});
