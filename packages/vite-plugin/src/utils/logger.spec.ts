import { ConsoleLogger } from "./logger";

describe("ConsoleLogger", () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should log info with prefix", () => {
    const logger = new ConsoleLogger("[TEST]");
    logger.info("message");
    expect(consoleLogSpy).toHaveBeenCalledWith("[TEST] message");
  });

  it("should log warn with prefix", () => {
    const logger = new ConsoleLogger("[TEST]");
    logger.warn("message");
    expect(consoleWarnSpy).toHaveBeenCalledWith("[TEST] message");
  });

  it("should log error with prefix", () => {
    const logger = new ConsoleLogger("[TEST]");
    logger.error("message");
    expect(consoleErrorSpy).toHaveBeenCalledWith("[TEST] message");
  });

  it("should pass additional arguments", () => {
    const logger = new ConsoleLogger("[TEST]");
    logger.info("message", { foo: "bar" });
    expect(consoleLogSpy).toHaveBeenCalledWith("[TEST] message", { foo: "bar" });
  });

  it("should handle empty prefix", () => {
    const logger = new ConsoleLogger();
    logger.info("message");
    expect(consoleLogSpy).toHaveBeenCalledWith("message");
  });
});
