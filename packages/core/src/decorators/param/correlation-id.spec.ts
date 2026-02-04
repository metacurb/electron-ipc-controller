import { getCorrelationId } from "../../correlation/get-correlation-id";
import { createParamDecorator } from "../utils/create-param-decorator";

import { CorrelationId, impl } from "./correlation-id";

jest.mock("../../correlation/get-correlation-id");
jest.mock("../utils/create-param-decorator", () => ({
  createParamDecorator: jest.fn(() => () => {}),
}));
const mockGetCorrelationId = jest.mocked(getCorrelationId);

describe("CorrelationId param decorator", () => {
  test("should resolve to correlation id", () => {
    mockGetCorrelationId.mockReturnValue("test-correlation-id");
    expect(impl()).toBe("test-correlation-id");
  });

  test("should be created with createParamDecorator", () => {
    expect(createParamDecorator).toHaveBeenCalledWith(impl);
    expect(CorrelationId).toBeDefined();
  });
});
