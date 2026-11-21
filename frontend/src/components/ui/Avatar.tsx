import React from 'react';

export interface AvatarProps {
  name: string;
  avatarUrl?: string | null;
  size?: number; // in pixels
  style?: React.CSSProperties;
}

export const Avatar: React.FC<AvatarProps> = ({ name, avatarUrl, size = 40, style }) => {
  const getInitials = (n: string): string => {
    const parts = n.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  // Deterministic Ember Noir palette
  const palettes = [
    { bg: 'rgba(106, 4, 15, 0.12)', color: 'var(--color-burgundy-800)', border: 'rgba(106, 4, 15, 0.3)' },
    { bg: 'rgba(232, 93, 4, 0.12)', color: 'var(--color-crimson-700)', border: 'rgba(232, 93, 4, 0.3)' },
    { bg: 'rgba(244, 140, 6, 0.14)', color: 'var(--color-ink-950)', border: 'rgba(244, 140, 6, 0.35)' },
    { bg: 'rgba(55, 6, 23, 0.12)', color: 'var(--color-wine-900)', border: 'rgba(55, 6, 23, 0.3)' },
    { bg: 'rgba(255, 186, 8, 0.16)', color: 'var(--color-ink-950)', border: 'rgba(255, 186, 8, 0.4)' },
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const theme = palettes[Math.abs(hash) % palettes.length];

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: 'var(--radius-pill)',
          objectFit: 'cover',
          border: '1.5px solid var(--color-line)',
          boxShadow: 'var(--shadow-sm)',
          ...style,
        }}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={name}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: 'var(--radius-pill)',
        backgroundColor: theme.bg,
        color: theme.color,
        fontWeight: 700,
        fontFamily: 'var(--font-heading)',
        fontSize: `${Math.round(size * 0.38)}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `1.5px solid ${theme.border}`,
        boxShadow: 'var(--shadow-xs)',
        userSelect: 'none',
        letterSpacing: '-0.02em',
        ...style,
      }}
    >
      {getInitials(name)}
    </div>
  );
};
