import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Lock } from 'lucide-react';
import { Button } from '../../components/ui/Button.js';
import { Input } from '../../components/ui/Input.js';
import { BrandLogo } from '../../components/ui/BrandLogo.js';
import { api } from '../../services/apiClient.js';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res: any = await api.post('/auth/login', { email, password });
      if (res.token) {
        localStorage.setItem('skillswap_token', res.token);
      }
      navigate('/app');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
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
          maxWidth: '920px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
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
              Sign in to SkillSwap
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)' }}>
              Enter your credentials to access your reciprocal learning studio.
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
              label="Email address"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-1)' }}>
                <label style={{ fontSize: '0.8125rem', fontWeight: 650, color: 'var(--color-forest-950)' }}>
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  style={{ fontSize: '0.75rem', color: 'var(--color-jade-700)', fontWeight: 600, textDecoration: 'none' }}
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              variant="primary"
              isLoading={loading}
              style={{ marginTop: 'var(--space-3)' }}
            >
              Sign in <ArrowRight size={16} />
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
            Don't have an account yet?{' '}
            <Link to="/register" style={{ fontWeight: 700, color: 'var(--color-jade-700)', textDecoration: 'none' }}>
              Create an account
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
              Peer Knowledge Exchange
            </div>
            <blockquote
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                fontWeight: 650,
                lineHeight: 1.45,
                color: 'var(--color-white)',
                marginBottom: 'var(--space-4)',
              }}
            >
              "Teaching someone else clarifies your own thinking. Learning from a peer keeps curiosity alive."
            </blockquote>
            <div style={{ fontSize: '0.8125rem', color: 'rgba(255, 255, 255, 0.7)' }}>
              SkillSwap community ethos
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
            Zero fees • Zero tutoring monetization • Equal exchange
          </div>
        </div>
      </div>
    </div>
  );
};
