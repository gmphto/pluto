import { StorageManager } from '../storage';
import { PinStats } from '../../types/pinterest';
import { StorageError, ValidationError } from '../../lib/errors';

describe('StorageManager', () => {
  const mockPin: PinStats = {
    id: '123456789',
    url: 'https://pinterest.com/pin/123456789',
    imageUrl: 'https://i.pinimg.com/originals/test.jpg',
    title: 'Test Pin',
    saves: 100,
    likes: 50,
    comments: 10,
    createdAt: '2024-01-01T00:00:00.000Z',
    timestamp: Date.now(),
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Reset chrome.storage.local mock
    (chrome.storage.local.get as jest.Mock).mockResolvedValue({});
    (chrome.storage.local.set as jest.Mock).mockResolvedValue(undefined);
    (chrome.storage.local.remove as jest.Mock).mockResolvedValue(undefined);
  });

  describe('savePins', () => {
    it('should save pins to storage successfully', async () => {
      const pins = [mockPin];

      await StorageManager.savePins(pins);

      expect(chrome.storage.local.set).toHaveBeenCalledTimes(1);
      expect(chrome.storage.local.set).toHaveBeenCalledWith({
        pinterest_pins_data: {
          pins,
          lastUpdated: expect.any(Number),
        },
      });
    });

    it('should throw ValidationError for non-array input', async () => {
      await expect(StorageManager.savePins(null as any)).rejects.toThrow(ValidationError);
    });

    it('should throw StorageError when chrome.storage fails', async () => {
      (chrome.storage.local.set as jest.Mock).mockRejectedValue(
        new Error('Storage quota exceeded')
      );

      await expect(StorageManager.savePins([mockPin])).rejects.toThrow(StorageError);
    });

    it('should validate pin structure before saving', async () => {
      const invalidPin = { ...mockPin, id: null } as any;

      await expect(StorageManager.savePins([invalidPin])).rejects.toThrow(ValidationError);
    });
  });

  describe('getPins', () => {
    it('should retrieve pins from storage', async () => {
      const pins = [mockPin];
      (chrome.storage.local.get as jest.Mock).mockResolvedValue({
        pinterest_pins_data: {
          pins,
          lastUpdated: Date.now(),
        },
      });

      const result = await StorageManager.getPins();

      expect(result).toEqual(pins);
      expect(chrome.storage.local.get).toHaveBeenCalledWith('pinterest_pins_data');
    });

    it('should return empty array when no data exists', async () => {
      (chrome.storage.local.get as jest.Mock).mockResolvedValue({});

      const result = await StorageManager.getPins();

      expect(result).toEqual([]);
    });

    it('should throw StorageError when retrieval fails', async () => {
      (chrome.storage.local.get as jest.Mock).mockRejectedValue(new Error('Storage error'));

      await expect(StorageManager.getPins()).rejects.toThrow(StorageError);
    });
  });

  describe('addPin', () => {
    it('should add a new pin to storage', async () => {
      (chrome.storage.local.get as jest.Mock).mockResolvedValue({
        pinterest_pins_data: {
          pins: [],
          lastUpdated: Date.now(),
        },
      });

      await StorageManager.addPin(mockPin);

      expect(chrome.storage.local.set).toHaveBeenCalledWith({
        pinterest_pins_data: {
          pins: [mockPin],
          lastUpdated: expect.any(Number),
        },
      });
    });

    it('should update an existing pin', async () => {
      const existingPins = [mockPin];
      (chrome.storage.local.get as jest.Mock).mockResolvedValue({
        pinterest_pins_data: {
          pins: existingPins,
          lastUpdated: Date.now(),
        },
      });

      const updatedPin = { ...mockPin, saves: 200 };
      await StorageManager.addPin(updatedPin);

      expect(chrome.storage.local.set).toHaveBeenCalledWith({
        pinterest_pins_data: {
          pins: [updatedPin],
          lastUpdated: expect.any(Number),
        },
      });
    });

    it('should throw ValidationError for invalid pin', async () => {
      const invalidPin = { ...mockPin, saves: -1 };

      await expect(StorageManager.addPin(invalidPin)).rejects.toThrow(ValidationError);
    });
  });

  describe('addPins', () => {
    it('should add multiple pins to storage', async () => {
      const pin2 = { ...mockPin, id: '987654321' };
      (chrome.storage.local.get as jest.Mock).mockResolvedValue({
        pinterest_pins_data: {
          pins: [],
          lastUpdated: Date.now(),
        },
      });

      await StorageManager.addPins([mockPin, pin2]);

      expect(chrome.storage.local.set).toHaveBeenCalledWith({
        pinterest_pins_data: {
          pins: [mockPin, pin2],
          lastUpdated: expect.any(Number),
        },
      });
    });

    it('should deduplicate pins by ID', async () => {
      (chrome.storage.local.get as jest.Mock).mockResolvedValue({
        pinterest_pins_data: {
          pins: [mockPin],
          lastUpdated: Date.now(),
        },
      });

      const updatedPin = { ...mockPin, saves: 200 };
      await StorageManager.addPins([updatedPin]);

      const setCall = (chrome.storage.local.set as jest.Mock).mock.calls[0][0];
      expect(setCall.pinterest_pins_data.pins).toHaveLength(1);
      expect(setCall.pinterest_pins_data.pins[0].saves).toBe(200);
    });
  });

  describe('clearPins', () => {
    it('should clear all pins from storage', async () => {
      await StorageManager.clearPins();

      expect(chrome.storage.local.remove).toHaveBeenCalledWith('pinterest_pins_data');
    });

    it('should throw StorageError when clear fails', async () => {
      (chrome.storage.local.remove as jest.Mock).mockRejectedValue(new Error('Storage error'));

      await expect(StorageManager.clearPins()).rejects.toThrow(StorageError);
    });
  });

  describe('getLastUpdated', () => {
    it('should return last updated timestamp', async () => {
      const timestamp = Date.now();
      (chrome.storage.local.get as jest.Mock).mockResolvedValue({
        pinterest_pins_data: {
          pins: [],
          lastUpdated: timestamp,
        },
      });

      const result = await StorageManager.getLastUpdated();

      expect(result).toBe(timestamp);
    });

    it('should return null when no data exists', async () => {
      (chrome.storage.local.get as jest.Mock).mockResolvedValue({});

      const result = await StorageManager.getLastUpdated();

      expect(result).toBeNull();
    });
  });
});
