import {
  IPC_DECORATOR_HANDLE,
  IPC_DECORATOR_HANDLE_ONCE,
  IPC_DECORATOR_ON,
  IPC_DECORATOR_ONCE,
} from "@electron-ipc-bridge/shared";

import * as CoreExports from "./index";

describe("Configuration Validation", () => {
  test("Core exports should match Shared constants", () => {
    expect(CoreExports[IPC_DECORATOR_ON]).toBeDefined();
    expect(CoreExports[IPC_DECORATOR_ONCE]).toBeDefined();
    expect(CoreExports[IPC_DECORATOR_HANDLE]).toBeDefined();
    expect(CoreExports[IPC_DECORATOR_HANDLE_ONCE]).toBeDefined();
  });
});
