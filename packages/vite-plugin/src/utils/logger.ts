/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
export interface Logger {
  error(message: string, ...args: any[]): void;
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
}

export class ConsoleLogger implements Logger {
  constructor(private prefix: string = "") {}

  private format(message: string): string {
    return this.prefix ? `${this.prefix} ${message}` : message;
  }

  error(message: string, ...args: any[]): void {
    console.error(this.format(message), ...args);
  }

  info(message: string, ...args: any[]): void {
    console.log(this.format(message), ...args);
  }

  warn(message: string, ...args: any[]): void {
    console.warn(this.format(message), ...args);
  }
}
