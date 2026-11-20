import React from 'react';
import { Button } from './Button.js';

export interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  style?: React.CSSProperties;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  style,
}) => {
  return (
    <div
      className="paper-card"
      style={{
        padding: 'var(--space-12) var(--space-8)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-3)',
        ...style,
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: 'var(--radius-pill)',
          backgroundColor: 'var(--color-sage-100)',
          color: 'var(--color-jade-700)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 'var(--space-2)',
          boxShadow: 'var(--shadow-soft)',
        }}
      >
        {icon || (
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <path
              d="M8 16 C8 10, 16 10, 16 16 C16 22, 24 22, 24 16"
              stroke="var(--color-jade-700)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M24 16 C24 10, 16 10, 16 16 C16 22, 8 22, 8 16"
              stroke="var(--color-amber-600)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="1 3"
            />
          </svg>
        )}
      </div>

      <h3
        style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          color: 'var(--color-forest-950)',
          fontFamily: 'var(--font-display)',
          letterSpacing: '-0.015em',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: '0.9375rem',
          color: 'var(--color-ink-soft)',
          maxWidth: '460px',
          lineHeight: 1.55,
        }}
      >
        {description}
      </p>
      {actionLabel && onAction ? (
        <div style={{ marginTop: 'var(--space-3)' }}>
          <Button variant="primary" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
};
