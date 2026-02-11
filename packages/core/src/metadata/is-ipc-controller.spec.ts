import { IPC_CONTROLLER_METADATA } from "./constants";
import { isIpcController } from "./is-ipc-controller";

describe("isIpcController", () => {
  it("should return false for non-function values", () => {
    expect(isIpcController(undefined)).toBe(false);
    expect(isIpcController(null)).toBe(false);
    expect(isIpcController(42)).toBe(false);
    expect(isIpcController("")).toBe(false);
    expect(isIpcController({})).toBe(false);
    expect(isIpcController([])).toBe(false);
    expect(isIpcController(Symbol())).toBe(false);
  });

  it("should return false for a function without metadata", () => {
    class PlainClass {}
    expect(isIpcController(PlainClass)).toBe(false);
  });

  it("should return false for arrow functions", () => {
    const fn = () => {};
    expect(isIpcController(fn)).toBe(false);
  });

  it("should return true for a class with IPC controller metadata", () => {
    class MetaController {}
    const meta = { handlers: new Map(), id: "id", namespace: "ns", target: MetaController };
    Reflect.defineMetadata(IPC_CONTROLLER_METADATA, meta, MetaController);
    expect(isIpcController(MetaController)).toBe(true);
  });
});
