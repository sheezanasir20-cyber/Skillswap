import React, { useState, useEffect } from 'react';
import { History, Star, MessageSquare, Clock, Calendar, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button.js';
import { EmptyState } from '../../components/ui/EmptyState.js';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner.js';
import { ReviewModal } from '../reviews/ReviewModal.js';
import { api } from '../../services/apiClient.js';
import { Session } from '../../types/index.js';

export const SessionHistoryPage: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'cancelled'>('completed');
  const [reviewingSession, setReviewingSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const res: any = await api.get('/sessions');
      const all = res.sessions || [];
      const past = all.filter(
        (s: Session) => s.status === 'completed' || s.status === 'cancelled' || s.status === 'declined'
      );
      setSessions(past);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const filteredSessions = sessions.filter((s) => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'completed') return s.status === 'completed';
    return s.status === 'cancelled' || s.status === 'declined';
  });

  if (loading) {
    return <LoadingSpinner message="Loading learning archive..." />;
  }

  return (
    <div style={{ maxWidth: '1000px', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Title */}
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-crimson-600)', marginBottom: 'var(--space-1)' }}>
          Learning Archive
        </div>
        <h1
          style={{
            fontSize: '2rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            color: 'var(--color-ink-950)',
            letterSpacing: '-0.02em',
          }}
        >
          Session History
        </h1>
        <p style={{ color: 'var(--color-ink-soft)', fontSize: '0.9375rem', marginTop: 'var(--space-1)' }}>
          Review your past collaborative sessions and submit honest peer reviews to build community trust.
        </p>
      </div>

      {/* Segmented Filter Pills */}
      <div
        style={{
          display: 'inline-flex',
          backgroundColor: 'rgba(3, 7, 30, 0.06)',
          padding: '4px',
          borderRadius: 'var(--radius-pill)',
          width: 'fit-content',
        }}
      >
        <button
          type="button"
          onClick={() => setStatusFilter('completed')}
          style={{
            padding: '8px 20px',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            backgroundColor: statusFilter === 'completed' ? 'var(--color-surface)' : 'transparent',
            fontWeight: statusFilter === 'completed' ? 700 : 500,
            color: statusFilter === 'completed' ? 'var(--color-ink-950)' : 'var(--color-muted)',
            boxShadow: statusFilter === 'completed' ? 'var(--shadow-soft)' : 'none',
            cursor: 'pointer',
            fontSize: '0.875rem',
            transition: 'all var(--transition-fast)',
          }}
        >
          Completed Sessions
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('cancelled')}
          style={{
            padding: '8px 20px',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            backgroundColor: statusFilter === 'cancelled' ? 'var(--color-surface)' : 'transparent',
            fontWeight: statusFilter === 'cancelled' ? 700 : 500,
            color: statusFilter === 'cancelled' ? 'var(--color-ink-950)' : 'var(--color-muted)',
            boxShadow: statusFilter === 'cancelled' ? 'var(--shadow-soft)' : 'none',
            cursor: 'pointer',
            fontSize: '0.875rem',
            transition: 'all var(--transition-fast)',
          }}
        >
          Cancelled / Declined
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('all')}
          style={{
            padding: '8px 20px',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            backgroundColor: statusFilter === 'all' ? 'var(--color-surface)' : 'transparent',
            fontWeight: statusFilter === 'all' ? 700 : 500,
            color: statusFilter === 'all' ? 'var(--color-ink-950)' : 'var(--color-muted)',
            boxShadow: statusFilter === 'all' ? 'var(--shadow-soft)' : 'none',
            cursor: 'pointer',
            fontSize: '0.875rem',
            transition: 'all var(--transition-fast)',
          }}
        >
          All History ({sessions.length})
        </button>
      </div>

      {filteredSessions.length === 0 ? (
        <EmptyState
          title="No sessions in this archive view"
          description="Sessions you complete or cancel will appear in your history archive."
          icon={<History size={32} />}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {filteredSessions.map((session) => {
            const dateObj = new Date(session.startsAt);
            const isCompleted = session.status === 'completed';

            return (
              <div
                key={session.id}
                className="paper-card"
                style={{
                  padding: 'var(--space-5) var(--space-6)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 'var(--space-4)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)' }}>
                  {/* Date Block */}
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isCompleted ? 'rgba(250, 163, 7, 0.12)' : 'rgba(3, 7, 30, 0.05)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: isCompleted ? 'var(--color-amber-500)' : 'var(--color-muted)',
                      }}
                    >
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <h2
                        style={{
                          fontSize: '1.0625rem',
                          fontFamily: 'var(--font-display)',
                          fontWeight: 700,
                          color: 'var(--color-ink-950)',
                        }}
                      >
                        {session.title}
                      </h2>
                      <span
                        style={{
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-pill)',
                          backgroundColor: isCompleted ? 'rgba(250, 163, 7, 0.12)' : 'rgba(208, 0, 0, 0.08)',
                          color: isCompleted ? 'var(--color-amber-500)' : 'var(--color-crimson-600)',
                        }}
                      >
                        {session.status}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>With <strong>{session.partner.displayName}</strong></span>
                      <span>•</span>
                      <span>{dateObj.toLocaleDateString()} at {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  {isCompleted && !session.hasReview && (
                    <Button size="sm" variant="ember" onClick={() => setReviewingSession(session)}>
                      <Star size={14} color="#03071E" fill="#FFBA08" /> Rate & review
                    </Button>
                  )}
                  {isCompleted && session.hasReview && (
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 650,
                        color: 'var(--color-amber-500)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Star size={14} fill="#FFBA08" color="#FFBA08" /> Reviewed
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
                      <CheckCircle2 size={15} /> Review submitted
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      {reviewingSession ? (
        <ReviewModal
          isOpen={Boolean(reviewingSession)}
          onClose={() => {
            setReviewingSession(null);
            loadHistory();
          }}
          sessionId={reviewingSession.id}
          partnerName={reviewingSession.partner.displayName}
        />
      ) : null}
    </div>
  );
};
