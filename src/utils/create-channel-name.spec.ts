import { createChannelName } from "./create-channel-name";
import { toSnakeCase } from "./to-snake-case";

jest.mock("./to-snake-case");

const mockToSnakeCase = jest.mocked(toSnakeCase);

describe("createChannelName", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockToSnakeCase.mockImplementation((input) => input);
  });

  test("should combine namespace and method with a dot", () => {
    expect(createChannelName("user", "create")).toBe("user.create");
  });
});
