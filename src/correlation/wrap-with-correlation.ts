import { randomUUID } from "crypto";

import { correlationStore } from "./correlation-store";

export const wrapWithCorrelation = <TArgs extends unknown[], TReturn>(
  handler: (...args: TArgs) => TReturn | Promise<TReturn>,
  enabled: boolean = false,
) => {
  if (!enabled) return handler;

  return async function (this: unknown, ...args: TArgs) {
    const existing = correlationStore.getStore();

    if (existing) {
      return await handler.apply(this, args);
    }

    const correlationId = randomUUID();
    return correlationStore.run(correlationId, async () => await handler.apply(this, args));
  };
};
