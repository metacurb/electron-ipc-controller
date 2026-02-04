import { randomUUID } from "crypto";

import { correlationStore } from "./correlation-store";

export const wrapWithCorrelation = <TArgs extends unknown[], TReturn>(
  handler: (...args: TArgs) => TReturn,
  enabled: boolean = false,
) => {
  if (!enabled) return handler;

  return function (this: unknown, ...args: TArgs): TReturn {
    const existing = correlationStore.getStore();

    if (existing) {
      return handler.apply(this, args);
    }

    const correlationId = randomUUID();
    return correlationStore.run(correlationId, () => handler.apply(this, args));
  };
};
