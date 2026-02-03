import { BrowserWindow, IpcMainInvokeEvent } from "electron";

import { createParamDecorator } from "../utils/create-param-decorator";

import { impl, Window } from "./window";

jest.mock("../utils/create-param-decorator", () => ({
  createParamDecorator: jest.fn(() => () => {}),
}));

describe("Window param decorator", () => {
  test("should resolve to BrowserWindow", () => {
    const mockEvent = { sender: {} } as unknown as IpcMainInvokeEvent;
    const mockWindow = {};
    (BrowserWindow.fromWebContents as jest.Mock).mockReturnValue(mockWindow);

    expect(impl(mockEvent)).toBe(mockWindow);
    expect(BrowserWindow.fromWebContents).toHaveBeenCalledWith(mockEvent.sender);
  });

  test("should be created with createParamDecorator", () => {
    expect(createParamDecorator).toHaveBeenCalledWith(impl);
    expect(Window).toBeDefined();
  });
});
