import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { PinStats } from '../types/pinterest';
import { PinStatsOverlay } from '../components/pin/pinStatsOverlay';

export function usePinOverlay(element: HTMLElement, stats: PinStats) {
  const rootRef = useRef<ReactDOM.Root | null>(null);

  useEffect(() => {
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
    rootRef.current = root;

    return () => {
      if (rootRef.current) {
        rootRef.current.unmount();
        rootRef.current = null;
      }
      overlayContainer.remove();
    };
  }, [element, stats]);
}
