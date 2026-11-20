import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, MessageSquare, Calendar, UserCheck, Clock, ArrowRight, Shield } from 'lucide-react';
import { Button } from '../../components/ui/Button.js';
import { Avatar } from '../../components/ui/Avatar.js';
import { EmptyState } from '../../components/ui/EmptyState.js';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner.js';
import { api } from '../../services/apiClient.js';
import { Connection } from '../../types/index.js';

export const ConnectionsPage: React.FC = () => {
  const [incoming, setIncoming] = useState<Connection[]>([]);
  const [outgoing, setOutgoing] = useState<Connection[]>([]);
  const [accepted, setAccepted] = useState<Connection[]>([]);
  const [activeTab, setActiveTab] = useState<'accepted' | 'pending'>('accepted');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadConnections = async () => {
    setLoading(true);
    try {
      const res: any = await api.get('/connections');
      setIncoming(res.connections?.incoming || []);
      setOutgoing(res.connections?.outgoing || []);
      setAccepted(res.connections?.accepted || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConnections();
  }, []);

  const handleAccept = async (id: string) => {
    try {
      await api.post(`/connections/${id}/accept`);
      loadConnections();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await api.post(`/connections/${id}/reject`);
      loadConnections();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await api.post(`/connections/${id}/cancel`);
      loadConnections();
    } catch (err) {
      console.error(err);
    }
  };

  const pendingCount = incoming.length + outgoing.length;

  return (
    <div style={{ maxWidth: '1000px', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Title */}
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-jade-700)', marginBottom: 'var(--space-1)' }}>
          Learning Network
        </div>
        <h1
          style={{
            fontSize: '2rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            color: 'var(--color-forest-950)',
            letterSpacing: '-0.02em',
          }}
        >
          Your Connections
        </h1>
        <p style={{ color: 'var(--color-ink-soft)', fontSize: '0.9375rem', marginTop: 'var(--space-1)' }}>
          Manage your verified learning partners and review pending connection requests.
        </p>
      </div>

      {/* Segmented Tab Navigation per design.md §8 */}
      <div
        style={{
          display: 'inline-flex',
          backgroundColor: 'rgba(23, 49, 43, 0.06)',
          padding: '4px',
          borderRadius: 'var(--radius-pill)',
          width: 'fit-content',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('accepted')}
          style={{
            padding: '8px 20px',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            backgroundColor: activeTab === 'accepted' ? 'var(--color-paper)' : 'transparent',
            fontWeight: activeTab === 'accepted' ? 700 : 500,
            color: activeTab === 'accepted' ? 'var(--color-forest-950)' : 'var(--color-muted)',
            boxShadow: activeTab === 'accepted' ? 'var(--shadow-soft)' : 'none',
            cursor: 'pointer',
            fontSize: '0.875rem',
            transition: 'all var(--transition-fast)',
          }}
        >
          Connected Partners ({accepted.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('pending')}
          style={{
            padding: '8px 20px',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            backgroundColor: activeTab === 'pending' ? 'var(--color-paper)' : 'transparent',
            fontWeight: activeTab === 'pending' ? 700 : 500,
            color: activeTab === 'pending' ? 'var(--color-forest-950)' : 'var(--color-muted)',
            boxShadow: activeTab === 'pending' ? 'var(--shadow-soft)' : 'none',
            cursor: 'pointer',
            fontSize: '0.875rem',
            transition: 'all var(--transition-fast)',
          }}
        >
          Pending Requests ({pendingCount})
        </button>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading your connection directory..." />
      ) : activeTab === 'accepted' ? (
        accepted.length === 0 ? (
          <EmptyState
            title="No connected partners yet"
            description="When someone accepts your connection request or you accept theirs, they will appear here so you can exchange messages and coordinate sessions."
            actionLabel="Discover partners"
            onAction={() => navigate('/app/discover')}
            icon={<UserCheck size={32} />}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {accepted.map((conn) => (
              <div
                key={conn.id}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                  <Avatar name={conn.partner.displayName} avatarUrl={conn.partner.avatarUrl} size={48} />
                  <div>
                    <h2
                      style={{
                        fontSize: '1rem',
                        fontWeight: 700,
                        fontFamily: 'var(--font-display)',
                        color: 'var(--color-forest-950)',
                      }}
                    >
                      {conn.partner.displayName}
                    </h2>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', marginTop: '2px' }}>
                      Connected since {new Date(conn.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                  {conn.conversationId ? (
                    <Button size="sm" variant="primary" onClick={() => navigate(`/app/messages/${conn.conversationId}`)}>
                      <MessageSquare size={14} /> Direct chat
                    </Button>
                  ) : null}
                  <Button size="sm" variant="secondary" onClick={() => navigate('/app/sessions')}>
                    <Calendar size={14} /> Schedule session
                  </Button>
                  <Button size="sm" variant="tertiary" onClick={() => navigate(`/app/members/${conn.partner.id}`)}>
                    Profile
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Pending Requests View */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
          {/* Incoming */}
          <div>
            <h2
              style={{
                fontSize: '1.25rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                color: 'var(--color-forest-950)',
                marginBottom: 'var(--space-3)',
              }}
            >
              Incoming Requests ({incoming.length})
            </h2>
            {incoming.length === 0 ? (
              <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)' }}>No incoming requests right now.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {incoming.map((conn) => (
                  <div
                    key={conn.id}
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                      <Avatar name={conn.partner.displayName} avatarUrl={conn.partner.avatarUrl} size={46} />
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--color-forest-950)', fontFamily: 'var(--font-display)' }}>
                          {conn.partner.displayName}
                        </div>
                        {conn.requestNote ? (
                          <div style={{ fontSize: '0.8125rem', color: 'var(--color-ink-soft)', marginTop: '2px', fontStyle: 'italic' }}>
                            "{conn.requestNote}"
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <Button size="sm" variant="primary" onClick={() => handleAccept(conn.id)}>
                        <Check size={14} /> Accept connection
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => handleReject(conn.id)}>
                        <X size={14} /> Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Outgoing */}
          <div>
            <h2
              style={{
                fontSize: '1.25rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                color: 'var(--color-forest-950)',
                marginBottom: 'var(--space-3)',
              }}
            >
              Outgoing Requests ({outgoing.length})
            </h2>
            {outgoing.length === 0 ? (
              <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)' }}>No pending outgoing requests.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {outgoing.map((conn) => (
                  <div
                    key={conn.id}
                    className="paper-card"
                    style={{
                      padding: 'var(--space-4) var(--space-6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <Avatar name={conn.partner.displayName} avatarUrl={conn.partner.avatarUrl} size={40} />
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--color-forest-950)' }}>{conn.partner.displayName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                          Request dispatched on {new Date(conn.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="secondary" onClick={() => handleCancel(conn.id)}>
                      Cancel request
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
