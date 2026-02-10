import type { ControllerMetadata, TypeDefinition } from "../parser/types.js";

import { buildTypeDefinitions } from "./build-type-definitions.js";

describe("buildTypeDefinitions", () => {
  const makeController = (referencedTypes: TypeDefinition[] = []): ControllerMetadata => {
    return {
      className: "ExampleController",
      filePath: "/controllers/example.ts",
      methods: [],
      namespace: "example",
      referencedTypes,
    };
  };

  it("returns empty string when there are no referenced types", () => {
    const output = buildTypeDefinitions([makeController([])]);
    expect(output).toBe("");
  });

  it("emits exported type definitions sorted by name and deduplicated", () => {
    const tA = {
      definition: "type A = { a: string }",
      name: "A",
      referencedTypes: [],
    };
    const tB = {
      definition: "interface B { b: number }",
      name: "B",
      referencedTypes: [],
    };
    const tDuplicateA = {
      definition: "type A = { a: string }",
      name: "A",
      referencedTypes: [],
    };

    const controller = makeController([tB, tA, tDuplicateA]);

    const output = buildTypeDefinitions([controller]);

    expect(output).toBe(["export type A = { a: string }", "export interface B { b: number }"].join("\n\n"));
  });
});
