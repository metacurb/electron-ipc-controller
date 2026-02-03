import { IPC_PARAM_INJECTIONS } from "../../metadata/constants";
import { ParameterInjection } from "../../metadata/types";

import { Window } from "./window";

describe("Window decorator", () => {
  test("should use Window injection type", () => {
    class TestClass {
      testMethod(@Window() win: unknown) {
        return win;
      }
    }

    const injections: ParameterInjection[] = Reflect.getOwnMetadata(
      IPC_PARAM_INJECTIONS,
      TestClass.prototype,
      "testMethod",
    );

    expect(injections[0].type).toBe("Window");
  });
});
