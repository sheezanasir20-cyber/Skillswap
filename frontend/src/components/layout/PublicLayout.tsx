import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button.js';
import { BrandLogo } from '../ui/BrandLogo.js';

export const PublicLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="app-canvas" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Public Header with Glassmorphism */}
      <header
        className="glass-surface"
        style={{
          borderBottom: '1px solid rgba(228, 228, 217, 0.75)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          className="container"
          style={{
            height: '72px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Brand Lockup */}
          <BrandLogo variant="light" to="/" size="md" />

          {/* Desktop Navigation */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: 'var(--space-8)',
            }}
            className="desktop-nav"
          >
            <Link
              to="/how-it-works"
              style={{
                color: 'var(--color-ink-soft)',
                fontWeight: 600,
                fontSize: '0.9375rem',
                textDecoration: 'none',
              }}
            >
              How it works
            </Link>
            <Link
              to="/login"
              style={{
                color: 'var(--color-forest-950)',
                fontWeight: 650,
                fontSize: '0.9375rem',
                textDecoration: 'none',
              }}
            >
              Sign in
            </Link>
            <Button size="sm" variant="primary" onClick={() => navigate('/register')}>
              Join SkillSwap <ArrowRight size={14} />
            </Button>
          </nav>

          {/* Mobile hamburger button */}
          <button
            type="button"
            className="mobile-toggle"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 'var(--space-2)',
              color: 'var(--color-forest-950)',
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen ? (
          <div
            className="glass-surface-strong"
            style={{
              borderBottom: '1px solid var(--color-line)',
              padding: 'var(--space-6)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-4)',
            }}
          >
            <Link
              to="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                padding: 'var(--space-2) 0',
                color: 'var(--color-forest-950)',
                fontWeight: 600,
                fontSize: '1rem',
                textDecoration: 'none',
              }}
            >
              How it works
            </Link>
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                padding: 'var(--space-2) 0',
                color: 'var(--color-forest-950)',
                fontWeight: 600,
                fontSize: '1rem',
                textDecoration: 'none',
              }}
            >
              Sign in
            </Link>
            <Button
              variant="primary"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/register');
              }}
            >
              Join SkillSwap <ArrowRight size={15} />
            </Button>
          </div>
        ) : null}
      </header>

      {/* Main content */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* Refined Public Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--color-line)',
          backgroundColor: 'var(--color-paper)',
          padding: 'var(--space-12) 0',
          marginTop: 'auto',
          boxShadow: '0 -4px 20px rgba(20, 43, 40, 0.03)',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-8)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 'var(--space-6)',
            }}
          >
            <div>
              <BrandLogo variant="light" to="/" size="sm" showTagline />
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-8)', fontSize: '0.875rem', fontWeight: 550 }}>
              <Link to="/how-it-works" style={{ color: 'var(--color-ink-soft)', textDecoration: 'none' }}>
                How It Works
              </Link>
              <Link to="/terms" style={{ color: 'var(--color-ink-soft)', textDecoration: 'none' }}>
                Terms of Service
              </Link>
              <Link to="/privacy" style={{ color: 'var(--color-ink-soft)', textDecoration: 'none' }}>
                Privacy Policy
              </Link>
            </div>
          </div>

          <div
            style={{
              paddingTop: 'var(--space-6)',
              borderTop: '1px solid rgba(228, 228, 217, 0.7)',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              fontSize: '0.8125rem',
              color: 'var(--color-muted)',
            }}
          >
            <div>
              © {new Date().getFullYear()} SkillSwap. Built on mutual curiosity and reciprocal exchange.
            </div>
            <div>
              Zero fees • Zero monetization • Peer-to-peer learning
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </div>
  );
};
