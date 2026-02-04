import { IpcMainInvokeEvent } from "electron";

import { createParamDecorator } from "../utils/create-param-decorator";

import { impl, RawEvent } from "./raw-event";

jest.mock("../utils/create-param-decorator", () => ({
  createParamDecorator: jest.fn(() => () => {}),
}));

describe("RawEvent param decorator", () => {
  test("should resolve to event", () => {
    const mockEvent = {} as unknown as IpcMainInvokeEvent;
    expect(impl(mockEvent)).toBe(mockEvent);
  });

  test("should be created with createParamDecorator", () => {
    expect(createParamDecorator).toHaveBeenCalledWith(impl);
    expect(RawEvent).toBeDefined();
  });
});
