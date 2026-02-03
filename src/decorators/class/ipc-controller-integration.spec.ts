import { getControllerMetadata } from "../../metadata/get-controller-metadata";
import { IpcHandle } from "../method/ipc-handle";

import { IpcController } from "./ipc-controller";

describe("IpcController inheritance (Integration)", () => {
  test("should inherit handlers from parent class", () => {
    class BaseController {
      @IpcHandle()
      parentMethod() {}
    }

    @IpcController()
    class ChildController extends BaseController {
      @IpcHandle()
      childMethod() {}
    }

    const meta = getControllerMetadata(ChildController);
    expect(meta.handlers.has("parentMethod")).toBe(true);
    expect(meta.handlers.has("childMethod")).toBe(true);
    expect(meta.handlers.size).toBe(2);
  });
});
