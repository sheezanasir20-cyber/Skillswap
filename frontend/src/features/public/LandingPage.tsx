import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Shield, Sparkles, BookOpen, MessageSquare, Calendar, Star } from 'lucide-react';
import { Button } from '../../components/ui/Button.js';
import { Avatar } from '../../components/ui/Avatar.js';
import { SkillBadge } from '../../components/ui/SkillBadge.js';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* 1. Hero Section - Warm Editorial Composition per design.md §10.1 */}
      <section
        style={{
          padding: 'var(--space-20) 0 var(--space-16)',
          borderBottom: '1px solid var(--color-line)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="container" style={{ maxWidth: '1040px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-10)', alignItems: 'center' }}>
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: 'rgba(232, 93, 4, 0.1)',
                  color: 'var(--color-ember-600)',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  marginBottom: 'var(--space-4)',
                  letterSpacing: '0.02em',
                  border: '1px solid rgba(232, 93, 4, 0.25)',
                }}
              >
                <Sparkles size={14} color="var(--color-amber-500)" />
                Reciprocal Learning Community
              </div>

              <h1
                style={{
                  fontSize: '2.875rem',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  lineHeight: 1.1,
                  letterSpacing: '-0.03em',
                  color: 'var(--color-ink-950)',
                  marginBottom: 'var(--space-4)',
                }}
              >
                Learn something new.
                <br />
                <span style={{ color: 'var(--color-crimson-600)' }}>Teach what you know.</span>
              </h1>

              <p
                style={{
                  fontSize: '1.125rem',
                  lineHeight: 1.6,
                  color: 'var(--color-ink-soft)',
                  marginBottom: 'var(--space-8)',
                  maxWidth: '540px',
                }}
              >
                SkillSwap helps people exchange practical knowledge directly. No payments, no tokens,
                and no credits. Connect with a learning partner where you teach a skill you understand,
                and learn a skill you need.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                <Button size="lg" variant="primary" onClick={() => navigate('/register')}>
                  Create your profile <ArrowRight size={17} />
                </Button>
                <Button size="lg" variant="secondary" onClick={() => navigate('/how-it-works')}>
                  See how it works
                </Button>
              </div>

              {/* Honest scope note per design.md §10.1 & PRD.md §4 */}
              <div
                style={{
                  marginTop: 'var(--space-8)',
                  padding: 'var(--space-3) var(--space-4)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(255, 254, 252, 0.85)',
                  border: '1px solid var(--color-line)',
                  fontSize: '0.8125rem',
                  color: 'var(--color-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                }}
              >
                <Shield size={18} style={{ color: 'var(--color-crimson-600)', flexShrink: 0 }} />
                <span>
                  <strong>Pure Peer-to-Peer:</strong> Sessions occur via external video tools you choose (Google Meet, Zoom). SkillSwap coordinates discovery, scheduling, and reviews. No payments are ever processed.
                </span>
              </div>
            </div>

            {/* Interactive Visual Exchange Preview */}
            <div
              className="paper-card"
              style={{
                padding: 'var(--space-6)',
                position: 'relative',
                boxShadow: 'var(--shadow-card)',
                background: 'linear-gradient(145deg, #FFFFFF 0%, #FAF7F4 100%)',
              }}
            >
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'var(--color-muted)',
                  letterSpacing: '0.08em',
                  marginBottom: 'var(--space-4)',
                  textAlign: 'center',
                }}
              >
                Mutual Reciprocal Match
              </div>

              {/* Partner A */}
              <div
                style={{
                  padding: 'var(--space-4)',
                  backgroundColor: 'var(--color-paper)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-line)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                }}
              >
                <Avatar name="Elena Rostova" size={42} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-ink-950)' }}>Elena Rostova</div>
                  <div style={{ display: 'flex', gap: 'var(--space-1)', marginTop: '4px' }}>
                    <SkillBadge name="Figma Design" intent="teach" level="advanced" />
                    <SkillBadge name="Python" intent="learn" />
                  </div>
                </div>
              </div>

              {/* Loop connector */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-3) 0' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--color-burgundy-800)',
                    backgroundColor: 'rgba(106, 4, 15, 0.08)',
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-pill)',
                    border: '1px solid rgba(106, 4, 15, 0.25)',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
                    <path d="M8 16 C8 10, 16 10, 16 16 C16 22, 24 22, 24 16" stroke="var(--color-crimson-600)" strokeWidth="3" strokeLinecap="round" />
                    <path d="M24 16 C24 10, 16 10, 16 16 C16 22, 8 22, 8 16" stroke="var(--color-gold-400)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="2 3" />
                  </svg>
                  Mutual 1-to-1 Exchange
                </div>
              </div>

              {/* Partner B */}
              <div
                style={{
                  padding: 'var(--space-4)',
                  backgroundColor: 'var(--color-paper)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-line)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                }}
              >
                <Avatar name="David Chen" size={42} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-ink-950)' }}>David Chen</div>
                  <div style={{ display: 'flex', gap: 'var(--space-1)', marginTop: '4px' }}>
                    <SkillBadge name="Python" intent="teach" level="intermediate" />
                    <SkillBadge name="Figma Design" intent="learn" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 3-Step Process Section per design.md §10.1 */}
      <section style={{ padding: 'var(--space-16) 0', borderBottom: '1px solid var(--color-line)' }}>
        <div className="container" style={{ maxWidth: '1040px' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto var(--space-12)' }}>
            <h2
              style={{
                fontSize: '2rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                color: 'var(--color-ink-950)',
                letterSpacing: '-0.02em',
                marginBottom: 'var(--space-2)',
              }}
            >
              How reciprocal exchange works
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--color-ink-soft)' }}>
              A straightforward three-step model designed to cultivate high-trust, bilateral knowledge transfer.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'var(--space-6)',
            }}
          >
            <div className="paper-card" style={{ padding: 'var(--space-8)' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(106, 4, 15, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 'var(--space-4)',
                }}
              >
                <BookOpen size={22} color="var(--color-burgundy-800)" />
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-burgundy-800)', letterSpacing: '0.08em', marginBottom: 'var(--space-1)' }}>
                Step 01
              </div>
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-ink-950)', marginBottom: 'var(--space-2)' }}>
                List your skills
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-ink-soft)', lineHeight: 1.6 }}>
                Specify skills you can teach and skills you are eager to learn, along with self-assessed experience levels and weekly availability slots.
              </p>
            </div>

            <div className="paper-card" style={{ padding: 'var(--space-8)' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(250, 163, 7, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 'var(--space-4)',
                }}
              >
                <Sparkles size={22} color="var(--color-amber-500)" />
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-amber-500)', letterSpacing: '0.08em', marginBottom: 'var(--space-1)' }}>
                Step 02
              </div>
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-ink-950)', marginBottom: 'var(--space-2)' }}>
                Find your match
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-ink-soft)', lineHeight: 1.6 }}>
                Our 100-point matching engine scores mutual overlap and surfaces plain-English match rationales so you always know why someone was suggested.
              </p>
            </div>

            <div className="paper-card" style={{ padding: 'var(--space-8)' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(232, 93, 4, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 'var(--space-4)',
                }}
              >
                <Calendar size={22} color="var(--color-ember-600)" />
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-ember-600)', letterSpacing: '0.08em', marginBottom: 'var(--space-1)' }}>
                Step 03
              </div>
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-ink-950)', marginBottom: 'var(--space-2)' }}>
                Schedule & learn
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-ink-soft)', lineHeight: 1.6 }}>
                Exchange direct messages, propose a session date with automatic timezone translation, receive 24h & 1h reminders, and leave verified reviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Community Principles & Safety */}
      <section style={{ padding: 'var(--space-16) 0' }}>
        <div className="container" style={{ maxWidth: '960px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-8)', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-crimson-600)', letterSpacing: '0.08em', marginBottom: 'var(--space-2)' }}>
                Trust & Verification
              </div>
              <h2
                style={{
                  fontSize: '1.875rem',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  color: 'var(--color-ink-950)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.25,
                  marginBottom: 'var(--space-4)',
                }}
              >
                Built on safety, privacy, and accountability
              </h2>
              <p style={{ fontSize: '0.9375rem', color: 'var(--color-ink-soft)', lineHeight: 1.6, marginBottom: 'var(--space-6)' }}>
                SkillSwap maintains a high-quality community with zero financial incentives to spam, verified post-session reviews, and human staff moderation.
              </p>
              <Button variant="secondary" onClick={() => navigate('/how-it-works')}>
                Read community standards
              </Button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div className="paper-card" style={{ padding: 'var(--space-4) var(--space-5)', display: 'flex', gap: 'var(--space-3)' }}>
                <CheckCircle2 size={20} color="var(--color-success)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-ink-950)' }}>Verified Post-Session Reviews</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', marginTop: '2px' }}>
                    Ratings can only be submitted after a mutually confirmed session finishes, preventing fake testimonials.
                  </div>
                </div>
              </div>

              <div className="paper-card" style={{ padding: 'var(--space-4) var(--space-5)', display: 'flex', gap: 'var(--space-3)' }}>
                <CheckCircle2 size={20} color="var(--color-success)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-ink-950)' }}>Active Human Moderation</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', marginTop: '2px' }}>
                    Staff review reported accounts, messages, and profiles with an auditable moderation pipeline.
                  </div>
                </div>
              </div>

              <div className="paper-card" style={{ padding: 'var(--space-4) var(--space-5)', display: 'flex', gap: 'var(--space-3)' }}>
                <CheckCircle2 size={20} color="var(--color-success)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-ink-950)' }}>Private Connection Boundary</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', marginTop: '2px' }}>
                    Messaging and calendar proposals are restricted strictly to approved connections.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Final CTA Banner */}
      <section style={{ padding: 'var(--space-12) 0 var(--space-20)' }}>
        <div className="container" style={{ maxWidth: '960px' }}>
          <div
            style={{
              background: 'var(--gradient-brand)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-12) var(--space-8)',
              color: 'var(--color-white)',
              textAlign: 'center',
              boxShadow: 'var(--shadow-modal)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--space-4)',
            }}
          >
            <h2
              style={{
                fontSize: '2.25rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                color: 'var(--color-white)',
                letterSpacing: '-0.025em',
              }}
            >
              Start exchanging skills today
            </h2>
            <p
              style={{
                fontSize: '1.0625rem',
                color: 'rgba(255, 255, 255, 0.85)',
                maxWidth: '560px',
                lineHeight: 1.6,
              }}
            >
              Join members who believe the best way to master a new skill is by teaching another in return.
            </p>
            <div style={{ marginTop: 'var(--space-2)' }}>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate('/register')}
                style={{
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-ink-950)',
                  fontWeight: 700,
                }}
              >
                Join SkillSwap for free <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
