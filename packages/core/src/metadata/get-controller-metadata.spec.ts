import { IPC_CONTROLLER_METADATA } from "./constants";
import { getControllerMetadata } from "./get-controller-metadata";

describe("getControllerMetadata", () => {
  it("should return metadata for class with metadata", () => {
    class MetaController {}

    const meta = { foo: "bar" };

    Reflect.defineMetadata(IPC_CONTROLLER_METADATA, meta, MetaController);
    expect(getControllerMetadata(MetaController)).toBe(meta);
  });

  it("should throw for a class without metadata", () => {
    class NoMetaController {}
    expect(() => getControllerMetadata(NoMetaController)).toThrow(/no IPC metadata/);
  });
});
