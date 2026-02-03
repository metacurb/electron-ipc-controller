import { IPC_PARAM_INJECTIONS } from "../../metadata/constants";
import { ParameterInjection } from "../../metadata/types";

import { Sender } from "./sender";

describe("Sender decorator", () => {
  test("should use Sender injection type", () => {
    class TestClass {
      testMethod(@Sender() sender: unknown) {
        return sender;
      }
    }

    const injections: ParameterInjection[] = Reflect.getOwnMetadata(
      IPC_PARAM_INJECTIONS,
      TestClass.prototype,
      "testMethod",
    );

    expect(injections[0].type).toBe("Sender");
  });
});
