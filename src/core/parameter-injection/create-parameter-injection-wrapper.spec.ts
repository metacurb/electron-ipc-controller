import { IpcMainInvokeEvent } from "electron";

import { createParameterInjectionWrapper } from "./create-parameter-injection-wrapper";

describe("createParameterInjectionWrapper", () => {
  const handler = jest.fn();
  const mockEvent = { sender: { id: 1 } } as IpcMainInvokeEvent;

  const rawEventResolver = (event: IpcMainInvokeEvent, _data: unknown) => event;

  beforeEach(() => {
    handler.mockClear();
  });

  test("should strip event and pass args when no injections", () => {
    const wrapper = createParameterInjectionWrapper(handler, undefined);
    wrapper(mockEvent, "arg1", "arg2");

    expect(handler).toHaveBeenCalledWith("arg1", "arg2");
    expect(handler).not.toHaveBeenCalledWith(mockEvent, "arg1", "arg2");
  });

  test("should inject resolved value at index 0", () => {
    const wrapper = createParameterInjectionWrapper(handler, [
      { index: 0, resolver: rawEventResolver },
    ]);
    wrapper(mockEvent, "arg1");

    expect(handler).toHaveBeenCalledWith(mockEvent, "arg1");
  });

  test("should inject resolved value at index 1", () => {
    const wrapper = createParameterInjectionWrapper(handler, [
      { index: 1, resolver: rawEventResolver },
    ]);
    wrapper(mockEvent, "arg1");

    expect(handler).toHaveBeenCalledWith("arg1", mockEvent);
  });

  test("should inject resolved value at index 1 with multiple args", () => {
    const wrapper = createParameterInjectionWrapper(handler, [
      { index: 1, resolver: rawEventResolver },
    ]);
    wrapper(mockEvent, "arg1", "arg2");

    expect(handler).toHaveBeenCalledWith("arg1", mockEvent, "arg2");
  });

  test("should handle multiple injections correctly", () => {
    const wrapper = createParameterInjectionWrapper(handler, [
      { index: 0, resolver: rawEventResolver },
      { index: 2, resolver: rawEventResolver },
    ]);

    wrapper(mockEvent, "arg1", "arg2");

    expect(handler).toHaveBeenCalledWith(mockEvent, "arg1", mockEvent, "arg2");
  });
});
