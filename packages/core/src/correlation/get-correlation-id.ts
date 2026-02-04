import { correlationStore } from "./correlation-store";

export const getCorrelationId = () => correlationStore.getStore();
