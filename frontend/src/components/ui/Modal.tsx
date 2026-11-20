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
        backgroundColor: 'rgba(20, 43, 40, 0.52)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
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
          backgroundColor: 'var(--color-paper)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid rgba(255, 255, 255, 0.75)',
          boxShadow: 'var(--shadow-modal)',
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
            backgroundColor: 'var(--color-paper)',
          }}
        >
          <div>
            <h3
              id="modal-title"
              style={{
                fontSize: '1.25rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                color: 'var(--color-forest-950)',
                letterSpacing: '-0.015em',
              }}
            >
              {title}
            </h3>
            {description ? (
              <p
                id="modal-description"
                style={{ fontSize: '0.875rem', color: 'var(--color-muted)', marginTop: '4px' }}
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
              cursor: 'pointer',
              color: 'var(--color-muted)',
              padding: 'var(--space-2)',
              borderRadius: 'var(--radius-pill)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color var(--transition-fast)',
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: 'var(--space-6)', overflowY: 'auto', flex: 1 }}>{children}</div>
      </div>
    </div>
  );
};
