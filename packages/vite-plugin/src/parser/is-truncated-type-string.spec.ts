import { isTruncatedTypeString } from "./is-truncated-type-string";

describe("isTruncatedTypeString", () => {
  it("returns true for TypeScript truncation pattern", () => {
    expect(isTruncatedTypeString("{ a: number; ... 27 more ... }")).toBe(true);
    expect(isTruncatedTypeString("... 1 more ...")).toBe(true);
    expect(isTruncatedTypeString("{ _id?: { label: string; }[] | undefined; ... 27 more ...; }")).toBe(true);
  });

  it("returns false for normal type strings", () => {
    expect(isTruncatedTypeString("number")).toBe(false);
    expect(isTruncatedTypeString("Promise<GameListModel[]>")).toBe(false);
    expect(isTruncatedTypeString("void")).toBe(false);
    expect(isTruncatedTypeString("{ a: string; b: number }")).toBe(false);
  });

  it("returns false for types containing rest/spread syntax", () => {
    expect(isTruncatedTypeString("[first: string, ...rest: string[]]")).toBe(false);
    expect(isTruncatedTypeString("(...args: any[]) => void")).toBe(false);
  });
});
