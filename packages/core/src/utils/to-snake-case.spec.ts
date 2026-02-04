import { toSnakeCase } from "./to-snake-case";

describe("toSnakeCase", () => {
  test.each([
    ["camelCase", "camel_case"],
    ["thisIsATest", "this_is_a_test"],
    ["PascalCase", "pascal_case"],
    ["UserController", "user_controller"],
    ["kebab-case", "kebab_case"],
    ["long-kebab-case-string", "long_kebab_case_string"],
    ["string with spaces", "string_with_spaces"],
    ["multiple   spaces", "multiple_spaces"],
    ["snake_case", "snake_case"],
    ["already_formatted", "already_formatted"],
    ["Mixed-Separators_Example", "mixed_separators_example"],
    ["camelCase-kebab_mixed", "camel_case_kebab_mixed"],
    ["camelCase123", "camel_case123"],
    ["version2Control", "version2_control"],
    ["HTMLParser", "html_parser"],
    ["simpleHTMLParser", "simple_html_parser"],
    ["PDFLoad", "pdf_load"],
    ["", ""],
    ["   ", ""],
    ["---", "_"],
    ["__", "__"],
    ["  leading trailing  ", "leading_trailing"],
  ])('should convert "%s" to "%s"', (input, expected) => {
    expect(toSnakeCase(input)).toBe(expected);
  });
});
