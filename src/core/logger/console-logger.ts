import type { ILogger } from './interfaces';

export class ConsoleLogger implements ILogger {
  private prefix = '[Zorvyn]';

  info(message: string, context?: Record<string, unknown>): void {
    console.log(`${this.prefix} ℹ ${message}`, context ?? '');
  }

  warn(message: string, context?: Record<string, unknown>): void {
    console.warn(`${this.prefix} ⚠ ${message}`, context ?? '');
  }

  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    console.error(`${this.prefix} ✖ ${message}`, error?.message ?? '', context ?? '');
  }

  fatal(message: string, error?: Error, context?: Record<string, unknown>): void {
    console.error(`${this.prefix} 💀 FATAL: ${message}`, error?.message ?? '', context ?? '');
  }
}

export const logger: ILogger = new ConsoleLogger();
