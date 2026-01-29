import Container from "typedi";

import { registerHandler } from "../core/register-handler";

import { emitMetadata } from "./emit-metadata";
import { getControllerMetadata } from "./get-controller-metadata";
import { registerHandlers } from "./register-handlers";
import { IpcControllerMetadata, IpcHandlerMetadata } from "./types";

jest.mock("./get-controller-metadata");
jest.mock("../core/register-handler");
jest.mock("./emit-metadata");

const mockGetControllerMetadata = jest.mocked(getControllerMetadata);
const mockRegisterHandler = jest.mocked(registerHandler);
const mockEmitMetadata = jest.mocked(emitMetadata);
const mockContainer = jest.mocked(Container);

const mockHandler: IpcHandlerMetadata = {
  handler: () => {},
  methodName: "testMethod",
  type: "on",
};

describe("registerHandlers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should register handlers for each controller", () => {
    class TestController {}

    const mockMeta: IpcControllerMetadata = {
      handlers: new Map([["testMethod", mockHandler]]),
      id: "test",
      namespace: "testNamespace",
      target: TestController,
    };
    const mockInstance = new TestController();
    const mockDisposer = jest.fn();

    mockGetControllerMetadata.mockReturnValue(mockMeta);
    mockContainer.get.mockReturnValue(mockInstance);
    mockRegisterHandler.mockReturnValue(mockDisposer);

    const result = registerHandlers([TestController], true);

    expect(mockGetControllerMetadata).toHaveBeenCalledWith(TestController);
    expect(Container.get).toHaveBeenCalledWith(TestController);
    expect(mockRegisterHandler).toHaveBeenCalledWith(mockHandler, mockInstance, {
      correlation: true,
      namespace: "testNamespace",
    });
    expect(result.disposers).toContain(mockDisposer);
    expect(result.controllersMeta.get("test")).toBe(mockMeta);
    expect(result.emitMetadata).toBe(mockEmitMetadata);
  });

  it("should handle multiple controllers and handlers", () => {
    class Controller1 {}
    class Controller2 {}

    const meta1: IpcControllerMetadata = {
      handlers: new Map([["m1", mockHandler]]),
      id: "c1",
      namespace: "ns1",
      target: Controller1,
    };
    const meta2: IpcControllerMetadata = {
      handlers: new Map([
        ["m2", mockHandler],
        ["m3", mockHandler],
      ]),
      id: "c2",
      namespace: "ns2",
      target: Controller2,
    };

    const inst1 = new Controller1();
    const inst2 = new Controller2();

    mockGetControllerMetadata.mockReturnValueOnce(meta1).mockReturnValueOnce(meta2);

    mockContainer.get.mockReturnValueOnce(inst1).mockReturnValueOnce(inst2);

    const disp1 = jest.fn();
    const disp2 = jest.fn();
    const disp3 = jest.fn();

    mockRegisterHandler
      .mockReturnValueOnce(disp1)
      .mockReturnValueOnce(disp2)
      .mockReturnValueOnce(disp3);

    const result = registerHandlers([Controller1, Controller2], false);

    expect(mockRegisterHandler).toHaveBeenCalledTimes(3);
    expect(result.disposers).toEqual([disp1, disp2, disp3]);
    expect(result.controllersMeta.size).toBe(2);
    expect(result.controllersMeta.get("c1")).toBe(meta1);
    expect(result.controllersMeta.get("c2")).toBe(meta2);
  });

  it("should not add undefined disposers", () => {
    class Controller1 {}
    const meta1: IpcControllerMetadata = {
      handlers: new Map([["m1", mockHandler]]),
      id: "c1",
      namespace: "ns1",
      target: Controller1,
    };

    mockGetControllerMetadata.mockReturnValue(meta1);
    mockContainer.get.mockReturnValue(new Controller1());
    mockRegisterHandler.mockReturnValue(undefined);

    const result = registerHandlers([Controller1], true);

    expect(result.disposers).toHaveLength(0);
  });
});
