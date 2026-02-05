import { getReturnType } from "./get-return-type";

describe("getReturnType", () => {
  it("returns void for IpcOn", () => {
    expect(getReturnType("IpcOn", "string")).toBe("void");
  });

  it("returns void for IpcOnce", () => {
    expect(getReturnType("IpcOnce", "number")).toBe("void");
  });

  it("wraps return type in Promise", () => {
    expect(getReturnType("IpcHandle", "string")).toBe("Promise<string>");
  });

  it("preserves existing Promise", () => {
    expect(getReturnType("IpcHandle", "Promise<string>")).toBe("Promise<string>");
  });

  it("handles complex types", () => {
    expect(getReturnType("IpcHandle", "{ a: number }")).toBe("Promise<{ a: number }>");
  });
});
