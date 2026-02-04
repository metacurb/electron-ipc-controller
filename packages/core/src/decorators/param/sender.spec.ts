import { IpcMainInvokeEvent } from "electron";

import { createParamDecorator } from "../utils/create-param-decorator";

import { impl, Sender } from "./sender";

jest.mock("../utils/create-param-decorator", () => ({
  createParamDecorator: jest.fn(() => () => {}),
}));

describe("Sender param decorator", () => {
  test("should resolve to event.sender", () => {
    const mockEvent = { sender: {} } as unknown as IpcMainInvokeEvent;
    expect(impl(mockEvent)).toBe(mockEvent.sender);
  });

  test("should be created with createParamDecorator", () => {
    expect(createParamDecorator).toHaveBeenCalledWith(impl);
    expect(Sender).toBeDefined();
  });
});
