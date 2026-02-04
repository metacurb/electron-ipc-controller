import { toCamelCase } from "./to-camel-case";

export const deriveNamespace = (name: string): string => toCamelCase(name.replace(/Controller$/, ""));
