import { toSnakeCase } from "./to-snake-case";

export const buildChannel = (namespace: string, method: string): string => `${namespace}:${method}`;

export const deriveNamespaceFromClassName = (name: string): string =>
  toSnakeCase(name.replace(/Controller$/, ""));
