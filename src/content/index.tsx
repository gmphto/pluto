import React from 'react';
import ReactDOM from 'react-dom/client';
import { PinStatsOverlay } from '../components/PinStatsOverlay';
import { FloatingButton } from '../components/FloatingButton';
import { PinterestExtractor } from '../utils/pinterest';
import { StorageManager } from '../utils/storage';
import { PinStats } from '../types/pinterest';

class PinterestStatsInjector {
  private processedPins: Set<string> = new Set();
  private observer: MutationObserver | null = null;
  private floatingButtonRoot: ReactDOM.Root | null = null;
  private pinCount: number = 0;

  constructor() {
    this.init();
  }

  private async init() {
    console.log('Pinterest Stats Analyzer initialized');

    // Wait for page to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.start());
    } else {
      this.start();
    }
  }

  private async start() {
    // Add floating button
    this.addFloatingButton();

    // Process existing pins
    await this.processPins();

    // Set up observer for dynamically loaded pins
    this.setupObserver();
  }

  private addFloatingButton() {
    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'pinterest-stats-floating-button';
    document.body.appendChild(buttonContainer);

    this.floatingButtonRoot = ReactDOM.createRoot(buttonContainer);
    this.updateFloatingButton();
  }

  private updateFloatingButton() {
    if (this.floatingButtonRoot) {
      this.floatingButtonRoot.render(
        <FloatingButton
          onClick={() => this.openStatsPage()}
          pinCount={this.pinCount}
        />
      );
    }
  }

  private openStatsPage() {
    chrome.runtime.sendMessage({ type: 'OPEN_STATS_PAGE' });
  }

  private setupObserver() {
    this.observer = new MutationObserver((mutations) => {
      // Debounce the processing
      setTimeout(() => this.processPins(), 500);
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  private async processPins() {
    // Find all pin elements on the page
    // Pinterest uses various selectors, so we try multiple approaches
    const pinSelectors = [
      '[data-test-id="pin"]',
      '[data-test-id="pinWrapper"]',
      '[data-grid-item="true"]',
      'div[class*="pinWrapper"]',
      'div[class*="Pin"]',
    ];

    const pinElements: HTMLElement[] = [];

    for (const selector of pinSelectors) {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        if (!pinElements.includes(el as HTMLElement)) {
          pinElements.push(el as HTMLElement);
        }
      });
    }

    if (pinElements.length === 0) {
      // Fallback: try to find elements with pin links
      const linkElements = document.querySelectorAll('a[href*="/pin/"]');
      linkElements.forEach(link => {
        const pinElement = link.closest('div[style*="position"]') as HTMLElement;
        if (pinElement && !pinElements.includes(pinElement)) {
          pinElements.push(pinElement);
        }
      });
    }

    console.log(`Found ${pinElements.length} potential pin elements`);

    const newPins: PinStats[] = [];

    for (const element of pinElements) {
      // Check if already processed
      const pinLink = element.querySelector('a[href*="/pin/"]') as HTMLAnchorElement;
      if (!pinLink) continue;

      const pinId = this.extractPinId(pinLink.href);
      if (!pinId || this.processedPins.has(pinId)) continue;

      // Extract pin data
      const pinStats = PinterestExtractor.extractPinFromElement(element);

      if (pinStats) {
        // Add stats overlay
        this.addStatsOverlay(element, pinStats);

        // Mark as processed
        this.processedPins.add(pinId);
        newPins.push(pinStats);
      }
    }

    // Save to storage
    if (newPins.length > 0) {
      await StorageManager.addPins(newPins);
      this.pinCount = (await StorageManager.getPins()).length;
      this.updateFloatingButton();
      console.log(`Processed ${newPins.length} new pins. Total: ${this.pinCount}`);
    }
  }

  private extractPinId(url: string): string | null {
    const match = url.match(/\/pin\/(\d+)/);
    return match ? match[1] : null;
  }

  private addStatsOverlay(element: HTMLElement, stats: PinStats) {
    // Make sure the pin container has relative positioning
    if (getComputedStyle(element).position === 'static') {
      element.style.position = 'relative';
    }

    // Create overlay container
    const overlayContainer = document.createElement('div');
    overlayContainer.className = 'pinterest-stats-overlay';
    overlayContainer.style.cssText = `
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      pointer-events: none;
      z-index: 10;
    `;

    element.appendChild(overlayContainer);

    // Render React component
    const root = ReactDOM.createRoot(overlayContainer);
    root.render(<PinStatsOverlay stats={stats} />);
  }

  public destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }

    // Clean up overlays
    document.querySelectorAll('.pinterest-stats-overlay').forEach(el => el.remove());

    // Clean up floating button
    if (this.floatingButtonRoot) {
      this.floatingButtonRoot.unmount();
    }
    const buttonContainer = document.getElementById('pinterest-stats-floating-button');
    if (buttonContainer) {
      buttonContainer.remove();
    }
  }
}

// Initialize the injector
const injector = new PinterestStatsInjector();

// Clean up on page unload
window.addEventListener('beforeunload', () => {
  injector.destroy();
});
