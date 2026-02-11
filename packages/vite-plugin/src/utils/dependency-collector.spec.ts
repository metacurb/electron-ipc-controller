import path from "path";

import { DependencyCollector } from "./dependency-collector";

describe("DependencyCollector", () => {
  let collector: DependencyCollector;

  beforeEach(() => {
    collector = new DependencyCollector();
  });

  it("should add valid file paths", () => {
    const filePath = "/path/to/file.ts";
    collector.add(filePath);
    expect(collector.getDependencies().has(path.resolve(filePath))).toBe(true);
  });

  it("should ignore node_modules paths", () => {
    collector.add("/path/to/node_modules/package/index.js");
    expect(collector.getDependencies().size).toBe(0);
  });

  it("should ignore empty paths", () => {
    collector.add("");
    expect(collector.getDependencies().size).toBe(0);
  });

  it("should merge dependencies from another set", () => {
    collector.add("/path/to/file1.ts");
    const otherSet = new Set([path.resolve("/path/to/file2.ts")]);
    collector.merge(otherSet);

    expect(collector.getDependencies().size).toBe(2);
    expect(collector.getDependencies().has(path.resolve("/path/to/file1.ts"))).toBe(true);
    expect(collector.getDependencies().has(path.resolve("/path/to/file2.ts"))).toBe(true);
  });

  it("should merge dependencies from another collector", () => {
    collector.add("/path/to/file1.ts");
    const otherCollector = new DependencyCollector();
    otherCollector.add("/path/to/file2.ts");
    collector.merge(otherCollector);

    expect(collector.getDependencies().size).toBe(2);
    expect(collector.getDependencies().has(path.resolve("/path/to/file1.ts"))).toBe(true);
    expect(collector.getDependencies().has(path.resolve("/path/to/file2.ts"))).toBe(true);
  });
});
