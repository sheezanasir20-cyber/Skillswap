import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  id?: string;
  style?: React.CSSProperties;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, id, style, ...props }, ref) => {
    const inputId = id || (label ? `textarea-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', width: '100%' }}>
        {label ? (
          <label
            htmlFor={inputId}
            style={{
              fontSize: '0.8125rem',
              fontWeight: 650,
              color: 'var(--color-ink-950)',
              fontFamily: 'var(--font-body)',
              letterSpacing: '-0.01em',
            }}
          >
            {label}
          </label>
        ) : null}
        <textarea
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          style={{
            minHeight: '112px',
            padding: 'var(--space-3) var(--space-4)',
            borderRadius: 'var(--radius-sm)',
            border: `1.5px solid ${error ? 'var(--color-danger)' : 'var(--color-line)'}`,
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-ink)',
            fontSize: '0.9375rem',
            fontFamily: 'var(--font-body)',
            boxShadow: 'var(--shadow-xs)',
            resize: 'vertical',
            lineHeight: 1.55,
            transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
            ...style,
          }}
          {...props}
        />
        {error ? (
          <span
            id={`${inputId}-error`}
            role="alert"
            style={{ fontSize: '0.8125rem', color: 'var(--color-danger)', fontWeight: 500, marginTop: '2px' }}
          >
            {error}
          </span>
        ) : helperText ? (
          <span
            id={`${inputId}-helper`}
            style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', marginTop: '2px' }}
          >
            {helperText}
          </span>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
