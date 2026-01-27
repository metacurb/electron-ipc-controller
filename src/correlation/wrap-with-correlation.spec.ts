import { correlationStore } from "./correlation-store";
import { wrapWithCorrelation } from "./wrap-with-correlation";

describe("wrapWithCorrelation", () => {
  test("should run handler in correlation context when enabled", async () => {
    const handler = jest.fn().mockImplementation(() => correlationStore.getStore());

    const wrapped = wrapWithCorrelation(handler, true);
    const result = await wrapped();

    expect(result).toBeDefined();
    expect(typeof result).toBe("string");
    expect(handler).toHaveBeenCalled();
  });

  test("should not run handler in correlation context when disabled", () => {
    const handler = jest.fn();
    const wrapped = wrapWithCorrelation(handler, false);

    expect(wrapped).toBe(handler);
  });
});
