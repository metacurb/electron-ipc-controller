import fs from "fs";
import os from "os";
import path from "path";

import { generateGlobalTypes } from "./generator/generate-global-types.js";
import { resolveApiRootFromPreload } from "./preload/resolve-api-root.js";

describe("preload namespace integration", () => {
  const writePreload = (contents: string): { preloadPath: string; cleanup: () => void } => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ipc-preload-namespace-"));
    const preloadPath = path.join(dir, "preload.ts");
    fs.writeFileSync(preloadPath, contents, "utf8");
    return {
      cleanup: () => fs.rmSync(dir, { force: true, recursive: true }),
      preloadPath,
    };
  };

  it("updates global window property name when setupPreload namespace changes", async () => {
    const first = writePreload(
      `import { setupPreload } from "@electron-ipc-bridge/core/preload";
setupPreload("custom");
`,
    );
    const second = writePreload(
      `import { setupPreload } from "@electron-ipc-bridge/core/preload";
setupPreload("renamed");
`,
    );

    try {
      const apiNamespace1 = (await resolveApiRootFromPreload(first.preloadPath)).namespace;
      const types1 = generateGlobalTypes(apiNamespace1, "../runtime/ipc.types");

      const apiNamespace2 = (await resolveApiRootFromPreload(second.preloadPath)).namespace;
      const types2 = generateGlobalTypes(apiNamespace2, "../runtime/ipc.types");

      expect(types1).toContain("custom:");
      expect(types2).toContain("renamed:");
      expect(types1).not.toBe(types2);
    } finally {
      first.cleanup();
      second.cleanup();
    }
  });

  it("resolves namespace from setupPreload({ namespace: 'custom' }) object API", async () => {
    const { cleanup, preloadPath } = writePreload(
      `import { setupPreload } from "@electron-ipc-bridge/core/preload";
setupPreload({ namespace: 'custom' }).catch(console.error);
`,
    );
    try {
      const namespace = (await resolveApiRootFromPreload(preloadPath)).namespace;
      const types = generateGlobalTypes(namespace, "../runtime/ipc.types");
      expect(namespace).toBe("custom");
      expect(types).toContain("custom:");
    } finally {
      cleanup();
    }
  });
});
