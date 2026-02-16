import { IpcMainInvokeEvent } from "electron";

import { ParameterInjectionContext, ParameterValidation } from "../../metadata/types";

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

  test("should validate parameters", () => {
    const validations: ParameterValidation[] = [
      {
        index: 0,
        validator: (val) => typeof val === "string",
      },
      {
        index: 1,
        validator: (val) => typeof val === "number" && (val as number) > 0,
      }
    ];

    const wrapper = createParameterInjectionWrapper(
      handler,
      mockContext,
      undefined,
      validations
    );

    // Valid call
    wrapper(mockEvent, "hello", 10);
    expect(handler).toHaveBeenCalledWith("hello", 10);

    // Invalid first arg
    expect(() => wrapper(mockEvent, 123, 10)).toThrow("Validation failed for argument at index 0");

    // Invalid second arg
    expect(() => wrapper(mockEvent, "hello", -5)).toThrow("Validation failed for argument at index 1");
  });

  test("should handle mixed injection and validation", () => {
    const injections = [
      {
        index: 0,
        resolver: () => "injected",
      }
    ];
    // Handler signature: (injected, regular)
    // Validation on index 1 (regular arg)
    const validations: ParameterValidation[] = [
      {
        index: 1,
        validator: (val) => val === "valid",
      }
    ];

    const wrapper = createParameterInjectionWrapper(
      handler,
      mockContext,
      injections,
      validations
    );

    // wrapper receives (event, regularArg)
    // injected arg is inserted at 0.
    // regularArg becomes index 1.

    // Valid
    wrapper(mockEvent, "valid");
    expect(handler).toHaveBeenCalledWith("injected", "valid");

    // Invalid
    expect(() => wrapper(mockEvent, "invalid")).toThrow("Validation failed for argument at index 1");
  });

  test("should validate injected parameters", () => {
      const injections = [
        { index: 0, resolver: () => "bad_injection" }
      ];
      const validations: ParameterValidation[] = [
          { index: 0, validator: (val) => val === "good_injection" }
      ];

      const wrapper = createParameterInjectionWrapper(
          handler,
          mockContext,
          injections,
          validations
      );

      expect(() => wrapper(mockEvent)).toThrow("Validation failed for argument at index 0");
  });
});
