import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button.js';
import { Input } from '../../components/ui/Input.js';
import { BrandLogo } from '../../components/ui/BrandLogo.js';
import { api } from '../../services/apiClient.js';

export const RegisterPage: React.FC = () => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setLoading(true);

    try {
      const res: any = await api.post('/auth/register', {
        displayName,
        email,
        password,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      });
      if (res.token) {
        localStorage.setItem('skillswap_token', res.token);
      }
      navigate('/app/onboarding');
    } catch (err: any) {
      if (err.fields) {
        setFieldErrors(err.fields);
      }
      setError(err.message || 'Registration failed. Please check the form.');
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
          maxWidth: '960px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          overflow: 'hidden',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-modal)',
        }}
      >
        {/* Left: Warm Form Area */}
        <div style={{ padding: 'var(--space-10) var(--space-8)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <h1
              style={{
                fontSize: '1.75rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                color: 'var(--color-forest-950)',
                letterSpacing: '-0.02em',
                marginBottom: 'var(--space-1)',
              }}
            >
              Create your account
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)' }}>
              Join our non-monetary community of peer teachers and learners.
            </p>
          </div>

          {error ? (
            <div
              role="alert"
              style={{
                padding: 'var(--space-3) var(--space-4)',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-danger-soft)',
                border: '1px solid rgba(179, 78, 74, 0.3)',
                color: 'var(--color-danger)',
                fontSize: '0.875rem',
                fontWeight: 500,
                marginBottom: 'var(--space-4)',
              }}
            >
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <Input
              label="Full or display name"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              error={fieldErrors.displayName}
              placeholder="e.g. Maya Chen"
            />

            <Input
              label="Email address"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={fieldErrors.email}
              placeholder="you@example.com"
              helperText="Your email remains private and is never shared publicly."
            />

            <Input
              label="Password"
              type="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={fieldErrors.password}
              placeholder="At least 8 characters"
            />

            <Button
              type="submit"
              size="lg"
              variant="primary"
              isLoading={loading}
              style={{ marginTop: 'var(--space-3)' }}
            >
              Create account <ArrowRight size={16} />
            </Button>
          </form>

          <div
            style={{
              marginTop: 'var(--space-8)',
              paddingTop: 'var(--space-6)',
              borderTop: '1px solid var(--color-line)',
              textAlign: 'center',
              fontSize: '0.875rem',
              color: 'var(--color-muted)',
            }}
          >
            Already have an account?{' '}
            <Link to="/login" style={{ fontWeight: 700, color: 'var(--color-jade-700)', textDecoration: 'none' }}>
              Sign in
            </Link>
          </div>
        </div>

        {/* Right: Deep Evergreen Brand Panel */}
        <div
          style={{
            background: 'var(--gradient-sidebar)',
            padding: 'var(--space-10) var(--space-8)',
            color: 'var(--color-white)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle line motif background */}
          <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.1, pointerEvents: 'none' }}>
            <svg width="240" height="240" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="45" stroke="#FFF" strokeWidth="4" />
              <path d="M25 50 C25 35, 50 35, 50 50 C50 65, 75 65, 75 50" stroke="#FFF" strokeWidth="5" />
            </svg>
          </div>

          <div>
            <BrandLogo variant="dark" to="/" size="sm" />
          </div>

          <div style={{ margin: 'var(--space-8) 0', position: 'relative', zIndex: 2 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                fontSize: '0.6875rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--color-jade-100)',
                marginBottom: 'var(--space-3)',
              }}
            >
              <Sparkles size={13} color="var(--color-amber-100)" />
              The Reciprocal Agreement
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                <CheckCircle2 size={18} color="var(--color-jade-100)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.875rem', lineHeight: 1.5, color: 'rgba(255, 255, 255, 0.9)' }}>
                  <strong>Equal Standing:</strong> Every member teaches and learns in reciprocal turns.
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                <CheckCircle2 size={18} color="var(--color-jade-100)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.875rem', lineHeight: 1.5, color: 'rgba(255, 255, 255, 0.9)' }}>
                  <strong>Zero Commercialization:</strong> No subscriptions, paid bookings, or platform tokens.
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                <CheckCircle2 size={18} color="var(--color-jade-100)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.875rem', lineHeight: 1.5, color: 'rgba(255, 255, 255, 0.9)' }}>
                  <strong>Verified Feedback:</strong> Transparent community reviews recorded after actual sessions.
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              fontSize: '0.75rem',
              color: 'rgba(226, 237, 230, 0.7)',
            }}
          >
            <Shield size={14} color="var(--color-jade-100)" />
            By signing up, you agree to our Terms of Service & Privacy Policy.
          </div>
        </div>
      </div>
    </div>
  );
};
