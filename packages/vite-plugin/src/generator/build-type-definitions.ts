import type { ControllerMetadata } from "../parser/types.js";

export const buildTypeDefinitions = (controllers: ControllerMetadata[]): string => {
  const referencedTypes = new Map<string, string>();

  const collectTypes = (types: (typeof controllers)[0]["referencedTypes"]) => {
    types.forEach((t) => {
      if (t.definition && !referencedTypes.has(t.name)) {
        referencedTypes.set(t.name, t.definition);
        collectTypes(t.referencedTypes);
      }
    });
  };

  controllers.forEach((c) => collectTypes(c.referencedTypes));

  return Array.from(referencedTypes.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([, def]) => `export ${def}`)
    .join("\n\n");
};
