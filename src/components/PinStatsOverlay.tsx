import React from 'react';
import { PinStats } from '../types/pinterest';

interface PinStatsOverlayProps {
  stats: PinStats;
}

export const PinStatsOverlay: React.FC<PinStatsOverlayProps> = ({ stats }) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'N/A';
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '0',
        left: '0',
        right: '0',
        background:
          'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 70%, transparent 100%)',
        color: 'white',
        padding: '12px 8px 8px',
        fontSize: '12px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        zIndex: 10,
        pointerEvents: 'none',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '14px' }}>📌</span>
          <span style={{ fontWeight: '600' }}>{formatNumber(stats.saves)}</span>
          <span style={{ opacity: 0.8, fontSize: '11px' }}>saves</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '14px' }}>❤️</span>
          <span style={{ fontWeight: '600' }}>{formatNumber(stats.likes)}</span>
          <span style={{ opacity: 0.8, fontSize: '11px' }}>likes</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '14px' }}>💬</span>
          <span style={{ fontWeight: '600' }}>{formatNumber(stats.comments)}</span>
          <span style={{ opacity: 0.8, fontSize: '11px' }}>comments</span>
        </div>
      </div>

      <div
        style={{
          fontSize: '10px',
          opacity: 0.7,
          textAlign: 'center',
          marginTop: '4px',
        }}
      >
        📅 {formatDate(stats.createdAt)}
      </div>
    </div>
  );
};
