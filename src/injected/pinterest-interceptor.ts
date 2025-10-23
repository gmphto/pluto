/**
 * This script runs in the page context (not content script context)
 * to intercept Pinterest's internal API calls and data structures
 */

interface PinterestPinData {
  id: string;
  title?: string;
  description?: string;
  repin_count?: number;
  save_count?: number;
  saves?: number;
  reaction_counts?: {
    '1'?: number; // likes
  };
  like_count?: number;
  likes?: number;
  comment_count?: number;
  comments?: number;
  aggregated_pin_data?: {
    aggregated_stats?: {
      saves?: number;
      likes?: number;
      done?: number;
    };
  };
  created_at?: string;
  images?: {
    orig?: {
      url?: string;
    };
  };
}

class PinterestDataInterceptor {
  private pinDataCache: Map<string, any> = new Map();

  constructor() {
    this.interceptFetch();
    this.interceptXHR();
    this.setupMessageListener();
    console.log('Pinterest Data Interceptor initialized');
  }

  private interceptFetch() {
    const originalFetch = window.fetch;
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const response = await originalFetch(input, init);

      // Clone the response so we can read it
      const clonedResponse = response.clone();

      try {
        let url: string;
        if (typeof input === 'string') {
          url = input;
        } else if (input instanceof Request) {
          url = input.url;
        } else if (input instanceof URL) {
          url = input.toString();
        } else {
          return response;
        }

        // Check if this is a Pinterest API call
        if (
          url.includes('pinterest.com') &&
          (url.includes('/resource/') || url.includes('/_ngjs/resource/'))
        ) {
          const data = await clonedResponse.json();
          this.processPinterestAPIResponse(data, url);
        }
      } catch (e) {
        // Ignore parsing errors
      }

      return response;
    };
  }

  private interceptXHR() {
    const self = this;
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method: string, url: string | URL, ...rest: any[]) {
      (this as any)._url = url.toString();
      return originalOpen.apply(this, [method, url, ...rest] as any);
    };

    XMLHttpRequest.prototype.send = function (body?: Document | XMLHttpRequestBodyInit | null) {
      this.addEventListener('load', function () {
        const url = (this as any)._url;
        if (
          url &&
          url.includes('pinterest.com') &&
          (url.includes('/resource/') || url.includes('/_ngjs/resource/'))
        ) {
          try {
            const data = JSON.parse(this.responseText);
            self.processPinterestAPIResponse(data, url);
          } catch (e) {
            // Ignore parsing errors
          }
        }
      });

      return originalSend.call(this, body);
    };
  }

  private processPinterestAPIResponse(data: any, url: string) {
    try {
      console.log('[Pinterest Interceptor] Processing API response from:', url);

      // Pinterest's API response structure
      if (data?.resource_response?.data) {
        const responseData = data.resource_response.data;

        // Single pin response
        if (responseData.id) {
          console.log('[Pinterest Interceptor] Found single pin:', responseData.id);
          this.cachePinData(responseData);
        }

        // Array of pins (e.g., from feed, board, search)
        if (Array.isArray(responseData)) {
          console.log(`[Pinterest Interceptor] Found array of ${responseData.length} pins`);
          responseData.forEach((pin: any) => {
            if (pin?.id) {
              this.cachePinData(pin);
            }
          });
        }

        // Results array
        if (responseData.results && Array.isArray(responseData.results)) {
          console.log(
            `[Pinterest Interceptor] Found results array with ${responseData.results.length} pins`
          );
          responseData.results.forEach((pin: any) => {
            if (pin?.id) {
              this.cachePinData(pin);
            }
          });
        }

        // Bookmarks array (used in some feed responses)
        if (responseData.bookmarks && Array.isArray(responseData.bookmarks)) {
          console.log(
            `[Pinterest Interceptor] Found bookmarks array with ${responseData.bookmarks.length} items`
          );
          responseData.bookmarks.forEach((bookmark: any) => {
            if (bookmark?.id) {
              this.cachePinData(bookmark);
            }
          });
        }

        // Data array (sometimes used)
        if (responseData.data && Array.isArray(responseData.data)) {
          console.log(
            `[Pinterest Interceptor] Found data array with ${responseData.data.length} items`
          );
          responseData.data.forEach((item: any) => {
            if (item?.id) {
              this.cachePinData(item);
            }
          });
        }
      }

      // Sometimes the data is directly in the response without resource_response
      if (data?.data && !data?.resource_response) {
        console.log('[Pinterest Interceptor] Found data without resource_response wrapper');
        const directData = data.data;

        if (directData.id) {
          this.cachePinData(directData);
        } else if (Array.isArray(directData)) {
          directData.forEach((pin: any) => {
            if (pin?.id) {
              this.cachePinData(pin);
            }
          });
        }
      }
    } catch (e) {
      console.error('Error processing Pinterest API response:', e);
    }
  }

  private cachePinData(pinData: PinterestPinData) {
    if (!pinData.id) return;

    // Log the complete pin data structure for debugging (first time only)
    if (!this.pinDataCache.has(pinData.id)) {
      console.log(`[Pinterest Interceptor] Complete raw data for pin ${pinData.id}:`, pinData);
    }

    // Log the specific stats fields
    console.log(`[Pinterest Interceptor] Stats fields for ${pinData.id}:`, {
      repin_count: pinData.repin_count,
      reaction_counts: pinData.reaction_counts,
      comment_count: pinData.comment_count,
      aggregated_pin_data: pinData.aggregated_pin_data,
    });

    // Try multiple locations for saves
    const saves =
      pinData.aggregated_pin_data?.aggregated_stats?.saves ||
      pinData.repin_count ||
      (pinData as any).save_count ||
      (pinData as any).saves ||
      0;

    // Try multiple locations for likes
    const likes =
      pinData.reaction_counts?.['1'] ||
      (pinData as any).aggregated_pin_data?.aggregated_stats?.likes ||
      (pinData as any).like_count ||
      (pinData as any).likes ||
      0;

    // Try multiple locations for comments
    const comments = pinData.comment_count || (pinData as any).comments || 0;

    const extracted = {
      id: pinData.id,
      title: pinData.title || pinData.description || '',
      saves,
      likes,
      comments,
      createdAt: pinData.created_at || new Date().toISOString(),
      imageUrl: pinData.images?.orig?.url || '',
    };

    console.log(`[Pinterest Interceptor] Extracted stats for ${pinData.id}:`, {
      saves: extracted.saves,
      likes: extracted.likes,
      comments: extracted.comments,
    });

    this.pinDataCache.set(pinData.id, extracted);

    // Notify content script
    window.postMessage(
      {
        type: 'PINTEREST_PIN_DATA',
        data: extracted,
      },
      '*'
    );
  }

  private setupMessageListener() {
    window.addEventListener('message', (event) => {
      if (event.source !== window) return;

      if (event.data.type === 'GET_PIN_DATA' && event.data.pinId) {
        const data = this.pinDataCache.get(event.data.pinId);
        if (data) {
          window.postMessage(
            {
              type: 'PINTEREST_PIN_DATA_RESPONSE',
              pinId: event.data.pinId,
              data,
            },
            '*'
          );
        }
      }

      if (event.data.type === 'GET_ALL_PIN_DATA') {
        const allData = Array.from(this.pinDataCache.entries()).map(([id, data]) => data);
        window.postMessage(
          {
            type: 'PINTEREST_ALL_PIN_DATA',
            data: allData,
          },
          '*'
        );
      }
    });
  }

  public getPinData(pinId: string) {
    return this.pinDataCache.get(pinId);
  }

  public getAllPinData() {
    return Array.from(this.pinDataCache.values());
  }
}

// Initialize the interceptor
const interceptor = new PinterestDataInterceptor();

// Make it globally accessible for debugging
(window as any).__pinterestInterceptor = interceptor;
