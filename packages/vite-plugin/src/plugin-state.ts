import type { Program } from "typescript";

export class PluginState {
  private controllerFiles: Set<string> | null = null;
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private hasGeneratedOnce = false;
  private lastHash: string | null = null;
  private program: Program | null = null;

  constructor(private readonly debounceMs = 100) {}

  claimInitialGeneration(): boolean {
    if (!this.hasGeneratedOnce) {
      this.hasGeneratedOnce = true;
      return true;
    }
    return false;
  }

  getProgram(): Program | undefined {
    return this.program ?? undefined;
  }

  scheduleGenerate(callback: () => void | Promise<void>): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      void callback();
      this.debounceTimer = null;
    }, this.debounceMs);
  }

  setControllerFiles(files: Set<string>): void {
    this.controllerFiles = files;
  }

  setProgram(program: Program): void {
    this.program = program;
  }

  shouldRegenerate(absId: string, mainEntryPath: string, preloadEntryPath?: string): boolean {
    const isMainEntry = absId === mainEntryPath;
    const isPreloadEntry = preloadEntryPath ? absId === preloadEntryPath : false;
    const isControllerFile = this.controllerFiles?.has(absId);
    return isMainEntry || isPreloadEntry || !!isControllerFile;
  }

  updateHash(hash: string): boolean {
    if (hash === this.lastHash) {
      return false;
    }
    this.lastHash = hash;
    return true;
  }
}
