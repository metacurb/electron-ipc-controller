import { hashControllerMetadata } from "./hash-metadata.js";
import { ControllerMetadata } from "./parser/types.js";

describe("hashControllerMetadata", () => {
  const baseController: ControllerMetadata = {
    className: "TestController",
    filePath: "/absolute/path/to/file.ts", // Should be ignored
    methods: [
      {
        decoratorName: "IpcHandle",
        name: "testMethod",
        params: [],
        referencedTypes: [],
        returnType: "string",
      },
    ],
    namespace: "test",
    referencedTypes: [],
  };

  it("produces consistent hash for identical metadata", () => {
    const hash1 = hashControllerMetadata([baseController]);
    const hash2 = hashControllerMetadata([baseController]);
    expect(hash1).toBe(hash2);
  });

  it("produces different hash when structural data changes", () => {
    const changed = { ...baseController, namespace: "changed" };
    const hash1 = hashControllerMetadata([baseController]);
    const hash2 = hashControllerMetadata([changed]);
    expect(hash1).not.toBe(hash2);
  });

  it("ignores volatile fields like filePath", () => {
    const metadataA = { ...baseController, filePath: "/a.ts" };
    const metadataB = { ...baseController, filePath: "/b.ts" };

    const hashA = hashControllerMetadata([metadataA]);
    const hashB = hashControllerMetadata([metadataB]);

    expect(hashA).toBe(hashB);
  });

  it("detects changes in method signatures", () => {
    const changedMethod = { ...baseController.methods[0], returnType: "number" };
    const changed = { ...baseController, methods: [changedMethod] };

    const hash1 = hashControllerMetadata([baseController]);
    const hash2 = hashControllerMetadata([changed]);

    expect(hash1).not.toBe(hash2);
  });
});
