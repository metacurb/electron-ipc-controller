import { ControllerMetadata } from "../parser/types";

import { generateTypes } from "./generate-types";
import { getReturnType } from "./get-return-type";

jest.mock("./get-return-type");

const mockGetReturnType = jest.mocked(getReturnType);

describe("generateTypes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetReturnType.mockImplementation((d, t) => `TYPE<${d},${t}>`);
  });

  it("generates empty interface for no controllers", () => {
    const result = generateTypes([]);

    expect(result).toContain("export interface IpcApi {");
    expect(result).toContain("declare global {");
    expect(result).toContain("interface Window {");
    expect(result).toContain("ipc: IpcApi;");
  });

  it("generates namespace and method signatures using getReturnType", () => {
    const controllers: ControllerMetadata[] = [
      {
        className: "TestController",
        filePath: "/test.ts",
        methods: [
          {
            decoratorName: "IpcHandle",
            isAsync: false,
            name: "testMethod",
            params: [
              { name: "a", optional: false, type: "string" },
              { name: "b", optional: true, type: "number" },
            ],
            returnType: "boolean",
          },
        ],
        namespace: "test",
      },
    ];

    const result = generateTypes(controllers);

    expect(mockGetReturnType).toHaveBeenCalledWith("IpcHandle", "boolean");
    expect(result).toContain("test: {");
    expect(result).toContain("testMethod(a: string, b?: number): TYPE<IpcHandle,boolean>;");
  });

  it("generates multiple controllers and methods", () => {
    const controllers: ControllerMetadata[] = [
      {
        className: "FooController",
        filePath: "/foo.ts",
        methods: [{ decoratorName: "IpcHandle", isAsync: false, name: "bar", params: [], returnType: "void" }],
        namespace: "foo",
      },
      {
        className: "BazController",
        filePath: "/baz.ts",
        methods: [{ decoratorName: "IpcOn", isAsync: false, name: "qux", params: [], returnType: "string" }],
        namespace: "baz",
      },
    ];

    const result = generateTypes(controllers);

    expect(result).toContain("foo: {");
    expect(result).toContain("bar(): TYPE<IpcHandle,void>;");
    expect(result).toContain("baz: {");
    expect(result).toContain("qux(): TYPE<IpcOn,string>;");
  });
});
