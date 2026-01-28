import { correlationStore } from "./correlation-store";
import { getCorrelationId } from "./get-correlation-id";

describe("getCorrelationId", () => {
  test("should return undefined when no correlation context is active", () => {
    expect(getCorrelationId()).toBeUndefined();
  });

  test("should return the correlation ID when inside a correlation context", () => {
    const id = "test-id";
    correlationStore.run(id, () => {
      expect(getCorrelationId()).toBe(id);
    });
  });
});
