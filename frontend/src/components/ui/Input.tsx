import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  id?: string;
  style?: React.CSSProperties;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, id, style, ...props }, ref) => {
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', width: '100%' }}>
        {label ? (
          <label
            htmlFor={inputId}
            style={{
              fontSize: '0.8125rem',
              fontWeight: 650,
              color: 'var(--color-forest-950)',
              fontFamily: 'var(--font-body)',
              letterSpacing: '-0.01em',
            }}
          >
            {label}
          </label>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          style={{
            height: '42px',
            padding: '0 var(--space-4)',
            borderRadius: 'var(--radius-sm)',
            border: `1.5px solid ${error ? 'var(--color-danger)' : 'var(--color-line)'}`,
            backgroundColor: 'var(--color-paper)',
            color: 'var(--color-ink)',
            fontSize: '0.9375rem',
            fontFamily: 'var(--font-body)',
            boxShadow: 'var(--shadow-soft)',
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

Input.displayName = 'Input';
