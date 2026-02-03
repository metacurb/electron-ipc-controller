import { getControllerMetadata } from "../metadata/get-controller-metadata";
import { IpcControllerMetadata, IpcHandlerMetadata } from "../metadata/types";

import { serializeControllers } from "./serialize-controllers";

jest.mock("../metadata/get-controller-metadata");

const mockGetControllerMetadata = jest.mocked(getControllerMetadata);

describe("serializeControllers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return an empty contract when no controllers are provided", () => {
    const result = serializeControllers([]);
    expect(result).toEqual({ controllers: [] });
  });

  it("should serialize multiple controllers correctly", () => {
    class ControllerA {}
    class ControllerB {}

    const metadataA: IpcControllerMetadata = {
      handlers: new Map(
        Object.entries({
          methodA: {
            channel: "channel-a",
            handler: jest.fn(),
            methodName: "methodA",
            type: "on",
          },
        }),
      ),
      id: "id-a",
      namespace: "namespace-a",
      target: ControllerA,
    };

    const metadataB: IpcControllerMetadata = {
      handlers: new Map(
        Object.entries({
          methodB: {
            channel: "channel-b",
            handler: jest.fn(),
            methodName: "methodB",
            type: "handleOnce",
          },
        }),
      ),
      id: "id-b",
      namespace: "namespace-b",
      target: ControllerB,
    };

    mockGetControllerMetadata.mockImplementation((target) => {
      if (target === ControllerA) return metadataA;
      if (target === ControllerB) return metadataB;
      throw new Error("Unknown controller");
    });

    const result = serializeControllers([ControllerA, ControllerB]);

    expect(result).toEqual({
      controllers: [
        {
          handlers: [
            {
              channel: "channel-a",
              methodName: "methodA",
              type: "on",
            },
          ],
          id: "id-a",
          namespace: "namespace-a",
        },
        {
          handlers: [
            {
              channel: "channel-b",
              methodName: "methodB",
              type: "handleOnce",
            },
          ],
          id: "id-b",
          namespace: "namespace-b",
        },
      ],
    });
  });

  it("should handle controllers with no handlers", () => {
    class EmptyController {}

    const metadata: IpcControllerMetadata = {
      handlers: new Map(),
      id: "empty-id",
      namespace: "empty-namespace",
      target: EmptyController,
    };

    mockGetControllerMetadata.mockReturnValue(metadata);

    const result = serializeControllers([EmptyController]);

    expect(result).toEqual({
      controllers: [
        {
          handlers: [],
          id: "empty-id",
          namespace: "empty-namespace",
        },
      ],
    });
  });
});
