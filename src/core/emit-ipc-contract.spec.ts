import { BrowserWindow } from "electron";

import { IpcControllerMetadata } from "../metadata/types";

import { IPC_CONTRACT_CHANNEL } from "./constants";
import { emitIpcContract } from "./emit-ipc-contract";
import { serializeControllers } from "./serialize-controllers";

jest.mock("./serialize-controllers");

const mockSerializeControllers = jest.mocked(serializeControllers);

const controllers = [class A {}, class B {}];
const serializedControllers = { controllers: [] };

describe("emitIpcContract", () => {
  let mockWindow: jest.Mocked<BrowserWindow>;
  let mockWebContents: jest.Mocked<Electron.WebContents>;

  beforeEach(() => {
    mockWebContents = {
      isLoading: jest.fn(),
      once: jest.fn(),
      send: jest.fn(),
    } as unknown as jest.Mocked<Electron.WebContents>;

    mockWindow = {
      webContents: mockWebContents,
    } as unknown as jest.Mocked<BrowserWindow>;

    jest.clearAllMocks();

    mockSerializeControllers.mockReturnValue(serializedControllers);
  });

  it("should do nothing if targetWindow is undefined", () => {
    emitIpcContract(controllers);
    expect(mockWebContents.send).not.toHaveBeenCalled();
  });

  it("should send metadata immediately if webContents is not loading", () => {
    mockWebContents.isLoading.mockReturnValue(false);

    emitIpcContract(controllers, mockWindow);

    expect(mockWebContents.send).toHaveBeenCalledWith(IPC_CONTRACT_CHANNEL, serializedControllers);
    expect(mockWebContents.once).not.toHaveBeenCalled();
  });

  it("should wait for did-finish-load if webContents is loading", () => {
    mockWebContents.isLoading.mockReturnValue(true);

    emitIpcContract(controllers, mockWindow);

    expect(mockWebContents.send).not.toHaveBeenCalled();
    expect(mockWebContents.once).toHaveBeenCalledWith("did-finish-load", expect.any(Function));

    const callback = mockWebContents.once.mock.calls[0][1];
    // @ts-expect-error we don't care about the type here, we're just testing the callback
    callback();

    expect(mockWebContents.send).toHaveBeenCalledWith(IPC_CONTRACT_CHANNEL, serializedControllers);
  });
});
