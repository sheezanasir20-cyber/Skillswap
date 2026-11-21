import React from 'react';

export interface ButtonProps {
  children?: any;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'clay' | 'ember' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  style?: any;
  type?: any;
  onClick?: any;
  className?: string;
  [key: string]: any;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  style,
  ...props
}) => {
  const getStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--space-2)',
      fontFamily: 'var(--font-body)',
      fontWeight: 650,
      borderRadius: 'var(--radius-sm)',
      border: '1px solid transparent',
      transition: 'all var(--transition-fast)',
      whiteSpace: 'nowrap',
      cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      textDecoration: 'none',
      userSelect: 'none',
    };

    // Dimensions per design.md §7.1
    if (size === 'sm') {
      base.height = '34px';
      base.padding = '0 var(--space-3)';
      base.fontSize = '0.8125rem';
    } else if (size === 'lg') {
      base.height = '48px';
      base.padding = '0 var(--space-6)';
      base.fontSize = '0.9375rem';
    } else {
      base.height = '42px';
      base.padding = '0 var(--space-4)';
      base.fontSize = '0.875rem';
    }

    // Variants per design.md §7.1
    if (variant === 'primary') {
      base.backgroundColor = 'var(--color-crimson-700)';
      base.color = '#ffffff';
      base.borderColor = 'rgba(157, 2, 8, 0.4)';
      base.boxShadow = '0 4px 14px rgba(157, 2, 8, 0.28)';
    } else if (variant === 'secondary') {
      base.backgroundColor = 'var(--color-surface)';
      base.color = 'var(--color-ink-950)';
      base.borderColor = 'var(--color-line)';
      base.boxShadow = 'var(--shadow-sm)';
    } else if (variant === 'clay' || variant === 'ember') {
      base.backgroundColor = 'var(--color-ember-600)';
      base.color = 'var(--color-ink-950)'; // Dark readable text on bright orange per rule 3.3
      base.borderColor = 'rgba(232, 93, 4, 0.4)';
      base.boxShadow = '0 4px 14px rgba(232, 93, 4, 0.25)';
    } else if (variant === 'destructive') {
      base.backgroundColor = 'var(--color-crimson-600)';
      base.color = '#ffffff';
      base.borderColor = 'var(--color-crimson-600)';
      base.boxShadow = '0 4px 12px rgba(208, 0, 0, 0.25)';
    } else if (variant === 'tertiary') {
      base.backgroundColor = 'transparent';
      base.color = 'var(--color-burgundy-800)';
      base.borderColor = 'transparent';
    }

    return { ...base, ...style };
  };

  return (
    <button disabled={disabled || isLoading} style={getStyles()} {...props}>
      {isLoading ? (
        <span
          style={{
            display: 'inline-block',
            width: '14px',
            height: '14px',
            border: '2px solid currentColor',
            borderRightColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite',
          }}
        />
      ) : null}
      {children}
    </button>
  );
};
