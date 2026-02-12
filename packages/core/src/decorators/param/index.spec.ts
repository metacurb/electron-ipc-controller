import { IPC_PARAM_INJECTION_DECORATOR_NAMES } from "@electron-ipc-bridge/shared";

import { IPC_PARAM_DECORATORS } from "./index";

describe("IPC param decorators sync with shared", () => {
  it("exports exactly the param decorator names defined in shared", () => {
    const coreKeys = Object.keys(IPC_PARAM_DECORATORS).sort();
    const sharedNames = [...IPC_PARAM_INJECTION_DECORATOR_NAMES].sort();
    expect(coreKeys).toEqual(sharedNames);
  });
});
