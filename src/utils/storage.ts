import { PinStats, StorageData } from '../types/pinterest';

const STORAGE_KEY = 'pinterest_pins_data';

export class StorageManager {
  static async savePins(pins: PinStats[]): Promise<void> {
    const data: StorageData = {
      pins,
      lastUpdated: Date.now(),
    };
    await chrome.storage.local.set({ [STORAGE_KEY]: data });
  }

  static async getPins(): Promise<PinStats[]> {
    const result = await chrome.storage.local.get(STORAGE_KEY);
    const data = result[STORAGE_KEY] as StorageData | undefined;
    return data?.pins || [];
  }

  static async addPin(pin: PinStats): Promise<void> {
    const pins = await this.getPins();
    const existingIndex = pins.findIndex(p => p.id === pin.id);

    if (existingIndex >= 0) {
      pins[existingIndex] = pin;
    } else {
      pins.push(pin);
    }

    await this.savePins(pins);
  }

  static async addPins(newPins: PinStats[]): Promise<void> {
    const pins = await this.getPins();
    const pinMap = new Map(pins.map(p => [p.id, p]));

    newPins.forEach(pin => {
      pinMap.set(pin.id, pin);
    });

    await this.savePins(Array.from(pinMap.values()));
  }

  static async clearPins(): Promise<void> {
    await chrome.storage.local.remove(STORAGE_KEY);
  }
}
