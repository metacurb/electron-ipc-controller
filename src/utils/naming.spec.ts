import { buildChannel, deriveNamespaceFromClassName } from "./naming";
import { toSnakeCase } from "./to-snake-case";

jest.mock("./to-snake-case");

const mockToSnakeCase = jest.mocked(toSnakeCase);

describe("Naming Utils", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockToSnakeCase.mockImplementation((input) => input);
  });

  describe("buildChannel", () => {
    test("should combine namespace and method with a colon", () => {
      expect(buildChannel("user", "create")).toBe("user:create");
    });
  });

  describe("deriveNamespaceFromClassName", () => {
    test.each([
      ["UserController", "User"],
      ["UserControllerController", "UserController"],
      ["UserProfileController", "UserProfile"],
    ])('should remove "Controller" suffix from %s', (input, expected) => {
      expect(deriveNamespaceFromClassName(input)).toBe(expected);
    });
  });
});
