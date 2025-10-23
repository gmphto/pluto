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
    console.log('[DOM Extraction] Starting DOM extraction for element');

    // Method 1: Look for data attributes
    const statsElement = element.querySelector('[data-test-id="pin-stats"]');
    if (statsElement) {
      console.log('[DOM Extraction] Found stats element with data-test-id');
      const saves = this.parseNumber(statsElement.querySelector('[data-test-id="save-count"]')?.textContent);
      const likes = this.parseNumber(statsElement.querySelector('[data-test-id="like-count"]')?.textContent);
      const comments = this.parseNumber(statsElement.querySelector('[data-test-id="comment-count"]')?.textContent);

      if (saves || likes || comments) {
        console.log('[DOM Extraction] Method 1 (data attributes) succeeded:', { saves, likes, comments });
        return { saves, likes, comments };
      }
    }

    // Method 2: Look for React props in the element tree
    console.log('[DOM Extraction] Trying Method 2: React props extraction');
    const reactProps = this.findReactProps(element);
    if (reactProps) {
      console.log('[DOM Extraction] Method 2 (React props) succeeded:', reactProps);
      return reactProps;
    }

    // Method 3: Parse from visible text
    console.log('[DOM Extraction] Trying Method 3: Text parsing');
    const textContent = element.textContent || '';
    const saves = this.extractStatFromText(textContent, ['saves', 'saved']);
    const likes = this.extractStatFromText(textContent, ['likes', 'liked']);
    const comments = this.extractStatFromText(textContent, ['comments', 'commented']);

    if (saves || likes || comments) {
      console.log('[DOM Extraction] Method 3 (text parsing) found some stats:', { saves, likes, comments });
    } else {
      console.log('[DOM Extraction] Method 3 (text parsing) found no stats. Text content length:', textContent.length);
    }

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
    // Try to find React fiber - traverse up to 10 levels (increased from 5)
    let currentElement: HTMLElement | null = element;
    let depth = 0;

    while (currentElement && depth < 10) {
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
          if (result) {
            console.log('[DOM Extraction] Found data in fiber.memoizedProps at depth', depth);
            return result;
          }
        }

        // Try to extract from return (parent fiber) - traverse up multiple levels
        let parentFiber = fiber?.return;
        let parentDepth = 0;
        while (parentFiber && parentDepth < 5) {
          if (parentFiber.memoizedProps) {
            const result = this.extractFromProps(parentFiber.memoizedProps);
            if (result) {
              console.log('[DOM Extraction] Found data in parent fiber at depth', depth, 'parent depth', parentDepth);
              return result;
            }
          }
          parentFiber = parentFiber.return;
          parentDepth++;
        }

        // Try to extract from child - traverse down multiple levels
        let childFiber = fiber?.child;
        let childDepth = 0;
        while (childFiber && childDepth < 5) {
          if (childFiber.memoizedProps) {
            const result = this.extractFromProps(childFiber.memoizedProps);
            if (result) {
              console.log('[DOM Extraction] Found data in child fiber at depth', depth, 'child depth', childDepth);
              return result;
            }
          }
          // Also check sibling
          if (childFiber.sibling?.memoizedProps) {
            const result = this.extractFromProps(childFiber.sibling.memoizedProps);
            if (result) {
              console.log('[DOM Extraction] Found data in sibling fiber at depth', depth, 'child depth', childDepth);
              return result;
            }
          }
          childFiber = childFiber.child;
          childDepth++;
        }

        // Try stateNode
        if (fiber?.stateNode?.props) {
          const result = this.extractFromProps(fiber.stateNode.props);
          if (result) {
            console.log('[DOM Extraction] Found data in fiber.stateNode.props at depth', depth);
            return result;
          }
        }

        // Try alternate fiber (React keeps two versions)
        if (fiber?.alternate?.memoizedProps) {
          const result = this.extractFromProps(fiber.alternate.memoizedProps);
          if (result) {
            console.log('[DOM Extraction] Found data in alternate fiber at depth', depth);
            return result;
          }
        }
      }

      currentElement = currentElement.parentElement;
      depth++;
    }

    console.log('[DOM Extraction] No React fiber data found after searching', depth, 'levels');
    return null;
  }

  private static extractFromProps(props: any): any {
    if (!props) return null;

    // Look for pin data in various prop names (expanded list)
    const possiblePinData = props.pin ||
                           props.data ||
                           props.pinData ||
                           props.pinObject ||
                           props.item ||
                           props.node ||
                           props.gridItem ||
                           props.pinItem;

    if (possiblePinData && typeof possiblePinData === 'object') {
      const pinData = possiblePinData;

      // Check if this looks like valid pin data
      if (pinData.id ||
          pinData.repin_count !== undefined ||
          pinData.comment_count !== undefined ||
          pinData.aggregated_pin_data !== undefined) {

        const extracted = {
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

        // Only return if we found at least one non-zero stat
        if (extracted.saves > 0 || extracted.likes > 0 || extracted.comments > 0) {
          console.log('[DOM Extraction] Successfully extracted stats from props:', extracted);
          return extracted;
        }
      }
    }

    // Also try direct extraction from props without nesting
    if (props.id && (props.repin_count !== undefined || props.comment_count !== undefined || props.aggregated_pin_data !== undefined)) {
      const extracted = {
        saves: props.aggregated_pin_data?.aggregated_stats?.saves ||
               props.repin_count ||
               props.save_count ||
               props.saves ||
               0,
        likes: props.aggregated_pin_data?.aggregated_stats?.likes ||
               props.reaction_counts?.['1'] ||
               props.like_count ||
               props.likes ||
               0,
        comments: props.comment_count || props.comments || 0,
        createdAt: props.created_at || props.createdAt || new Date().toISOString(),
      };

      // Only return if we found at least one non-zero stat
      if (extracted.saves > 0 || extracted.likes > 0 || extracted.comments > 0) {
        console.log('[DOM Extraction] Successfully extracted stats from direct props:', extracted);
        return extracted;
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
