import { deriveNamespace } from "./derive-namespace";
import { toCamelCase } from "./to-camel-case";

jest.mock("./to-camel-case");

const mockToCamelCase = jest.mocked(toCamelCase);

describe("Naming Utils", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockToCamelCase.mockImplementation((input) => input);
  });

  describe("deriveNamespace", () => {
    test.each([
      ["UserController", "User"],
      ["UserControllerController", "UserController"],
      ["UserProfileController", "UserProfile"],
    ])('should remove "Controller" suffix from %s', (input, expected) => {
      expect(deriveNamespace(input)).toBe(expected);
    });
  });
});
