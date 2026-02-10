import type { ControllerMetadata, MethodMetadata } from "../parser/types.js";

import { buildNamespaces } from "./build-namespaces.js";
import { getReturnType } from "./get-return-type.js";

jest.mock("./get-return-type");

const mockGetReturnType = jest.mocked(getReturnType);

describe("buildNamespaces", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const makeController = (overrides: Partial<ControllerMetadata> = {}): ControllerMetadata => {
    return {
      className: "ExampleController",
      filePath: "/controllers/example.ts",
      methods: [],
      namespace: "example",
      referencedTypes: [],
      ...overrides,
    };
  };

  it("returns an empty array when there are no controllers", () => {
    const namespaces = buildNamespaces([]);
    expect(namespaces).toEqual([]);
  });

  it("builds namespace blocks with methods and inferred return types", () => {
    mockGetReturnType.mockReturnValue("Promise<string>");

    const methods: MethodMetadata[] = [
      {
        decoratorName: "IpcHandle",
        isAsync: false,
        name: "bar",
        params: [
          { name: "id", optional: false, type: "string" },
          { name: "count", optional: true, type: "number" },
        ],
        referencedTypes: [],
        returnType: "Promise<string>",
      },
    ];

    const controller = makeController({
      methods,
      namespace: "foo",
    });

    const namespaces = buildNamespaces([controller]);

    expect(mockGetReturnType).toHaveBeenCalledWith("IpcHandle", "Promise<string>");
    expect(namespaces).toMatchInlineSnapshot(`
      [
        "    foo: {
            bar(id: string, count?: number): Promise<string>;
          };",
      ]
    `);
  });
});
