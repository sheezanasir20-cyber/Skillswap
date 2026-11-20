import React from 'react';
import { Link } from 'react-router-dom';

export interface BrandLogoProps {
  variant?: 'dark' | 'light';
  to?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'light',
  to = '/',
  size = 'md',
  showTagline = false,
}) => {
  const isDark = variant === 'dark';

  const markSize = size === 'sm' ? 22 : size === 'lg' ? 32 : 26;
  const textSize = size === 'sm' ? '1.125rem' : size === 'lg' ? '1.5rem' : '1.25rem';

  const content = (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        userSelect: 'none',
      }}
    >
      {/* Signature exchange-loop motif per design.md §2.2 */}
      <svg
        width={markSize}
        height={markSize}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <circle cx="16" cy="16" r="15" fill={isDark ? 'rgba(52, 135, 119, 0.2)' : 'var(--color-sage-100)'} />
        <path
          d="M9 16 C9 11, 16 11, 16 16 C16 21, 23 21, 23 16"
          stroke="var(--color-jade-600)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M23 16 C23 11, 16 11, 16 16 C16 21, 9 21, 9 16"
          stroke="var(--color-amber-600)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeDasharray="2 3"
        />
      </svg>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: textSize,
            fontWeight: 800,
            color: isDark ? 'var(--color-paper)' : 'var(--color-forest-950)',
            letterSpacing: '-0.025em',
            lineHeight: 1.1,
          }}
        >
          Skill<span style={{ color: isDark ? 'var(--color-jade-100)' : 'var(--color-jade-600)' }}>Swap</span>
        </span>
        {showTagline ? (
          <span
            style={{
              fontSize: '0.6875rem',
              color: isDark ? 'rgba(255, 255, 255, 0.65)' : 'var(--color-muted)',
              fontFamily: 'var(--font-body)',
              marginTop: '1px',
              letterSpacing: '0.02em',
            }}
          >
            Exchange knowledge, not money
          </span>
        ) : null}
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} style={{ textDecoration: 'none' }}>
        {content}
      </Link>
    );
  }

  return content;
};
