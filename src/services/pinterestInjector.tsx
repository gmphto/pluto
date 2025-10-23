import React from 'react';
import ReactDOM from 'react-dom/client';
import { PinStats } from '../types/pinterest';
import { PinterestExtractor } from '../utils/pinterest';
import { StorageManager } from '../utils/storage';
import { PinStatsOverlay } from '../components/pin/pinStatsOverlay';

export interface PinData {
  id: string;
  saves: number;
  likes: number;
  comments: number;
  title?: string;
  imageUrl?: string;
  createdAt?: string;
}

export class PinterestInjector {
  private processedPins: Set<string> = new Set();
  private interceptedPinData: Map<string, PinData> = new Map();
  private observer: MutationObserver | null = null;
  private onPinCountChange?: (count: number) => void;

  constructor(onPinCountChange?: (count: number) => void) {
    this.onPinCountChange = onPinCountChange;
  }

  async initialize() {
    console.log('Pinterest Stats Analyzer initialized');

    this.injectInterceptor();
    this.setupMessageListener();

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.start());
    } else {
      this.start();
    }
  }

  private injectInterceptor() {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('pinterest-interceptor.js');
    script.onload = () => {
      console.log('Pinterest interceptor injected successfully');
      script.remove();
    };
    (document.head || document.documentElement).appendChild(script);
  }

  private setupMessageListener() {
    window.addEventListener('message', (event) => {
      if (event.source !== window) return;

      if (event.data.type === 'PINTEREST_PIN_DATA' && event.data.data) {
        const pinData = event.data.data;
        this.interceptedPinData.set(pinData.id, pinData);
        console.log('[Content Script] Received pin data:', {
          id: pinData.id,
          saves: pinData.saves,
          likes: pinData.likes,
          comments: pinData.comments,
          title: pinData.title?.substring(0, 50) + '...',
        });

        this.updateExistingOverlay(pinData.id, pinData);
      }
    });
  }

  private updateExistingOverlay(pinId: string, pinData: PinData) {
    const pinLink = document.querySelector(`a[href*="/pin/${pinId}"]`);
    if (pinLink) {
      const pinElement = pinLink.closest(
        '[data-test-id="pin"], [data-test-id="pinWrapper"], [data-grid-item="true"]'
      ) as HTMLElement;
      if (pinElement) {
        if (this.processedPins.has(pinId)) {
          const oldOverlay = pinElement.querySelector('.pinterest-stats-overlay');
          if (oldOverlay) {
            oldOverlay.remove();
          }
        }

        const stats: PinStats = {
          id: pinId,
          url: (pinLink as HTMLAnchorElement).href,
          imageUrl: pinData.imageUrl || '',
          title: pinData.title || 'Untitled Pin',
          saves: pinData.saves || 0,
          likes: pinData.likes || 0,
          comments: pinData.comments || 0,
          createdAt: pinData.createdAt || new Date().toISOString(),
          timestamp: Date.now(),
        };

        this.addStatsOverlay(pinElement, stats);
        this.processedPins.add(pinId);
      }
    }
  }

  private async start() {
    await this.processPins();
    this.setupObserver();
  }

  private setupObserver() {
    this.observer = new MutationObserver(() => {
      setTimeout(() => this.processPins(), 500);
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  async processPins() {
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
      elements.forEach((el) => {
        if (!pinElements.includes(el as HTMLElement)) {
          pinElements.push(el as HTMLElement);
        }
      });
    }

    if (pinElements.length === 0) {
      const linkElements = document.querySelectorAll('a[href*="/pin/"]');
      linkElements.forEach((link) => {
        const pinElement = link.closest('div[style*="position"]') as HTMLElement;
        if (pinElement && !pinElements.includes(pinElement)) {
          pinElements.push(pinElement);
        }
      });
    }

    console.log(`Found ${pinElements.length} potential pin elements`);

    const newPins: PinStats[] = [];

    for (const element of pinElements) {
      const pinLink = element.querySelector('a[href*="/pin/"]') as HTMLAnchorElement;
      if (!pinLink) continue;

      const pinId = this.extractPinId(pinLink.href);
      if (!pinId || this.processedPins.has(pinId)) continue;

      const interceptedData = this.interceptedPinData.get(pinId);

      if (interceptedData) {
        console.log(`[Content Script] Using intercepted data for pin ${pinId}:`, {
          saves: interceptedData.saves,
          likes: interceptedData.likes,
          comments: interceptedData.comments,
        });
      } else {
        console.log(`[Content Script] No intercepted data for pin ${pinId}, will extract from DOM`);
      }

      const pinStats = PinterestExtractor.extractPinFromElement(element, interceptedData);

      if (pinStats) {
        console.log(`[Content Script] Final stats for pin ${pinId}:`, {
          saves: pinStats.saves,
          likes: pinStats.likes,
          comments: pinStats.comments,
        });

        this.addStatsOverlay(element, pinStats);
        this.processedPins.add(pinId);
        newPins.push(pinStats);
      } else {
        console.log(`[Content Script] Failed to extract stats for pin ${pinId}`);
      }
    }

    if (newPins.length > 0) {
      await StorageManager.addPins(newPins);
      const totalPins = (await StorageManager.getPins()).length;
      if (this.onPinCountChange) {
        this.onPinCountChange(totalPins);
      }
      console.log(`Processed ${newPins.length} new pins. Total: ${totalPins}`);
    }

    return newPins;
  }

  private extractPinId(url: string): string | null {
    const match = url.match(/\/pin\/(\d+)/);
    return match && match[1] ? match[1] : null;
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

  getProcessedPins(): Set<string> {
    return this.processedPins;
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }

    document.querySelectorAll('.pinterest-stats-overlay').forEach((el) => el.remove());

    this.processedPins.clear();
    this.interceptedPinData.clear();
  }
}
