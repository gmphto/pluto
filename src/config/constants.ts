/**
 * Application-wide constants and configuration
 */

/**
 * Storage configuration
 */
export const STORAGE = {
  KEYS: {
    PINS_DATA: 'pinterest_pins_data',
    DEBUG_LOGS: 'debug_logs',
    USER_PREFERENCES: 'user_preferences',
  },
  LIMITS: {
    MAX_PINS: 10000,
    MAX_DEBUG_LOGS: 100,
  },
} as const;

/**
 * Pinterest-specific constants
 */
export const PINTEREST = {
  DOMAIN: 'pinterest.com',
  PIN_URL_PATTERN: /\/pin\/(\d+)/,
  API: {
    BASE_URL: 'https://www.pinterest.com',
    RESOURCE_ENDPOINT: '/resource/PinResource/get/',
    TIMEOUT: 10000, // 10 seconds
  },
  SELECTORS: {
    PIN_LINK: 'a[href*="/pin/"]',
    PIN_IMAGE: 'img',
    PIN_STATS: '[data-test-id="pin-stats"]',
    SAVE_COUNT: '[data-test-id="save-count"]',
    LIKE_COUNT: '[data-test-id="like-count"]',
    COMMENT_COUNT: '[data-test-id="comment-count"]',
  },
} as const;

/**
 * UI configuration
 */
export const UI = {
  OVERLAY: {
    Z_INDEX: 9999,
    FADE_DURATION: 300,
    BORDER_RADIUS: '8px',
  },
  FLOATING_BUTTON: {
    Z_INDEX: 10000,
    SIZE: 56,
    BOTTOM_OFFSET: 20,
    RIGHT_OFFSET: 20,
  },
  STATS_TABLE: {
    ROWS_PER_PAGE: 50,
    MAX_TITLE_LENGTH: 100,
  },
} as const;

/**
 * Extension metadata
 */
export const EXTENSION = {
  NAME: 'Pinterest Stats Extension',
  VERSION: '1.0.0',
  DESCRIPTION: 'Chrome extension to reveal Pinterest stats for each pin',
} as const;

/**
 * Development configuration
 */
export const DEV = {
  ENABLE_DEBUG_LOGS: false, // Set to true during development
  ENABLE_PERFORMANCE_MONITORING: false, // Set to true during development
} as const;

/**
 * Performance thresholds
 */
export const PERFORMANCE = {
  MUTATION_OBSERVER_THROTTLE: 500, // ms
  STATS_REFRESH_INTERVAL: 5000, // ms
  API_RETRY_ATTEMPTS: 3,
  API_RETRY_DELAY: 1000, // ms
} as const;
