import React from 'react';

export interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading...' }) => {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-8)',
        gap: 'var(--space-3)',
      }}
    >
      <div
        style={{
          width: '28px',
          height: '28px',
          border: '3px solid var(--color-line)',
          borderTopColor: 'var(--color-crimson-700)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <span style={{ fontSize: '0.875rem', color: 'var(--color-muted)' }}>{message}</span>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
