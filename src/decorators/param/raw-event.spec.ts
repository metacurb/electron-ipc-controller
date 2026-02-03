import { IPC_PARAM_INJECTIONS } from "../../metadata/constants";
import { ParameterInjection } from "../../metadata/types";

import { RawEvent } from "./raw-event";

describe("RawEvent decorator", () => {
  test("should use RawEvent injection type", () => {
    class TestClass {
      testMethod(@RawEvent() event: unknown) {
        return event;
      }
    }

    const injections: ParameterInjection[] = Reflect.getOwnMetadata(
      IPC_PARAM_INJECTIONS,
      TestClass.prototype,
      "testMethod",
    );

    expect(injections[0].type).toBe("RawEvent");
  });
});
