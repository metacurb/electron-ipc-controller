import { IPC_CONTROLLER_METADATA } from "./constants";
import { generateMetadata } from "./generate-metadata";
import { getControllerMetadata } from "./get-controller-metadata";
import { setControllerMetadata } from "./set-controller-metadata";
import { IpcControllerMetadata } from "./types";

jest.mock("./generate-metadata");

const mockGenerateMeta = jest.mocked(generateMetadata);

const mockMeta: IpcControllerMetadata = {
  handlers: new Map(),
  id: "test-id",
  namespace: "test-namespace",
  target: class TestController {},
};

describe("Controller Metadata Utils", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockGenerateMeta.mockReturnValue(mockMeta);
  });

  describe("setControllerMetadata", () => {
    it("should create and define new metadata if none exists", () => {
      class TestController {}
      const meta = setControllerMetadata(TestController);

      const storedMeta = Reflect.getMetadata(IPC_CONTROLLER_METADATA, TestController);

      expect(meta).toEqual(mockMeta);
      expect(storedMeta).toEqual(meta);
    });

    it("should return existing metadata if already defined", () => {
      class TestController {}
      const first = setControllerMetadata(TestController);
      const second = setControllerMetadata(TestController);
      expect(second).toEqual(first);
      expect(mockGenerateMeta).toHaveBeenCalledTimes(1);
    });
  });
});
