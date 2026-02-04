import { randomUUID, UUID } from "node:crypto";

import { deriveNamespace } from "../utils/derive-namespace";

import { generateMetadata } from "./generate-metadata";

jest.mock("node:crypto");
jest.mock("../utils/derive-namespace");

const testUuid = "test-uuid";
const testDerivedNamespace = "test-derived-namespace";

describe("generateMetadata", () => {
  const mockRandomUUID = jest.mocked(randomUUID);
  const mockDeriveNamespace = jest.mocked(deriveNamespace);

  beforeEach(() => {
    jest.clearAllMocks();
    mockRandomUUID.mockReturnValue(testUuid as UUID);
    mockDeriveNamespace.mockReturnValue(testDerivedNamespace);
  });
  class TestController {}

  it("should generate metadata with defaults", () => {
    const meta = generateMetadata(TestController);

    expect(meta).toEqual({
      handlers: expect.any(Map),
      id: testUuid,
      namespace: testDerivedNamespace,
      target: TestController,
    });

    expect(mockDeriveNamespace).toHaveBeenCalledWith("TestController");
  });
});
