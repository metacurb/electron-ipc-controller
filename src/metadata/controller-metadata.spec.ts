import { randomUUID, UUID } from "node:crypto";

import { deriveNamespace } from "../utils/derive-namespace";

import {
  createControllerMetadata,
  generateMeta,
  getControllerMetadata,
} from "./controller-metadata";

jest.mock("node:crypto");
jest.mock("../utils/derive-namespace");

const testUuid = "test-uuid";
const testDerivedNamespace = "test-derived-namespace";

describe("Controller Metadata Utils", () => {
  const mockRandomUUID = jest.mocked(randomUUID);
  const mockDeriveNamespace = jest.mocked(deriveNamespace);

  beforeEach(() => {
    jest.clearAllMocks();
    mockRandomUUID.mockReturnValue(testUuid as UUID);
    mockDeriveNamespace.mockReturnValue(testDerivedNamespace);
  });

  describe("generateMeta", () => {
    class TestController {}

    it("should generate metadata with defaults", () => {
      const meta = generateMeta(TestController);

      expect(meta).toEqual({
        handlers: expect.any(Map),
        id: testUuid,
        namespace: testDerivedNamespace,
        target: TestController,
      });

      expect(mockDeriveNamespace).toHaveBeenCalledWith("TestController");
    });
  });

  describe("createControllerMetadata", () => {
    it("should create and define new metadata if none exists", () => {
      class TestController {}
      const meta = createControllerMetadata(TestController);

      expect(meta).toBeDefined();
      expect(meta.id).toBe(testUuid);
      expect(getControllerMetadata(TestController)).toBe(meta);
    });

    it("should return existing metadata if already defined", () => {
      class TestController {}
      const first = createControllerMetadata(TestController);
      const second = createControllerMetadata(TestController);
      expect(second).toEqual(first);
      expect(mockRandomUUID).toHaveBeenCalledTimes(1);
    });
  });

  describe("getControllerMetadata", () => {
    it("should return metadata for class with metadata", () => {
      class MetaController {}
      const created = createControllerMetadata(MetaController);
      expect(getControllerMetadata(MetaController)).toBe(created);
    });

    it("should throw for a class without metadata", () => {
      class NoMetaController {}
      expect(() => getControllerMetadata(NoMetaController)).toThrow(/no IPC metadata/);
    });
  });
});
