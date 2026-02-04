import { toSnakeCase } from "./to-snake-case";

export const createChannelName = (namespace: string, method: string): string =>
  [namespace, method].map(toSnakeCase).join(".");
