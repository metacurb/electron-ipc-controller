import { IPC_DEFAULT_API_ROOT } from "@electron-ipc-bridge/shared";
import fs from "fs";
import os from "os";
import path from "path";

import { resolveApiRootFromPreload } from "./resolve-api-root";

const writeTempFile = (contents: string): { filePath: string; cleanup: () => void } => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ipc-preload-"));
  const filePath = path.join(dir, "index.ts");
  fs.writeFileSync(filePath, contents, "utf8");
  return {
    cleanup: () => fs.rmSync(dir, { force: true, recursive: true }),
    filePath,
  };
};

describe("resolveApiRootFromPreload", () => {
  it("returns the default when preload file is missing", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ipc-preload-missing-"));
    const missingPath = path.join(dir, "missing.ts");
    expect(resolveApiRootFromPreload(missingPath).namespace).toBe(IPC_DEFAULT_API_ROOT);
    fs.rmSync(dir, { force: true, recursive: true });
  });

  it("returns default when setupPreload() has no args", () => {
    const { cleanup, filePath } = writeTempFile(`import { setupPreload } from "@electron-ipc-bridge/core/preload";
setupPreload();
`);
    expect(resolveApiRootFromPreload(filePath).namespace).toBe(IPC_DEFAULT_API_ROOT);
    expect(resolveApiRootFromPreload(filePath).dependencies.has(filePath)).toBe(true);
    cleanup();
  });

  it("returns string literal when setupPreload('custom') is used", () => {
    const { cleanup, filePath } = writeTempFile(`import { setupPreload } from "@electron-ipc-bridge/core/preload";
setupPreload("custom");
`);
    expect(resolveApiRootFromPreload(filePath).namespace).toBe("custom");
    cleanup();
  });

  it("returns the default when setupPreload receives non-literal args", () => {
    const { cleanup, filePath } = writeTempFile(`import { setupPreload } from "@electron-ipc-bridge/core/preload";
const namespace = "custom";
setupPreload(namespace);
`);
    expect(resolveApiRootFromPreload(filePath).namespace).toBe(IPC_DEFAULT_API_ROOT);
    cleanup();
  });
});
