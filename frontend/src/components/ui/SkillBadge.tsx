import React from 'react';

export interface SkillBadgeProps {
  name: string;
  intent: 'teach' | 'learn';
  level?: 'beginner' | 'intermediate' | 'advanced';
  onRemove?: () => void;
  style?: React.CSSProperties;
  [key: string]: any;
}

export const SkillBadge: React.FC<SkillBadgeProps> = ({ name, intent, level, onRemove, style }) => {
  const isTeach = intent === 'teach';

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        padding: '5px 10px',
        borderRadius: 'var(--radius-xs)',
        border: `1px solid ${isTeach ? 'var(--color-teach-border)' : 'var(--color-learn-border)'}`,
        backgroundColor: isTeach ? 'var(--color-teach-bg)' : 'var(--color-learn-bg)',
        fontSize: '0.8125rem',
        lineHeight: 1.25,
        transition: 'all var(--transition-fast)',
        userSelect: 'none',
        ...style,
      }}
    >
      <span
        style={{
          fontWeight: 700,
          color: isTeach ? 'var(--color-teach-text)' : 'var(--color-learn-text)',
          textTransform: 'uppercase',
          fontSize: '0.6875rem',
          letterSpacing: '0.03em',
        }}
      >
        {isTeach ? 'Teach' : 'Learn'}
      </span>
      <span style={{ fontWeight: 600, color: 'var(--color-ink-950)' }}>{name}</span>
      {level ? (
        <span
          style={{
            fontSize: '0.6875rem',
            color: 'var(--color-muted)',
            textTransform: 'capitalize',
            borderLeft: `1px solid ${isTeach ? 'var(--color-teach-border)' : 'var(--color-learn-border)'}`,
            paddingLeft: 'var(--space-2)',
            opacity: 0.9,
          }}
        >
          {level}
        </span>
      ) : null}
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${name}`}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-muted)',
            fontSize: '1rem',
            lineHeight: 1,
            marginLeft: '2px',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ×
        </button>
      ) : null}
    </div>
  );
};
