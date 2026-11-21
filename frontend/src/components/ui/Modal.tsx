import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button.js';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = '540px',
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      dialogRef.current?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="presentation"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(3, 7, 30, 0.65)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-4)',
        zIndex: 1000,
        transition: 'opacity var(--transition-normal)',
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby={description ? 'modal-description' : undefined}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-dialog)',
          border: '1px solid var(--color-line)',
          boxShadow: 'var(--shadow-popover)',
          width: '100%',
          maxWidth,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          outline: 'none',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--space-6) var(--space-6) var(--space-4)',
            borderBottom: '1px solid var(--color-line)',
            backgroundColor: 'var(--color-surface)',
          }}
        >
          <div>
            <h3
              id="modal-title"
              style={{
                fontSize: '1.25rem',
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                color: 'var(--color-ink-950)',
              }}
            >
              {title}
            </h3>
            {description ? (
              <p
                id="modal-description"
                style={{
                  fontSize: '0.8125rem',
                  color: 'var(--color-muted)',
                  marginTop: 'var(--space-1)',
                  lineHeight: 1.45,
                }}
              >
                {description}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-muted)',
              cursor: 'pointer',
              padding: 'var(--space-1)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color var(--transition-fast)',
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: 'var(--space-6)', overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
};
