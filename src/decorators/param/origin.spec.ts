import { IPC_PARAM_INJECTIONS } from "../../metadata/constants";
import { ParameterInjection } from "../../metadata/types";

import { Origin } from "./origin";

describe("Origin decorator", () => {
  test("should use Origin injection type", () => {
    class TestClass {
      testMethod(@Origin() origin: unknown) {
        return origin;
      }
    }

    const injections: ParameterInjection[] = Reflect.getOwnMetadata(
      IPC_PARAM_INJECTIONS,
      TestClass.prototype,
      "testMethod",
    );

    expect(injections[0].type).toBe("Origin");
  });
});
