import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Shield, KeyRound } from 'lucide-react';
import { Button } from '../../components/ui/Button.js';
import { Input } from '../../components/ui/Input.js';
import { BrandLogo } from '../../components/ui/BrandLogo.js';
import { api } from '../../services/apiClient.js';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/auth/forgot-password', { email });
    } catch {
      // Per SECURITY.md, generic response prevents account enumeration
    } finally {
      setSubmitted(true);
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 72px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-8) var(--space-4)',
      }}
    >
      <div
        className="paper-card"
        style={{
          width: '100%',
          maxWidth: '880px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          overflow: 'hidden',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-modal)',
        }}
      >
        {/* Left: Form Area */}
        <div style={{ padding: 'var(--space-10) var(--space-8)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <h1
              style={{
                fontSize: '1.75rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                color: 'var(--color-ink-950)',
                letterSpacing: '-0.02em',
                marginBottom: 'var(--space-1)',
              }}
            >
              Reset your password
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)' }}>
              Enter your registered email to receive recovery instructions.
            </p>
          </div>

          {submitted ? (
            <div
              style={{
                padding: 'var(--space-5)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(250, 163, 7, 0.1)',
                border: '1px solid rgba(250, 163, 7, 0.3)',
                display: 'flex',
                gap: 'var(--space-3)',
                alignItems: 'flex-start',
                marginBottom: 'var(--space-6)',
              }}
            >
              <CheckCircle2 size={20} color="var(--color-amber-500)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: 700, color: 'var(--color-ink-950)', fontSize: '0.9375rem' }}>
                  Check your inbox
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-ink-soft)', marginTop: '4px', lineHeight: 1.5 }}>
                  If an account with this email address exists, password reset instructions have been dispatched.
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <Input
                label="Email address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
              <Button type="submit" size="lg" variant="primary" isLoading={loading} style={{ marginTop: 'var(--space-2)' }}>
                Send reset link
              </Button>
            </form>
          )}

          <div style={{ marginTop: 'var(--space-6)', textAlign: 'center' }}>
            <Link
              to="/login"
              style={{
                fontSize: '0.875rem',
                fontWeight: 650,
                color: 'var(--color-crimson-600)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
              }}
            >
              <ArrowLeft size={15} /> Return to sign in
            </Link>
          </div>
        </div>

        {/* Right: Brand Panel */}
        <div
          style={{
            background: 'var(--gradient-sidebar)',
            padding: 'var(--space-10) var(--space-8)',
            color: 'var(--color-white)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <BrandLogo variant="dark" to="/" size="sm" />

          <div style={{ margin: 'var(--space-8) 0' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 'var(--space-4)',
              }}
            >
              <KeyRound size={20} color="var(--color-amber-400)" />
            </div>
            <h2 style={{ fontSize: '1.375rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-white)', marginBottom: 'var(--space-2)' }}>
              Account Security First
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.6 }}>
              Reset tokens are time-delimited and securely signed with timing-safe verification to protect your learning community identity.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)' }}>
            <Shield size={14} color="var(--color-gold-400)" />
            Cryptographically signed recovery tokens
          </div>
        </div>
      </div>
    </div>
  );
};
