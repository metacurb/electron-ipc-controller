import path from "path";

import { findControllers } from "./find-controllers";
import { processCreateIpcAppCall } from "./process-create-ipc-app-call";

jest.mock("./process-create-ipc-app-call");

describe("findControllers", () => {
  const fixturesDir = path.resolve(__dirname, "fixtures/simple");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("finds controllers from entry file calling processCreateIpcAppCall", () => {
    const entryPath = path.join(fixturesDir, "index.ts");
    const { processedFiles } = findControllers(entryPath, path.join(fixturesDir, "tsconfig.json"));

    expect(processCreateIpcAppCall).toHaveBeenCalled();
    expect(processedFiles.size).toBeGreaterThan(0);
  });
});
