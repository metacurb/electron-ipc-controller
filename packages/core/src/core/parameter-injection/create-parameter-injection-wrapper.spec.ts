import { IpcMainInvokeEvent } from "electron";

import { ParameterInjectionContext } from "../../metadata/types";

import { createParameterInjectionWrapper } from "./create-parameter-injection-wrapper";

describe("createParameterInjectionWrapper", () => {
  const handler = jest.fn();
  const mockEvent = { sender: { id: 1 } } as IpcMainInvokeEvent;
  const mockContext = { channel: "test.channel" };

  const rawEventResolver = (event: IpcMainInvokeEvent, _data: unknown) => event;

  beforeEach(() => {
    handler.mockClear();
  });

  test("should strip event and pass args when no injections", () => {
    const wrapper = createParameterInjectionWrapper(handler, mockContext, undefined);
    wrapper(mockEvent, "arg1", "arg2");

    expect(handler).toHaveBeenCalledWith("arg1", "arg2");
    expect(handler).not.toHaveBeenCalledWith(mockEvent, "arg1", "arg2");
  });

  test("should inject resolved value at index 0", () => {
    const wrapper = createParameterInjectionWrapper(handler, mockContext, [{ index: 0, resolver: rawEventResolver }]);
    wrapper(mockEvent, "arg1");

    expect(handler).toHaveBeenCalledWith(mockEvent, "arg1");
  });

  test("should inject resolved value at index 1", () => {
    const wrapper = createParameterInjectionWrapper(handler, mockContext, [{ index: 1, resolver: rawEventResolver }]);
    wrapper(mockEvent, "arg1");

    expect(handler).toHaveBeenCalledWith("arg1", mockEvent);
  });

  test("should inject resolved value at index 1 with multiple args", () => {
    const wrapper = createParameterInjectionWrapper(handler, mockContext, [{ index: 1, resolver: rawEventResolver }]);
    wrapper(mockEvent, "arg1", "arg2");

    expect(handler).toHaveBeenCalledWith("arg1", mockEvent, "arg2");
  });

  test("should handle multiple injections correctly", () => {
    const wrapper = createParameterInjectionWrapper(handler, mockContext, [
      { index: 0, resolver: rawEventResolver },
      { index: 2, resolver: rawEventResolver },
    ]);

    wrapper(mockEvent, "arg1", "arg2");

    expect(handler).toHaveBeenCalledWith(mockEvent, "arg1", mockEvent, "arg2");
  });

  test("should pass context to resolver when provided", () => {
    const contextResolver = jest.fn(
      (_event: IpcMainInvokeEvent, ctx: ParameterInjectionContext, _data: unknown) => ctx.channel,
    );

    const wrapper = createParameterInjectionWrapper(handler, mockContext, [{ index: 0, resolver: contextResolver }]);
    wrapper(mockEvent, "arg1");

    expect(contextResolver).toHaveBeenCalledWith(mockEvent, mockContext, undefined);
    expect(handler).toHaveBeenCalledWith("test.channel", "arg1");
  });

  test("should handle missing optional arguments before injection", () => {
    const wrapper = createParameterInjectionWrapper(handler, mockContext, [{ index: 2, resolver: rawEventResolver }]);
    wrapper(mockEvent, "arg1");

    expect(handler).toHaveBeenCalledWith("arg1", undefined, mockEvent);
  });
});
