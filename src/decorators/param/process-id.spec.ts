import { IPC_PARAM_INJECTIONS } from "../../metadata/constants";
import { ParameterInjection } from "../../metadata/types";

import { ProcessId } from "./process-id";

describe("ProcessId decorator", () => {
  test("should use ProcessId injection type", () => {
    class TestClass {
      testMethod(@ProcessId() pid: unknown) {
        return pid;
      }
    }

    const injections: ParameterInjection[] = Reflect.getOwnMetadata(
      IPC_PARAM_INJECTIONS,
      TestClass.prototype,
      "testMethod",
    );

    expect(injections[0].type).toBe("ProcessId");
  });
});
