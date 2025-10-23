import { PinStats } from '../types/pinterest';

export class PinterestExtractor {
  /**
   * Extract pin data from Pinterest's internal data structures
   * Pinterest stores data in window.__PWS_DATA__ or within React component props
   * @param element - The DOM element containing the pin
   * @param interceptedData - Optional data intercepted from Pinterest's API
   */
  static extractPinFromElement(element: HTMLElement, interceptedData?: any): PinStats | null {
    try {
      // Try to find the pin link
      const linkElement = element.querySelector('a[href*="/pin/"]') as HTMLAnchorElement;
      if (!linkElement) return null;

      const pinUrl = linkElement.href;
      const pinId = this.extractPinId(pinUrl);
      if (!pinId) return null;

      // Get image URL
      const imgElement = element.querySelector('img') as HTMLImageElement;
      const imageUrl = imgElement?.src || imgElement?.dataset?.src || '';

      // Get title - try multiple selectors
      let title = 'Untitled Pin';
      const titleSelectors = [
        '[data-test-id="pin-title"]',
        '[data-test-id="pinTitle"]',
        'h1',
        'h2',
        'h3',
        '[title]',
        'img[alt]',
      ];

      for (const selector of titleSelectors) {
        const titleElement = element.querySelector(selector);
        if (titleElement) {
          const text = (titleElement as HTMLElement).getAttribute('title') ||
                      (titleElement as HTMLImageElement).getAttribute('alt') ||
                      titleElement.textContent?.trim();
          if (text && text.length > 0 && text !== 'Pinterest') {
            title = text;
            break;
          }
        }
      }

      // Priority: intercepted data > React props > DOM extraction
      let stats = { saves: 0, likes: 0, comments: 0, createdAt: new Date().toISOString() };

      if (interceptedData) {
        // Use intercepted data if available (highest priority)
        stats = {
          saves: interceptedData.saves || 0,
          likes: interceptedData.likes || 0,
          comments: interceptedData.comments || 0,
          createdAt: interceptedData.createdAt || stats.createdAt,
        };
        if (interceptedData.title && interceptedData.title.length > 0) {
          title = interceptedData.title;
        }
        console.log(`Using intercepted data for pin ${pinId}:`, stats);
      } else {
        // Try to extract from React props or DOM
        const pinData = this.extractPinDataFromDOM(element);
        if (pinData) {
          stats = pinData;
        }
      }

      return {
        id: pinId,
        url: pinUrl,
        imageUrl,
        title,
        saves: stats.saves,
        likes: stats.likes,
        comments: stats.comments,
        createdAt: stats.createdAt,
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
    // Try to find React fiber - traverse up to 5 levels
    let currentElement: HTMLElement | null = element;
    let depth = 0;

    while (currentElement && depth < 5) {
      const fiberKey = Object.keys(currentElement).find(key =>
        key.startsWith('__reactFiber') ||
        key.startsWith('__reactInternalInstance') ||
        key.startsWith('__reactProps')
      );

      if (fiberKey) {
        const fiber = (currentElement as any)[fiberKey];

        // Try to extract from memoizedProps
        if (fiber?.memoizedProps) {
          const result = this.extractFromProps(fiber.memoizedProps);
          if (result) return result;
        }

        // Try to extract from return (parent fiber)
        if (fiber?.return?.memoizedProps) {
          const result = this.extractFromProps(fiber.return.memoizedProps);
          if (result) return result;
        }

        // Try to extract from child
        if (fiber?.child?.memoizedProps) {
          const result = this.extractFromProps(fiber.child.memoizedProps);
          if (result) return result;
        }

        // Try stateNode
        if (fiber?.stateNode?.props) {
          const result = this.extractFromProps(fiber.stateNode.props);
          if (result) return result;
        }
      }

      currentElement = currentElement.parentElement;
      depth++;
    }

    return null;
  }

  private static extractFromProps(props: any): any {
    if (!props) return null;

    // Look for pin data in various prop names
    const possiblePinData = props.pin || props.data || props.pinData || props.pinObject || props.item;

    if (possiblePinData && typeof possiblePinData === 'object') {
      const pinData = possiblePinData;

      // Check if this looks like valid pin data
      if (pinData.id || pinData.repin_count !== undefined || pinData.comment_count !== undefined) {
        return {
          saves: pinData.aggregated_pin_data?.aggregated_stats?.saves ||
                 pinData.repin_count ||
                 pinData.save_count ||
                 pinData.saves ||
                 0,
          likes: pinData.aggregated_pin_data?.aggregated_stats?.likes ||
                 pinData.reaction_counts?.['1'] ||
                 pinData.like_count ||
                 pinData.likes ||
                 0,
          comments: pinData.comment_count || pinData.comments || 0,
          createdAt: pinData.created_at || pinData.createdAt || new Date().toISOString(),
        };
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
