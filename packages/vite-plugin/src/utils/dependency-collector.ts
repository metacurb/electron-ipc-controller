import path from "path";

export class DependencyCollector {
  private dependencies = new Set<string>();

  add(filePath: string): void {
    if (!filePath || filePath.includes("node_modules")) {
      return;
    }
    this.dependencies.add(path.resolve(filePath));
  }

  getDependencies(): Set<string> {
    return new Set(this.dependencies);
  }

  merge(other: Set<string> | DependencyCollector): void {
    const deps = other instanceof DependencyCollector ? other.getDependencies() : other;
    deps.forEach((dep) => this.dependencies.add(dep));
  }
}
