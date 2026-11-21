import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Shield, Lock } from 'lucide-react';
import { Button } from '../../components/ui/Button.js';
import { Input } from '../../components/ui/Input.js';
import { BrandLogo } from '../../components/ui/BrandLogo.js';
import { api } from '../../services/apiClient.js';

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/reset-password', {
        token,
        newPassword,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. The link may have expired.');
    } finally {
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
              Set new password
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)' }}>
              Choose a strong password with at least 8 characters.
            </p>
          </div>

          {success ? (
            <div>
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
                    Password updated
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-ink-soft)', marginTop: '4px' }}>
                    Your password has been changed. You can now sign in with your new credentials.
                  </div>
                </div>
              </div>
              <Button size="lg" variant="primary" onClick={() => navigate('/login')} style={{ width: '100%' }}>
                Sign in now <ArrowRight size={16} />
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {error ? (
                <div
                  role="alert"
                  style={{
                    padding: 'var(--space-3) var(--space-4)',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(208, 0, 0, 0.08)',
                    border: '1px solid rgba(208, 0, 0, 0.25)',
                    color: 'var(--color-crimson-600)',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }}
                >
                  {error}
                </div>
              ) : null}

              <Input
                label="New password"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
              />

              <Input
                label="Confirm new password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
              />

              <Button type="submit" size="lg" variant="primary" isLoading={loading} style={{ marginTop: 'var(--space-2)' }}>
                Update password <ArrowRight size={16} />
              </Button>
            </form>
          )}
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
              <Lock size={20} color="var(--color-amber-400)" />
            </div>
            <h2 style={{ fontSize: '1.375rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-white)', marginBottom: 'var(--space-2)' }}>
              Protected Credentials
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.6 }}>
              Passwords are salted and hashed with PBKDF2 before storage. We never store plain text passwords.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)' }}>
            <Shield size={14} color="var(--color-gold-400)" />
            Encrypted storage and secure sessions
          </div>
        </div>
      </div>
    </div>
  );
};
