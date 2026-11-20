import React from 'react';

export interface SkillBadgeProps {
  name: string;
  intent: 'teach' | 'learn';
  level?: 'beginner' | 'intermediate' | 'advanced';
  onRemove?: () => void;
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
        border: `1px solid ${isTeach ? 'rgba(52, 135, 119, 0.32)' : 'rgba(201, 111, 85, 0.32)'}`,
        backgroundColor: isTeach ? 'var(--color-jade-100)' : 'var(--color-clay-100)',
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
          color: isTeach ? 'var(--color-jade-700)' : 'var(--color-clay-600)',
          textTransform: 'uppercase',
          fontSize: '0.6875rem',
          letterSpacing: '0.03em',
        }}
      >
        {isTeach ? 'Teach' : 'Learn'}
      </span>
      <span style={{ fontWeight: 600, color: 'var(--color-forest-950)' }}>{name}</span>
      {level ? (
        <span
          style={{
            fontSize: '0.6875rem',
            color: isTeach ? 'var(--color-forest-800)' : 'var(--color-clay-600)',
            textTransform: 'capitalize',
            borderLeft: `1px solid ${isTeach ? 'rgba(52, 135, 119, 0.25)' : 'rgba(201, 111, 85, 0.25)'}`,
            paddingLeft: 'var(--space-2)',
            opacity: 0.85,
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
