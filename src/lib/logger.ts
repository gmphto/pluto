/**
 * Centralized logging utility for the Pinterest Stats Extension
 * Provides structured logging with different severity levels
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: string;
  data?: unknown;
  timestamp: number;
}

class Logger {
  private static instance: Logger;
  private readonly isDevelopment: boolean;

  private constructor() {
    // In browser context, we don't have process.env
    // You can set this via a build-time constant or environment variable
    this.isDevelopment = false; // Set to true for development builds
  }

  /**
   * Get the singleton instance of Logger
   */
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Log a debug message
   * Only logs in development mode
   */
  public debug(message: string, context?: string, data?: unknown): void {
    if (this.isDevelopment) {
      this.log(LogLevel.DEBUG, message, context, data);
    }
  }

  /**
   * Log an info message
   */
  public info(message: string, context?: string, data?: unknown): void {
    this.log(LogLevel.INFO, message, context, data);
  }

  /**
   * Log a warning message
   */
  public warn(message: string, context?: string, data?: unknown): void {
    this.log(LogLevel.WARN, message, context, data);
  }

  /**
   * Log an error message
   */
  public error(message: string, context?: string, error?: Error | unknown): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  /**
   * Internal logging method
   */
  private log(level: LogLevel, message: string, context?: string, data?: unknown): void {
    const entry: LogEntry = {
      level,
      message,
      context,
      data,
      timestamp: Date.now(),
    };

    const prefix = context ? `[${context}]` : '';
    const logMessage = `${prefix} ${message}`;

    switch (level) {
      case LogLevel.DEBUG:
        console.log(`[DEBUG] ${logMessage}`, data);
        break;
      case LogLevel.INFO:
        console.log(`[INFO] ${logMessage}`, data);
        break;
      case LogLevel.WARN:
        console.warn(`[WARN] ${logMessage}`, data);
        break;
      case LogLevel.ERROR:
        console.error(`[ERROR] ${logMessage}`, data);
        if (data instanceof Error) {
          console.error('Stack trace:', data.stack);
        }
        break;
    }

    // Store in Chrome storage for debugging
    void this.persistLog(entry);
  }

  /**
   * Persist log entries to Chrome storage for debugging
   */
  private async persistLog(entry: LogEntry): Promise<void> {
    if (!this.isDevelopment) {
      return;
    }

    try {
      const result = await chrome.storage.local.get('debug_logs');
      const logs = (result['debug_logs'] as LogEntry[]) || [];

      // Keep only last 100 logs
      const updatedLogs = [...logs, entry].slice(-100);

      await chrome.storage.local.set({ debug_logs: updatedLogs });
    } catch (error) {
      // Silently fail to prevent infinite loops
      console.error('Failed to persist log:', error);
    }
  }

  /**
   * Get all stored debug logs
   */
  public async getDebugLogs(): Promise<LogEntry[]> {
    try {
      const result = await chrome.storage.local.get('debug_logs');
      return (result['debug_logs'] as LogEntry[]) || [];
    } catch (error) {
      console.error('Failed to retrieve debug logs:', error);
      return [];
    }
  }

  /**
   * Clear all stored debug logs
   */
  public async clearDebugLogs(): Promise<void> {
    try {
      await chrome.storage.local.remove('debug_logs');
    } catch (error) {
      console.error('Failed to clear debug logs:', error);
    }
  }
}

// Export singleton instance
export const logger = Logger.getInstance();
