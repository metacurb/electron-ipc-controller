import { ipcRenderer } from "electron";

import { SerializedIpcContract } from "../core/types";

import { createPreloadApi } from "./create-preload-api";
import { HandleMethod, SendMethod } from "./types";

const mockIpcRenderer = jest.mocked(ipcRenderer);

describe("createPreloadApi", () => {
  const contract: SerializedIpcContract = {
    controllers: [
      {
        handlers: [
          { channel: "test.handle", methodName: "handleMethod", type: "handle" },
          { channel: "test.on", methodName: "onMethod", type: "on" },
        ],
        id: "test",
        namespace: "test",
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should generate api structure from contract", () => {
    const api = createPreloadApi(contract);

    expect(api).toHaveProperty("test");
    expect(api.test).toHaveProperty("handleMethod");
    expect(api.test).toHaveProperty("onMethod");
  });

  it("should create handle method that calls ipcRenderer.invoke", async () => {
    const api = createPreloadApi(contract);
    const handleMethod = api.test.handleMethod as HandleMethod;

    mockIpcRenderer.invoke.mockResolvedValue("result");

    const result = await handleMethod("arg1", "arg2");

    expect(mockIpcRenderer.invoke).toHaveBeenCalledWith("test.handle", "arg1", "arg2");
    expect(result).toBe("result");
  });

  it("should create send method that calls ipcRenderer.send", () => {
    const api = createPreloadApi(contract);
    const onMethod = api.test.onMethod as SendMethod;

    onMethod("arg1", "arg2");

    expect(ipcRenderer.send).toHaveBeenCalledWith("test.on", "arg1", "arg2");
  });
});
