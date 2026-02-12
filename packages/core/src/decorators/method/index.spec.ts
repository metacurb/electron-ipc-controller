import { IPC_METHOD_DECORATOR_NAMES } from "@electron-ipc-bridge/shared";

import { IPC_METHOD_DECORATORS } from "./index";

describe("IPC method decorators sync with shared", () => {
  it("exports exactly the method decorator names defined in shared", () => {
    const coreKeys = Object.keys(IPC_METHOD_DECORATORS).sort();
    const sharedNames = [...IPC_METHOD_DECORATOR_NAMES].sort();
    expect(coreKeys).toEqual(sharedNames);
  });
});
