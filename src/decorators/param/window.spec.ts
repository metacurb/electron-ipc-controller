import { BrowserWindow, IpcMainInvokeEvent } from "electron";

import { createParamDecorator } from "../utils/create-param-decorator";

import { impl, Window } from "./window";

jest.mock("../utils/create-param-decorator", () => ({
  createParamDecorator: jest.fn(() => () => {}),
}));

const mockBrowserWindow = jest.mocked(BrowserWindow);

describe("Window param decorator", () => {
  test("should resolve to BrowserWindow", () => {
    const mockEvent = { sender: {} } as unknown as IpcMainInvokeEvent;
    const mockWindow = {} as BrowserWindow;
    mockBrowserWindow.fromWebContents.mockReturnValue(mockWindow);

    expect(impl(mockEvent)).toBe(mockWindow);
    expect(mockBrowserWindow.fromWebContents).toHaveBeenCalledWith(mockEvent.sender);
  });

  test("should be created with createParamDecorator", () => {
    expect(createParamDecorator).toHaveBeenCalledWith(impl);
    expect(Window).toBeDefined();
  });
});
