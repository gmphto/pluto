import React from 'react';
import { FloatingButton } from '../components/layout/floatingButton';
import { usePinterestInjector } from '../hooks/usePinterestInjector';

export function ContentApp() {
  const { pinCount, openStatsPage } = usePinterestInjector();

  return <FloatingButton onClick={openStatsPage} pinCount={pinCount} />;
}
