import { normalizePath } from "./normalize-path.js";

describe("normalizePath", () => {
  it("converts backslashes to forward slashes", () => {
    expect(normalizePath("foo\\bar\\baz")).toBe("foo/bar/baz");
  });

  it("leaves existing forward slashes alone", () => {
    expect(normalizePath("foo/bar/baz")).toBe("foo/bar/baz");
  });

  it("handles mixed slashes", () => {
    expect(normalizePath("foo\\bar/baz")).toBe("foo/bar/baz");
  });

  it("handles empty string", () => {
    expect(normalizePath("")).toBe("");
  });
});
