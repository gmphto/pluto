/**
 * This script runs in the page context (not content script context)
 * to intercept Pinterest's internal API calls and data structures
 */

interface PinterestPinData {
  id: string;
  title?: string;
  description?: string;
  repin_count?: number;
  reaction_counts?: {
    '1'?: number; // likes
  };
  comment_count?: number;
  aggregated_pin_data?: {
    aggregated_stats?: {
      saves?: number;
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
        if (url.includes('pinterest.com') &&
            (url.includes('/resource/') || url.includes('/_ngjs/resource/'))) {

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

    XMLHttpRequest.prototype.open = function(method: string, url: string | URL, ...rest: any[]) {
      (this as any)._url = url.toString();
      return originalOpen.apply(this, [method, url, ...rest] as any);
    };

    XMLHttpRequest.prototype.send = function(body?: Document | XMLHttpRequestBodyInit | null) {
      this.addEventListener('load', function() {
        const url = (this as any)._url;
        if (url && url.includes('pinterest.com') &&
            (url.includes('/resource/') || url.includes('/_ngjs/resource/'))) {
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
      // Pinterest's API response structure
      if (data?.resource_response?.data) {
        const responseData = data.resource_response.data;

        // Single pin response
        if (responseData.id) {
          this.cachePinData(responseData);
        }

        // Array of pins (e.g., from feed, board, search)
        if (Array.isArray(responseData)) {
          responseData.forEach((pin: any) => {
            if (pin?.id) {
              this.cachePinData(pin);
            }
          });
        }

        // Results array
        if (responseData.results && Array.isArray(responseData.results)) {
          responseData.results.forEach((pin: any) => {
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

    const extracted = {
      id: pinData.id,
      title: pinData.title || pinData.description || '',
      saves: pinData.aggregated_pin_data?.aggregated_stats?.saves ||
             pinData.repin_count || 0,
      likes: pinData.reaction_counts?.['1'] || 0,
      comments: pinData.comment_count || 0,
      createdAt: pinData.created_at || new Date().toISOString(),
      imageUrl: pinData.images?.orig?.url || '',
    };

    this.pinDataCache.set(pinData.id, extracted);

    // Notify content script
    window.postMessage({
      type: 'PINTEREST_PIN_DATA',
      data: extracted,
    }, '*');
  }

  private setupMessageListener() {
    window.addEventListener('message', (event) => {
      if (event.source !== window) return;

      if (event.data.type === 'GET_PIN_DATA' && event.data.pinId) {
        const data = this.pinDataCache.get(event.data.pinId);
        if (data) {
          window.postMessage({
            type: 'PINTEREST_PIN_DATA_RESPONSE',
            pinId: event.data.pinId,
            data,
          }, '*');
        }
      }

      if (event.data.type === 'GET_ALL_PIN_DATA') {
        const allData = Array.from(this.pinDataCache.entries()).map(([id, data]) => data);
        window.postMessage({
          type: 'PINTEREST_ALL_PIN_DATA',
          data: allData,
        }, '*');
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
