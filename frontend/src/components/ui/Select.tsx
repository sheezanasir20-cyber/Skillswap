import React from 'react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string | number; label: string }>;
  id?: string;
  style?: React.CSSProperties;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, id, style, ...props }, ref) => {
    const inputId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

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
        <select
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
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
            cursor: 'pointer',
            ...style,
          }}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error ? (
          <span role="alert" style={{ fontSize: '0.8125rem', color: 'var(--color-danger)', fontWeight: 500 }}>
            {error}
          </span>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
