export class PluginState {
  private controllerFiles: Set<string> | null = null;
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private hasGeneratedOnce = false;
  private lastHash: string | null = null;

  private lastMetadataHash: string | null = null;

  constructor(private readonly debounceMs = 100) {}

  claimInitialGeneration(): boolean {
    if (!this.hasGeneratedOnce) {
      this.hasGeneratedOnce = true;
      return true;
    }
    return false;
  }

  scheduleGenerate(callback: () => void): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      callback();
      this.debounceTimer = null;
    }, this.debounceMs);
  }

  setControllerFiles(files: Set<string>): void {
    this.controllerFiles = files;
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

  updateMetadataHash(hash: string): boolean {
    if (hash === this.lastMetadataHash) {
      return false;
    }
    this.lastMetadataHash = hash;
    return true;
  }
}
