import React from 'react';

interface FloatingButtonProps {
  onClick: () => void;
  pinCount: number;
}

export const FloatingButton: React.FC<FloatingButtonProps> = ({ onClick, pinCount }) => {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#E60023',
        color: 'white',
        border: 'none',
        borderRadius: '24px',
        padding: '12px 24px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(230, 0, 35, 0.4)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'all 0.2s ease',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.boxShadow = '0 6px 16px rgba(230, 0, 35, 0.5)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(230, 0, 35, 0.4)';
      }}
    >
      <span style={{ fontSize: '18px' }}>📊</span>
      <span>Open Pin Stats Table</span>
      {pinCount > 0 && (
        <span
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '12px',
            padding: '2px 8px',
            fontSize: '12px',
            fontWeight: '700',
          }}
        >
          {pinCount}
        </span>
      )}
    </button>
  );
};
