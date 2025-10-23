import { useEffect, useState, useCallback } from 'react';
import { PinterestInjector } from '../services/pinterestInjector';
import { StorageManager } from '../utils/storage';

export function usePinterestInjector() {
  const [pinCount, setPinCount] = useState(0);
  const [injector, setInjector] = useState<PinterestInjector | null>(null);

  const handlePinCountChange = useCallback((count: number) => {
    setPinCount(count);
  }, []);

  useEffect(() => {
    const pinterestInjector = new PinterestInjector(handlePinCountChange);
    pinterestInjector.initialize();
    setInjector(pinterestInjector);

    // Load initial pin count
    StorageManager.getPins().then((pins) => {
      setPinCount(pins.length);
    });

    return () => {
      pinterestInjector.destroy();
    };
  }, [handlePinCountChange]);

  const openStatsPage = useCallback(() => {
    chrome.runtime.sendMessage({ type: 'OPEN_STATS_PAGE' });
  }, []);

  return {
    pinCount,
    openStatsPage,
    injector,
  };
}
