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

  // Deterministic pastel palette from name per design.md §12.2
  const palettes = [
    { bg: 'var(--color-jade-100)', color: 'var(--color-forest-950)', border: 'rgba(52, 135, 119, 0.3)' },
    { bg: 'var(--color-clay-100)', color: 'var(--color-clay-600)', border: 'rgba(201, 111, 85, 0.3)' },
    { bg: 'var(--color-sky-100)', color: 'var(--color-sky-700)', border: 'rgba(82, 124, 145, 0.3)' },
    { bg: 'var(--color-amber-100)', color: 'var(--color-amber-600)', border: 'rgba(185, 133, 63, 0.3)' },
    { bg: 'var(--color-sage-100)', color: 'var(--color-forest-900)', border: 'rgba(145, 169, 149, 0.35)' },
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
          boxShadow: 'var(--shadow-soft)',
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
        fontFamily: 'var(--font-display)',
        fontSize: `${Math.round(size * 0.38)}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `1.5px solid ${theme.border}`,
        boxShadow: 'var(--shadow-soft)',
        userSelect: 'none',
        letterSpacing: '-0.02em',
        ...style,
      }}
    >
      {getInitials(name)}
    </div>
  );
};
