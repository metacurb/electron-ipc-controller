import { IpcMainInvokeEvent } from "electron";

import { createParamDecorator } from "../utils/create-param-decorator";

import { impl, ProcessId } from "./process-id";

jest.mock("../utils/create-param-decorator", () => ({
  createParamDecorator: jest.fn(() => () => {}),
}));

describe("ProcessId param decorator", () => {
  test("should resolve to event.processId", () => {
    const mockEvent = { processId: 123 } as unknown as IpcMainInvokeEvent;
    expect(impl(mockEvent)).toBe(123);
  });

  test("should be created with createParamDecorator", () => {
    expect(createParamDecorator).toHaveBeenCalledWith(impl);
    expect(ProcessId).toBeDefined();
  });
});
