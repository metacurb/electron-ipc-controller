import path from "path";

import { generateGlobalTypes } from "../generator/generate-global-types";
import { generateRuntimeTypes } from "../generator/generate-runtime-types";

import { findControllers } from "./find-controllers";

const fixturesDir = path.resolve(__dirname, "fixtures");

describe("pipeline e2e", () => {
  it("simple fixture generates expected types", () => {
    const entryPath = path.join(fixturesDir, "simple", "index.ts");
    const tsconfigPath = path.join(fixturesDir, "simple", "tsconfig.json");
    const { controllers } = findControllers(entryPath, tsconfigPath);

    const runtime = generateRuntimeTypes(controllers);
    const global = generateGlobalTypes("ipc", "./ipc.types");

    expect(runtime).toMatchSnapshot("runtime");
    expect(global).toMatchSnapshot("global");
  });

  it("complex-types fixture generates expected types", () => {
    const entryPath = path.join(fixturesDir, "complex-types", "index.ts");
    const tsconfigPath = path.join(fixturesDir, "complex-types", "tsconfig.json");
    const { controllers } = findControllers(entryPath, tsconfigPath);

    const runtime = generateRuntimeTypes(controllers);
    const global = generateGlobalTypes("ipc", "./ipc.types");

    expect(runtime).toMatchSnapshot("runtime");
    expect(global).toMatchSnapshot("global");
  });

  it("nest-module fixture generates expected types", () => {
    const entryPath = path.join(fixturesDir, "nest-module", "index.ts");
    const tsconfigPath = path.join(fixturesDir, "nest-module", "tsconfig.json");
    const { controllers } = findControllers(entryPath, tsconfigPath);

    const runtime = generateRuntimeTypes(controllers);
    const global = generateGlobalTypes("ipc", "./ipc.types");

    expect(runtime).toMatchSnapshot("runtime");
    expect(global).toMatchSnapshot("global");
  });
});
