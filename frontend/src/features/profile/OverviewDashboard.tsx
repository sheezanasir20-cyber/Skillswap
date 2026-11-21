import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Users, Calendar, ArrowRight, CheckCircle2, Sparkles, BookOpen, Clock } from 'lucide-react';
import { Button } from '../../components/ui/Button.js';
import { Avatar } from '../../components/ui/Avatar.js';
import { SkillBadge } from '../../components/ui/SkillBadge.js';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner.js';
import { EmptyState } from '../../components/ui/EmptyState.js';
import { api } from '../../services/apiClient.js';
import { User, MatchCard, Session } from '../../types/index.js';

export const OverviewDashboard: React.FC = () => {
  const [profile, setProfile] = useState<User | null>(null);
  const [matches, setMatches] = useState<MatchCard[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);
  const [activeConnectionsCount, setActiveConnectionsCount] = useState<number>(0);
  const [completedSessionsCount, setCompletedSessionsCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [meRes, matchesRes, sessionsRes, connRes, completedRes]: any = await Promise.all([
          api.get('/members/me'),
          api.get('/matches'),
          api.get('/sessions?status=confirmed'),
          api.get('/connections?status=accepted').catch(() => ({ connections: [] })),
          api.get('/sessions?status=completed').catch(() => ({ sessions: [] })),
        ]);
        setProfile(meRes);
        setMatches(matchesRes.matches ? matchesRes.matches.slice(0, 4) : []);
        setUpcomingSessions(sessionsRes.sessions ? sessionsRes.sessions.slice(0, 3) : []);
        setActiveConnectionsCount(connRes.connections?.length || 0);
        setCompletedSessionsCount(completedRes.sessions?.length || 0);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading your reciprocal learning studio..." />;
  }

  const teachSkills = profile?.skills?.filter((s) => s.intent === 'teach') || [];
  const learnSkills = profile?.skills?.filter((s) => s.intent === 'learn') || [];
  const totalSkillsListed = teachSkills.length + learnSkills.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      {/* 1. Page Header per design.md §9.1 */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 'var(--space-4)',
        }}
      >
        <div>
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--color-crimson-600)',
              marginBottom: 'var(--space-1)',
            }}
          >
            Your Learning Space
          </div>
          <h1
            style={{
              fontSize: '2rem',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              color: 'var(--color-ink-950)',
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
            }}
          >
            Welcome back, {profile?.displayName || 'Member'}
          </h1>
          <p style={{ color: 'var(--color-ink-soft)', fontSize: '0.9375rem', marginTop: 'var(--space-1)' }}>
            Here is your reciprocal learning exchange activity and upcoming sessions.
          </p>
        </div>
        <Button variant="primary" onClick={() => navigate('/app/discover')}>
          <Compass size={17} /> Discover partners
        </Button>
      </div>

      {/* 2. Welcome Hero Panel per design.md §9.2 */}
      <div
        style={{
          background: 'var(--gradient-brand)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-8) var(--space-10)',
          color: 'var(--color-white)',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-card)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
        }}
      >
        {/* Subtle decorative background motif */}
        <div
          style={{
            position: 'absolute',
            right: '-30px',
            top: '-40px',
            opacity: 0.1,
            pointerEvents: 'none',
          }}
        >
          <svg width="260" height="260" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="45" stroke="#FFF" strokeWidth="3" />
            <path d="M25 50 C25 35, 50 35, 50 50 C50 65, 75 65, 75 50" stroke="#FFF" strokeWidth="5" />
            <path d="M75 50 C75 35, 50 35, 50 50 C50 65, 25 65, 25 50" stroke="#FFBA08" strokeWidth="4" strokeDasharray="3 4" />
          </svg>
        </div>

        <div style={{ maxWidth: '620px', position: 'relative', zIndex: 2 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              fontSize: '0.6875rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--color-amber-400)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '4px 10px',
              borderRadius: 'var(--radius-pill)',
              marginBottom: 'var(--space-3)',
            }}
          >
            <Sparkles size={12} color="var(--color-gold-400)" />
            Your Skills, In Motion
          </div>
          <h2
            style={{
              fontSize: '1.75rem',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              color: 'var(--color-white)',
              lineHeight: 1.25,
              marginBottom: 'var(--space-3)',
            }}
          >
            Share what you know. Learn what you don't.
          </h2>
          <p
            style={{
              color: 'rgba(255, 254, 252, 0.88)',
              fontSize: '0.9375rem',
              lineHeight: 1.6,
              marginBottom: 'var(--space-6)',
            }}
          >
            SkillSwap connects you directly with peers who want to trade expertise in equal, one-on-one sessions without money, subscriptions, or tutoring fees.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-4)' }}>
            <Button
              variant="secondary"
              onClick={() => navigate('/app/discover')}
              style={{
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-ink-950)',
                fontWeight: 700,
              }}
            >
              Find a match <ArrowRight size={15} />
            </Button>
            <Link
              to="/app/profile"
              style={{
                color: 'var(--color-gold-400)',
                fontWeight: 650,
                fontSize: '0.875rem',
                textDecoration: 'none',
              }}
            >
              Update your skills →
            </Link>
          </div>
        </div>
      </div>

      {/* 3. At-A-Glance Metrics Row per design.md §9.3 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-4)',
        }}
      >
        <div className="paper-card" style={{ padding: 'var(--space-5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 650, color: 'var(--color-muted)' }}>Skills Listed</span>
            <span
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'rgba(106, 4, 15, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <BookOpen size={16} color="var(--color-burgundy-800)" />
            </span>
          </div>
          <div
            style={{
              fontSize: '1.875rem',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              color: 'var(--color-ink-950)',
              marginTop: 'var(--space-2)',
            }}
          >
            {totalSkillsListed}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-ink-soft)', marginTop: 'var(--space-1)' }}>
            {teachSkills.length} teaching • {learnSkills.length} learning
          </div>
        </div>

        <div className="paper-card" style={{ padding: 'var(--space-5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 650, color: 'var(--color-muted)' }}>Active Connections</span>
            <span
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'rgba(55, 6, 23, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Users size={16} color="var(--color-wine-900)" />
            </span>
          </div>
          <div
            style={{
              fontSize: '1.875rem',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              color: 'var(--color-ink-950)',
              marginTop: 'var(--space-2)',
            }}
          >
            {activeConnectionsCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-ink-soft)', marginTop: 'var(--space-1)' }}>
            Connected peers ready to exchange
          </div>
        </div>

        <div className="paper-card" style={{ padding: 'var(--space-5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 650, color: 'var(--color-muted)' }}>Upcoming Sessions</span>
            <span
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'rgba(250, 163, 7, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Calendar size={16} color="var(--color-amber-500)" />
            </span>
          </div>
          <div
            style={{
              fontSize: '1.875rem',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              color: 'var(--color-ink-950)',
              marginTop: 'var(--space-2)',
            }}
          >
            {upcomingSessions.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-ink-soft)', marginTop: 'var(--space-1)' }}>
            Confirmed on your calendar
          </div>
        </div>

        <div className="paper-card" style={{ padding: 'var(--space-5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 650, color: 'var(--color-muted)' }}>Completed Sessions</span>
            <span
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'rgba(255, 186, 8, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CheckCircle2 size={16} color="var(--color-crimson-600)" />
            </span>
          </div>
          <div
            style={{
              fontSize: '1.875rem',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              color: 'var(--color-ink-950)',
              marginTop: 'var(--space-2)',
            }}
          >
            {completedSessionsCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-ink-soft)', marginTop: 'var(--space-1)' }}>
            Completed peer exchanges
          </div>
        </div>
      </div>

      {/* 4. Skills Overview (Split 2-Column Section) per design.md §9.4 */}
      <div className="paper-card" style={{ padding: 'var(--space-6) var(--space-8)' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-6)',
            borderBottom: '1px solid var(--color-line)',
            paddingBottom: 'var(--space-4)',
          }}
        >
          <div>
            <h2
              style={{
                fontSize: '1.25rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                color: 'var(--color-ink-950)',
              }}
            >
              Your Skills Overview
            </h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', marginTop: '2px' }}>
              Distinct visual roles: Burgundy represents knowledge you offer; Crimson & Ember represent topics you want to explore.
            </p>
          </div>
          <Link
            to="/app/profile"
            style={{
              fontSize: '0.875rem',
              fontWeight: 650,
              color: 'var(--color-crimson-600)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            Manage skills →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-8)' }}>
          {/* Left Column: Skills I Can Teach (Burgundy/Blush) */}
          <div
            style={{
              backgroundColor: 'rgba(106, 4, 15, 0.04)',
              border: '1px solid rgba(106, 4, 15, 0.16)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-5)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 'var(--space-4)',
              }}
            >
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-ink-950)' }}>
                Skills you can teach
              </div>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: 'rgba(106, 4, 15, 0.08)',
                  color: 'var(--color-burgundy-800)',
                }}
              >
                {teachSkills.length} active
              </span>
            </div>

            {teachSkills.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-4) 0' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', marginBottom: 'var(--space-3)' }}>
                  You haven't listed any skills to teach yet. Add what you know to unlock partner recommendations.
                </p>
                <Button size="sm" variant="secondary" onClick={() => navigate('/app/profile')}>
                  + Add teaching skill
                </Button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                {teachSkills.map((s) => (
                  <SkillBadge key={s.id} name={s.name} intent="teach" level={s.level} />
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Skills I Want to Learn (Crimson/Apricot) */}
          <div
            style={{
              backgroundColor: 'rgba(232, 93, 4, 0.04)',
              border: '1px solid rgba(232, 93, 4, 0.16)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-5)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 'var(--space-4)',
              }}
            >
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-ink-950)' }}>
                Skills you want to learn
              </div>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: 'rgba(232, 93, 4, 0.08)',
                  color: 'var(--color-crimson-600)',
                }}
              >
                {learnSkills.length} active
              </span>
            </div>

            {learnSkills.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-4) 0' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', marginBottom: 'var(--space-3)' }}>
                  You haven't listed any learning interests yet. Add skills to match with teachers.
                </p>
                <Button size="sm" variant="secondary" onClick={() => navigate('/app/profile')}>
                  + Add learning goal
                </Button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                {learnSkills.map((s) => (
                  <SkillBadge key={s.id} name={s.name} intent="learn" level={s.level} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. Suggested Matches with Plain-Language Explanations per design.md §9.5 */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-4)',
          }}
        >
          <div>
            <h2
              style={{
                fontSize: '1.25rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                color: 'var(--color-ink-950)',
              }}
            >
              Suggested Learning Partners
            </h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', marginTop: '2px' }}>
              Partners matching your reciprocal exchange profile with mutual teach/learn overlap.
            </p>
          </div>
          <Link
            to="/app/discover"
            style={{
              fontSize: '0.875rem',
              fontWeight: 650,
              color: 'var(--color-crimson-600)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            Explore all matches →
          </Link>
        </div>

        {matches.length === 0 ? (
          <EmptyState
            title="No reciprocal matches found yet"
            description="Add more skills to your teaching and learning lists, or expand your availability to discover compatible peers."
            actionLabel="Discover partners"
            onAction={() => navigate('/app/discover')}
          />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-4)' }}>
            {matches.map((item) => (
              <div
                key={item.member.id}
                className="paper-card"
                style={{
                  padding: 'var(--space-5)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 'var(--space-4)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                    <Avatar name={item.member.displayName} avatarUrl={item.member.avatarUrl} size={44} />
                    <div style={{ overflow: 'hidden' }}>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: '1rem',
                          color: 'var(--color-ink-950)',
                          fontFamily: 'var(--font-display)',
                        }}
                      >
                        {item.member.displayName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                        {item.member.timezone || 'UTC'}
                      </div>
                    </div>
                  </div>

                  {/* Human-written match explanation per design.md §9.5 */}
                  <div
                    style={{
                      fontSize: '0.8125rem',
                      color: 'var(--color-ink-950)',
                      backgroundColor: 'rgba(106, 4, 15, 0.05)',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      lineHeight: 1.45,
                      border: '1px solid rgba(106, 4, 15, 0.16)',
                    }}
                  >
                    {item.match.explanation}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 'var(--space-2)' }}>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => navigate(`/app/members/${item.member.id}`)}
                  >
                    View profile <ArrowRight size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. Upcoming Confirmed Sessions Agenda per design.md §9.6 */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-4)',
          }}
        >
          <div>
            <h2
              style={{
                fontSize: '1.25rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                color: 'var(--color-ink-950)',
              }}
            >
              Upcoming Confirmed Sessions
            </h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', marginTop: '2px' }}>
              Your scheduled peer sessions with confirmed time and meeting link.
            </p>
          </div>
          <Link
            to="/app/sessions"
            style={{
              fontSize: '0.875rem',
              fontWeight: 650,
              color: 'var(--color-crimson-600)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            Manage sessions →
          </Link>
        </div>

        {upcomingSessions.length === 0 ? (
          <EmptyState
            title="No confirmed sessions scheduled"
            description="Connect with a learning partner to propose a time and share knowledge in your first exchange session."
            actionLabel="Find a partner"
            onAction={() => navigate('/app/discover')}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {upcomingSessions.map((sess, idx) => {
              const dateObj = new Date(sess.startsAt);
              const isNext = idx === 0;

              return (
                <div
                  key={sess.id}
                  className="paper-card"
                  style={{
                    padding: 'var(--space-4) var(--space-6)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 'var(--space-4)',
                    backgroundColor: isNext ? 'rgba(208, 0, 0, 0.04)' : 'var(--color-paper)',
                    borderColor: isNext ? 'rgba(208, 0, 0, 0.25)' : 'var(--color-line)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                    {/* Date Block */}
                    <div
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: isNext ? 'rgba(208, 0, 0, 0.08)' : 'var(--color-paper-warm)',
                        border: '1px solid var(--color-line)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-crimson-600)' }}>
                        {dateObj.toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                      <span
                        style={{
                          fontSize: '1.25rem',
                          fontWeight: 800,
                          fontFamily: 'var(--font-display)',
                          color: 'var(--color-ink-950)',
                          lineHeight: 1,
                        }}
                      >
                        {dateObj.getDate()}
                      </span>
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-ink-950)', fontFamily: 'var(--font-display)' }}>
                          {sess.title}
                        </span>
                        {isNext ? (
                          <span
                            style={{
                              fontSize: '0.6875rem',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              padding: '2px 8px',
                              borderRadius: 'var(--radius-pill)',
                              backgroundColor: 'var(--color-crimson-600)',
                              color: 'var(--color-white)',
                            }}
                          >
                            Next Up
                          </span>
                        ) : null}
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--color-ink-soft)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>With <strong>{sess.partner.displayName}</strong></span>
                        <span>•</span>
                        <Clock size={13} color="var(--color-muted)" />
                        <span>{dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({sess.timezone})</span>
                      </div>
                    </div>
                  </div>

                  <Button size="sm" variant="secondary" onClick={() => navigate(`/app/sessions/${sess.id}`)}>
                    View details
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
