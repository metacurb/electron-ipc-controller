import { IpcMainInvokeEvent } from "electron";

import { createParamDecorator } from "../utils/create-param-decorator";

import { Channel, impl } from "./channel";

jest.mock("../utils/create-param-decorator", () => ({
  createParamDecorator: jest.fn(() => () => {}),
}));

describe("Channel param decorator", () => {
  test("should resolve to context.channel", () => {
    const mockEvent = {} as unknown as IpcMainInvokeEvent;
    const context = { channel: "api.get" };
    expect(impl(mockEvent, context)).toBe("api.get");
  });

  test("should be created with createParamDecorator", () => {
    expect(createParamDecorator).toHaveBeenCalledWith(impl);
    expect(Channel).toBeDefined();
  });
});
