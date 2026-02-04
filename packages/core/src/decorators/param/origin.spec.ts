import { IpcMainInvokeEvent } from "electron";

import { createParamDecorator } from "../utils/create-param-decorator";

import { impl, Origin } from "./origin";

jest.mock("../utils/create-param-decorator", () => ({
  createParamDecorator: jest.fn(() => () => {}),
}));

describe("Origin param decorator", () => {
  test("should resolve to event.senderFrame", () => {
    const mockEvent = { senderFrame: { name: "frame" } } as unknown as IpcMainInvokeEvent;
    expect(impl(mockEvent)).toBe(mockEvent.senderFrame);
  });

  test("should be created with createParamDecorator", () => {
    expect(createParamDecorator).toHaveBeenCalledWith(impl);
    expect(Origin).toBeDefined();
  });
});
