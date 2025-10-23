import { PinStats } from '../types/pinterest';

export class PinterestExtractor {
  /**
   * Extract pin data from Pinterest's internal data structures
   * Pinterest stores data in window.__PWS_DATA__ or within React component props
   */
  static extractPinFromElement(element: HTMLElement): PinStats | null {
    try {
      // Try to find the pin link
      const linkElement = element.querySelector('a[href*="/pin/"]') as HTMLAnchorElement;
      if (!linkElement) return null;

      const pinUrl = linkElement.href;
      const pinId = this.extractPinId(pinUrl);
      if (!pinId) return null;

      // Try to extract from data attributes or React props
      const pinData = this.extractPinDataFromDOM(element);

      // Get image URL
      const imgElement = element.querySelector('img') as HTMLImageElement;
      const imageUrl = imgElement?.src || imgElement?.dataset?.src || '';

      // Get title
      const titleElement = element.querySelector('[data-test-id="pin-title"], h3, h2');
      const title = titleElement?.textContent?.trim() || 'Untitled Pin';

      return {
        id: pinId,
        url: pinUrl,
        imageUrl,
        title,
        saves: pinData?.saves || 0,
        likes: pinData?.likes || 0,
        comments: pinData?.comments || 0,
        createdAt: pinData?.createdAt || new Date().toISOString(),
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error('Error extracting pin data:', error);
      return null;
    }
  }

  private static extractPinId(url: string): string | null {
    const match = url.match(/\/pin\/(\d+)/);
    return match ? match[1] : null;
  }

  private static extractPinDataFromDOM(element: HTMLElement): any {
    // Try to find stats in various places Pinterest might store them

    // Method 1: Look for data attributes
    const statsElement = element.querySelector('[data-test-id="pin-stats"]');
    if (statsElement) {
      const saves = this.parseNumber(statsElement.querySelector('[data-test-id="save-count"]')?.textContent);
      const likes = this.parseNumber(statsElement.querySelector('[data-test-id="like-count"]')?.textContent);
      const comments = this.parseNumber(statsElement.querySelector('[data-test-id="comment-count"]')?.textContent);

      if (saves || likes || comments) {
        return { saves, likes, comments };
      }
    }

    // Method 2: Look for React props in the element tree
    const reactProps = this.findReactProps(element);
    if (reactProps) {
      return reactProps;
    }

    // Method 3: Parse from visible text
    const textContent = element.textContent || '';
    const saves = this.extractStatFromText(textContent, ['saves', 'saved']);
    const likes = this.extractStatFromText(textContent, ['likes', 'liked']);
    const comments = this.extractStatFromText(textContent, ['comments', 'commented']);

    return { saves, likes, comments };
  }

  private static parseNumber(text: string | null | undefined): number {
    if (!text) return 0;

    // Remove non-numeric characters except K, M, B
    const cleanText = text.replace(/[^0-9KMB.]/gi, '');

    // Convert K, M, B to numbers
    if (cleanText.includes('K')) {
      return Math.round(parseFloat(cleanText.replace('K', '')) * 1000);
    }
    if (cleanText.includes('M')) {
      return Math.round(parseFloat(cleanText.replace('M', '')) * 1000000);
    }
    if (cleanText.includes('B')) {
      return Math.round(parseFloat(cleanText.replace('B', '')) * 1000000000);
    }

    return parseInt(cleanText, 10) || 0;
  }

  private static extractStatFromText(text: string, keywords: string[]): number {
    for (const keyword of keywords) {
      const regex = new RegExp(`(\\d+(?:\\.\\d+)?[KMB]?)\\s*${keyword}`, 'i');
      const match = text.match(regex);
      if (match) {
        return this.parseNumber(match[1]);
      }
    }
    return 0;
  }

  private static findReactProps(element: HTMLElement): any {
    // Try to find React fiber
    const fiberKey = Object.keys(element).find(key =>
      key.startsWith('__reactFiber') || key.startsWith('__reactInternalInstance')
    );

    if (fiberKey) {
      const fiber = (element as any)[fiberKey];
      if (fiber?.memoizedProps) {
        const props = fiber.memoizedProps;

        // Look for pin data in props
        if (props.pin || props.data || props.pinData) {
          const pinData = props.pin || props.data || props.pinData;
          return {
            saves: pinData.aggregated_pin_data?.aggregated_stats?.saves ||
                   pinData.repin_count || 0,
            likes: pinData.aggregated_pin_data?.aggregated_stats?.likes ||
                   pinData.like_count || 0,
            comments: pinData.comment_count || 0,
            createdAt: pinData.created_at || new Date().toISOString(),
          };
        }
      }
    }

    return null;
  }

  /**
   * Fetch detailed pin data using Pinterest's internal API
   */
  static async fetchPinDetails(pinId: string): Promise<Partial<PinStats> | null> {
    try {
      // Pinterest's GraphQL endpoint
      const response = await fetch('https://www.pinterest.com/resource/PinResource/get/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
      });

      if (!response.ok) return null;

      const data = await response.json();

      if (data?.resource_response?.data) {
        const pinData = data.resource_response.data;
        return {
          saves: pinData.aggregated_pin_data?.aggregated_stats?.saves || pinData.repin_count || 0,
          likes: pinData.aggregated_pin_data?.aggregated_stats?.likes || 0,
          comments: pinData.comment_count || 0,
          createdAt: pinData.created_at || new Date().toISOString(),
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching pin details:', error);
      return null;
    }
  }
}
