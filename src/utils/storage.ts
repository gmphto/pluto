import { PinStats, StorageData } from '../types/pinterest';
import { STORAGE } from '../config/constants';
import { logger } from '../lib/logger';
import { StorageError, ValidationError } from '../lib/errors';

/**
 * StorageManager provides a centralized interface for managing Pinterest pin data
 * in Chrome's local storage. It handles CRUD operations with proper error handling
 * and validation.
 *
 * @example
 * ```typescript
 * // Save pins to storage
 * await StorageManager.savePins([pin1, pin2]);
 *
 * // Retrieve all pins
 * const pins = await StorageManager.getPins();
 * ```
 */
export class StorageManager {
  private static readonly STORAGE_KEY = STORAGE.KEYS.PINS_DATA;
  private static readonly MAX_PINS = STORAGE.LIMITS.MAX_PINS;

  /**
   * Save an array of pins to Chrome local storage
   *
   * @param pins - Array of PinStats to save
   * @throws {ValidationError} If pins array is invalid or exceeds size limit
   * @throws {StorageError} If storage operation fails
   */
  public static async savePins(pins: PinStats[]): Promise<void> {
    try {
      this.validatePinsArray(pins);

      const data: StorageData = {
        pins,
        lastUpdated: Date.now(),
      };

      await chrome.storage.local.set({ [this.STORAGE_KEY]: data });
      logger.info(`Saved ${pins.length} pins to storage`, 'StorageManager');
    } catch (error) {
      logger.error('Failed to save pins', 'StorageManager', error);
      throw new StorageError('Failed to save pins to storage', {
        pinCount: pins.length,
        error,
      });
    }
  }

  /**
   * Retrieve all pins from Chrome local storage
   *
   * @returns Array of PinStats, empty array if no data exists
   * @throws {StorageError} If storage operation fails
   */
  public static async getPins(): Promise<PinStats[]> {
    try {
      const result = await chrome.storage.local.get(this.STORAGE_KEY);
      const data = result[this.STORAGE_KEY] as StorageData | undefined;

      if (!data) {
        logger.debug('No pins found in storage', 'StorageManager');
        return [];
      }

      logger.debug(`Retrieved ${data.pins.length} pins from storage`, 'StorageManager');
      return data.pins;
    } catch (error) {
      logger.error('Failed to retrieve pins', 'StorageManager', error);
      throw new StorageError('Failed to retrieve pins from storage', { error });
    }
  }

  /**
   * Add or update a single pin in storage
   * If a pin with the same ID exists, it will be updated
   *
   * @param pin - PinStats object to add or update
   * @throws {ValidationError} If pin is invalid
   * @throws {StorageError} If storage operation fails
   */
  public static async addPin(pin: PinStats): Promise<void> {
    try {
      this.validatePin(pin);

      const pins = await this.getPins();
      const existingIndex = pins.findIndex((p) => p.id === pin.id);

      if (existingIndex >= 0) {
        pins[existingIndex] = pin;
        logger.debug(`Updated existing pin: ${pin.id}`, 'StorageManager');
      } else {
        pins.push(pin);
        logger.debug(`Added new pin: ${pin.id}`, 'StorageManager');
      }

      await this.savePins(pins);
    } catch (error) {
      logger.error(`Failed to add pin: ${pin.id}`, 'StorageManager', error);
      throw error instanceof ValidationError || error instanceof StorageError
        ? error
        : new StorageError('Failed to add pin', { pinId: pin.id, error });
    }
  }

  /**
   * Add or update multiple pins in storage
   * Uses a Map for efficient deduplication based on pin ID
   *
   * @param newPins - Array of PinStats to add or update
   * @throws {ValidationError} If any pin is invalid
   * @throws {StorageError} If storage operation fails
   */
  public static async addPins(newPins: PinStats[]): Promise<void> {
    try {
      this.validatePinsArray(newPins);

      const pins = await this.getPins();
      const pinMap = new Map(pins.map((p) => [p.id, p]));

      newPins.forEach((pin) => {
        pinMap.set(pin.id, pin);
      });

      const mergedPins = Array.from(pinMap.values());
      await this.savePins(mergedPins);

      logger.info(`Added ${newPins.length} pins (total: ${mergedPins.length})`, 'StorageManager');
    } catch (error) {
      logger.error('Failed to add multiple pins', 'StorageManager', error);
      throw error instanceof ValidationError || error instanceof StorageError
        ? error
        : new StorageError('Failed to add multiple pins', { pinCount: newPins.length, error });
    }
  }

  /**
   * Clear all pins from storage
   *
   * @throws {StorageError} If storage operation fails
   */
  public static async clearPins(): Promise<void> {
    try {
      await chrome.storage.local.remove(this.STORAGE_KEY);
      logger.info('Cleared all pins from storage', 'StorageManager');
    } catch (error) {
      logger.error('Failed to clear pins', 'StorageManager', error);
      throw new StorageError('Failed to clear pins from storage', { error });
    }
  }

  /**
   * Get the timestamp of the last storage update
   *
   * @returns Timestamp in milliseconds, or null if no data exists
   */
  public static async getLastUpdated(): Promise<number | null> {
    try {
      const result = await chrome.storage.local.get(this.STORAGE_KEY);
      const data = result[this.STORAGE_KEY] as StorageData | undefined;
      return data?.lastUpdated ?? null;
    } catch (error) {
      logger.error('Failed to get last updated timestamp', 'StorageManager', error);
      return null;
    }
  }

  /**
   * Validate a single pin object
   *
   * @param pin - Pin to validate
   * @throws {ValidationError} If pin is invalid
   */
  private static validatePin(pin: PinStats): void {
    if (!pin || typeof pin !== 'object') {
      throw new ValidationError('Pin must be a valid object');
    }

    if (!pin.id || typeof pin.id !== 'string') {
      throw new ValidationError('Pin must have a valid ID');
    }

    if (!pin.url || typeof pin.url !== 'string') {
      throw new ValidationError('Pin must have a valid URL', { pinId: pin.id });
    }

    if (typeof pin.saves !== 'number' || pin.saves < 0) {
      throw new ValidationError('Pin saves must be a non-negative number', { pinId: pin.id });
    }

    if (typeof pin.likes !== 'number' || pin.likes < 0) {
      throw new ValidationError('Pin likes must be a non-negative number', { pinId: pin.id });
    }

    if (typeof pin.comments !== 'number' || pin.comments < 0) {
      throw new ValidationError('Pin comments must be a non-negative number', {
        pinId: pin.id,
      });
    }
  }

  /**
   * Validate an array of pins
   *
   * @param pins - Pins array to validate
   * @throws {ValidationError} If array is invalid or exceeds size limit
   */
  private static validatePinsArray(pins: PinStats[]): void {
    if (!Array.isArray(pins)) {
      throw new ValidationError('Pins must be an array');
    }

    if (pins.length > this.MAX_PINS) {
      throw new ValidationError(`Cannot store more than ${this.MAX_PINS} pins`, {
        pinCount: pins.length,
      });
    }

    // Validate each pin (sample first few to avoid performance issues)
    const samplesToValidate = Math.min(pins.length, 10);
    for (let i = 0; i < samplesToValidate; i++) {
      const pin = pins[i];
      if (pin) {
        this.validatePin(pin);
      }
    }
  }
}
