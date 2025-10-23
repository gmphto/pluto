/**
 * Custom error classes for the Pinterest Stats Extension
 * Provides structured error handling with different error types
 */

/**
 * Base error class for all extension errors
 */
export abstract class ExtensionError extends Error {
  public readonly context?: Record<string, unknown>;
  public readonly timestamp: number;

  constructor(message: string, context?: Record<string, unknown>) {
    super(message);
    this.name = this.constructor.name;
    this.context = context;
    this.timestamp = Date.now();

    // Maintains proper stack trace for where our error was thrown (V8 only)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Error thrown when storage operations fail
 */
export class StorageError extends ExtensionError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(`Storage Error: ${message}`, context);
  }
}

/**
 * Error thrown when data extraction fails
 */
export class ExtractionError extends ExtensionError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(`Extraction Error: ${message}`, context);
  }
}

/**
 * Error thrown when API calls fail
 */
export class APIError extends ExtensionError {
  public readonly statusCode?: number;

  constructor(message: string, statusCode?: number, context?: Record<string, unknown>) {
    super(`API Error: ${message}`, context);
    this.statusCode = statusCode;
  }
}

/**
 * Error thrown when validation fails
 */
export class ValidationError extends ExtensionError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(`Validation Error: ${message}`, context);
  }
}

/**
 * Error thrown when an operation times out
 */
export class TimeoutError extends ExtensionError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(`Timeout Error: ${message}`, context);
  }
}

/**
 * Checks if an error is an ExtensionError
 */
export function isExtensionError(error: unknown): error is ExtensionError {
  return error instanceof ExtensionError;
}

/**
 * Safely extracts error message from any error type
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
}

/**
 * Creates a safe error object for logging
 */
export function serializeError(error: unknown): Record<string, unknown> {
  if (error instanceof ExtensionError) {
    return {
      name: error.name,
      message: error.message,
      context: error.context,
      timestamp: error.timestamp,
      stack: error.stack,
    };
  }
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }
  return {
    error: String(error),
  };
}
