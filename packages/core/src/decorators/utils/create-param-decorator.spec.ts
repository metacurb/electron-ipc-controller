import { IPC_PARAM_INJECTIONS } from "../../metadata/constants";
import { ParameterInjection } from "../../metadata/types";

import { createParamDecorator } from "./create-param-decorator";

describe("createParamDecorator", () => {
  const mockResolver = jest.fn();
  const TestDecorator = createParamDecorator(mockResolver);

  test("should store parameter index and resolver in metadata", () => {
    class TestClass {
      testMethod(@TestDecorator("some-data") param: unknown) {
        return param;
      }
    }

    const injections: ParameterInjection[] = Reflect.getOwnMetadata(
      IPC_PARAM_INJECTIONS,
      TestClass.prototype,
      "testMethod",
    );

    expect(injections).toHaveLength(1);
    expect(injections[0]).toEqual({
      data: "some-data",
      index: 0,
      resolver: mockResolver,
    });
  });

  test("should work with decorator at any position", () => {
    class TestClass {
      method(a: string, @TestDecorator() b: unknown, c: number) {
        return { a, b, c };
      }
    }

    const injections: ParameterInjection[] = Reflect.getOwnMetadata(
      IPC_PARAM_INJECTIONS,
      TestClass.prototype,
      "method",
    );

    expect(injections[0].index).toBe(1);
  });

  test("should allow multiple decorators on the same method", () => {
    class TestClass {
      testMethod(@TestDecorator() a: unknown, @TestDecorator() b: unknown) {
        return { a, b };
      }
    }

    const injections: ParameterInjection[] = Reflect.getOwnMetadata(
      IPC_PARAM_INJECTIONS,
      TestClass.prototype,
      "testMethod",
    );

    expect(injections).toHaveLength(2);
  });
});
