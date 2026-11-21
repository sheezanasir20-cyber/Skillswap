import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, XCircle, Clock, Plus, ExternalLink, ArrowRight, Video } from 'lucide-react';
import { Button } from '../../components/ui/Button.js';
import { Modal } from '../../components/ui/Modal.js';
import { Input } from '../../components/ui/Input.js';
import { Textarea } from '../../components/ui/Textarea.js';
import { Select } from '../../components/ui/Select.js';
import { EmptyState } from '../../components/ui/EmptyState.js';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner.js';
import { ReviewModal } from '../reviews/ReviewModal.js';
import { api } from '../../services/apiClient.js';
import { Session, Connection } from '../../types/index.js';

export const SessionsPage: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [isProposeOpen, setIsProposeOpen] = useState(false);
  const [reviewSession, setReviewSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Propose form state
  const [connectionId, setConnectionId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');
  const [meetingUrl, setMeetingUrl] = useState('');
  const [proposing, setProposing] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [sessRes, connRes]: any = await Promise.all([
        api.get('/sessions'),
        api.get('/connections'),
      ]);
      setSessions(sessRes.sessions || []);
      setConnections(connRes.connections?.accepted || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePropose = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setProposing(true);

    try {
      await api.post('/sessions', {
        connectionId,
        title: title.trim(),
        description: description.trim() || undefined,
        startsAt: new Date(startsAt).toISOString(),
        endsAt: new Date(endsAt).toISOString(),
        externalMeetingUrl: meetingUrl.trim() || undefined,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      });
      setIsProposeOpen(false);
      setTitle('');
      setDescription('');
      setMeetingUrl('');
      loadData();
    } catch (err: any) {
      setFormError(err.message || 'Unable to propose session.');
    } finally {
      setProposing(false);
    }
  };

  const handleConfirm = async (id: string) => {
    try {
      await api.post(`/sessions/${id}/confirm`);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDecline = async (id: string) => {
    try {
      await api.post(`/sessions/${id}/decline`);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await api.post(`/sessions/${id}/cancel`);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await api.post(`/sessions/${id}/complete`);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading sessions..." />;
  }

  const activeSessions = sessions.filter((s) => s.status === 'proposed' || s.status === 'confirmed');

  return (
    <div style={{ maxWidth: '1000px', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)' }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-crimson-600)', marginBottom: 'var(--space-1)' }}>
            Calendar & Scheduling
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
            Scheduled Sessions
          </h1>
          <p style={{ color: 'var(--color-ink-soft)', fontSize: '0.9375rem', marginTop: 'var(--space-1)' }}>
            Plan, confirm, and coordinate upcoming collaborative 1-on-1 learning exchanges.
          </p>
        </div>

        <Button variant="primary" onClick={() => setIsProposeOpen(true)}>
          <Plus size={16} /> Propose new session
        </Button>
      </div>

      {/* Active Sessions List per design.md §10.8 */}
      {activeSessions.length === 0 ? (
        <EmptyState
          title="No upcoming sessions scheduled"
          description="Propose a session with one of your connected partners to begin exchanging skills."
          actionLabel="Propose a session"
          onAction={() => setIsProposeOpen(true)}
          icon={<Calendar size={32} />}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {activeSessions.map((session, idx) => {
            const dateObj = new Date(session.startsAt);
            const isConfirmed = session.status === 'confirmed';

            return (
              <div
                key={session.id}
                className="paper-card"
                style={{
                  padding: 'var(--space-6)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 'var(--space-6)',
                  backgroundColor: isConfirmed ? 'var(--color-paper)' : 'rgba(255, 254, 252, 0.85)',
                  borderLeft: isConfirmed ? '4px solid var(--color-crimson-600)' : '4px solid var(--color-amber-500)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)' }}>
                  {/* Date Block */}
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isConfirmed ? 'rgba(208, 0, 0, 0.08)' : 'rgba(250, 163, 7, 0.12)',
                      border: '1px solid var(--color-line)',
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
                        color: isConfirmed ? 'var(--color-crimson-600)' : 'var(--color-amber-500)',
                      }}
                    >
                      {dateObj.toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span
                      style={{
                        fontSize: '1.375rem',
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
                          fontSize: '1.125rem',
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
                          backgroundColor: isConfirmed ? 'rgba(208, 0, 0, 0.08)' : 'rgba(250, 163, 7, 0.12)',
                          color: isConfirmed ? 'var(--color-crimson-600)' : 'var(--color-amber-500)',
                          border: `1px solid ${isConfirmed ? 'rgba(208, 0, 0, 0.25)' : 'rgba(250, 163, 7, 0.3)'}`,
                        }}
                      >
                        {session.status}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-ink-soft)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>Partner: <strong>{session.partner.displayName}</strong></span>
                      <span>•</span>
                      <Clock size={13} color="var(--color-muted)" />
                      <span>{dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({session.timezone})</span>
                    </div>

                    {session.description ? (
                      <p style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', marginTop: '6px', maxWidth: '500px' }}>
                        {session.description}
                      </p>
                    ) : null}

                    {session.externalMeetingUrl ? (
                      <div style={{ marginTop: 'var(--space-2)' }}>
                        <a
                          href={session.externalMeetingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.8125rem',
                            fontWeight: 650,
                            color: 'var(--color-crimson-600)',
                          }}
                        >
                          <Video size={14} /> Join Meeting Room <ExternalLink size={12} />
                        </a>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Contextual actions */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                  {session.status === 'proposed' && (
                    <>
                      <Button size="sm" variant="primary" onClick={() => handleConfirm(session.id)}>
                        <CheckCircle2 size={14} /> Accept proposal
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => handleDecline(session.id)}>
                        Decline
                      </Button>
                    </>
                  )}

                  {session.status === 'confirmed' && (
                    <>
                      <Button size="sm" variant="primary" onClick={() => handleComplete(session.id)}>
                        Mark completed
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => handleCancel(session.id)}>
                        Cancel session
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Propose Session Modal */}
      <Modal
        isOpen={isProposeOpen}
        onClose={() => setIsProposeOpen(false)}
        title="Propose a Learning Session"
        description="Choose a connected partner and agree on a mutually convenient time."
      >
        <form onSubmit={handlePropose} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {formError ? (
            <div
              role="alert"
              style={{
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-danger-soft)',
                color: 'var(--color-danger)',
                fontSize: '0.875rem',
              }}
            >
              {formError}
            </div>
          ) : null}

          <Select
            label="Learning Partner"
            required
            value={connectionId}
            onChange={(e: any) => setConnectionId(e.target.value)}
            options={[
              { value: '', label: 'Select a connected partner...' },
              ...connections.map((c) => ({
                value: c.id,
                label: c.partner.displayName,
              })),
            ]}
          />

          <Input
            label="Session topic / title"
            required
            placeholder="e.g. Intro to React Hooks & State Management"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Textarea
            label="Agenda or preparation notes (optional)"
            placeholder="e.g. We will walk through setting up Vite and practicing component design."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
            <Input
              label="Start date & time"
              type="datetime-local"
              required
              value={startsAt}
              onChange={(e) => setStartsAt(e.target.value)}
            />
            <Input
              label="End date & time"
              type="datetime-local"
              required
              value={endsAt}
              onChange={(e) => setEndsAt(e.target.value)}
            />
          </div>

          <Input
            label="External meeting link (optional)"
            type="url"
            placeholder="https://meet.google.com/xyz or Zoom link"
            value={meetingUrl}
            onChange={(e) => setMeetingUrl(e.target.value)}
            helperText="You can also share or update this link later in chat."
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
            <Button type="button" variant="secondary" onClick={() => setIsProposeOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={proposing} disabled={!connectionId || !title || !startsAt || !endsAt}>
              Send session proposal <ArrowRight size={15} />
            </Button>
          </div>
        </form>
      </Modal>

      {/* Review Modal if triggered */}
      {reviewSession ? (
        <ReviewModal
          isOpen={Boolean(reviewSession)}
          onClose={() => {
            setReviewSession(null);
            loadData();
          }}
          sessionId={reviewSession.id}
          partnerName={reviewSession.partner.displayName}
        />
      ) : null}
    </div>
  );
};
