import { AsyncLocalStorage } from "node:async_hooks";

export const correlationStore = new AsyncLocalStorage<string>();
