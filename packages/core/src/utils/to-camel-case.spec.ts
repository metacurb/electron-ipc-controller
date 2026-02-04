import { toCamelCase } from "./to-camel-case";

describe("toCamelCase", () => {
  test.each([
    ["camelCase", "camelCase"],
    ["thisIsATest", "thisIsATest"],
    ["PascalCase", "pascalCase"],
    ["UserController", "userController"],
    ["kebab-case", "kebabCase"],
    ["long-kebab-case-string", "longKebabCaseString"],
    ["string with spaces", "stringWithSpaces"],
    ["multiple   spaces", "multipleSpaces"],
    ["snake_case", "snakeCase"],
    ["already_formatted", "alreadyFormatted"],
    ["Mixed-Separators_Example", "mixedSeparatorsExample"],
    ["camelCase-kebab_mixed", "camelCaseKebabMixed"],
    ["camelCase123", "camelCase123"],
    ["version2Control", "version2Control"],
    ["HTMLParser", "htmlParser"],
    ["simpleHTMLParser", "simpleHtmlParser"],
    ["PDFLoad", "pdfLoad"],
    ["", ""],
    ["   ", ""],
    ["---", ""],
    ["__", ""],
    ["  leading trailing  ", "leadingTrailing"],
  ])('should convert "%s" to "%s"', (input, expected) => {
    expect(toCamelCase(input)).toBe(expected);
  });
});
