import path from "path";

import { generateTypes } from "../generator/generate-types";

import { findControllers } from "./find-controllers";

const fixturesDir = path.resolve(__dirname, "fixtures");

describe("pipeline e2e", () => {
  it("simple fixture generates expected types", () => {
    const entryPath = path.join(fixturesDir, "simple", "index.ts");
    const tsconfigPath = path.join(fixturesDir, "simple", "tsconfig.json");
    const { controllers } = findControllers(entryPath, tsconfigPath);
    const generated = generateTypes(controllers);
    expect(generated).toMatchSnapshot();
  });

  it("complex-types fixture generates expected types", () => {
    const entryPath = path.join(fixturesDir, "complex-types", "index.ts");
    const tsconfigPath = path.join(fixturesDir, "complex-types", "tsconfig.json");
    const { controllers } = findControllers(entryPath, tsconfigPath);
    const generated = generateTypes(controllers);
    expect(generated).toMatchSnapshot();
  });

  it("nest-module fixture generates expected types", () => {
    const entryPath = path.join(fixturesDir, "nest-module", "index.ts");
    const tsconfigPath = path.join(fixturesDir, "nest-module", "tsconfig.json");
    const { controllers } = findControllers(entryPath, tsconfigPath);
    const generated = generateTypes(controllers);
    expect(generated).toMatchSnapshot();
  });
});
