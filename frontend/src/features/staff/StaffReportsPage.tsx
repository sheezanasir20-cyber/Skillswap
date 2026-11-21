import React, { useState, useEffect } from 'react';
import { Flag, CheckCircle, XCircle, AlertTriangle, UserX, Shield, Clock } from 'lucide-react';
import { Button } from '../../components/ui/Button.js';
import { Modal } from '../../components/ui/Modal.js';
import { Textarea } from '../../components/ui/Textarea.js';
import { EmptyState } from '../../components/ui/EmptyState.js';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner.js';
import { api } from '../../services/apiClient.js';
import { ReportItem } from '../../types/index.js';

export const StaffReportsPage: React.FC = () => {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('submitted');
  const [activeReport, setActiveReport] = useState<ReportItem | null>(null);
  const [resolutionAction, setResolutionAction] = useState<'resolved' | 'dismissed'>('resolved');
  const [resolutionNote, setResolutionNote] = useState('');
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [sanctionModalOpen, setSanctionModalOpen] = useState(false);
  const [sanctionType, setSanctionType] = useState<'warn' | 'suspend'>('warn');
  const [sanctionReason, setSanctionReason] = useState('');
  const [loading, setLoading] = useState(true);

  const loadReports = async () => {
    setLoading(true);
    try {
      const res: any = await api.get(`/staff/reports${statusFilter ? `?status=${statusFilter}` : ''}`);
      setReports(res.reports || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [statusFilter]);

  const handleResolveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReport || !resolutionNote.trim()) return;

    try {
      await api.post(`/staff/reports/${activeReport.id}/resolve`, {
        action: resolutionAction,
        resolutionNote: resolutionNote.trim(),
      });
      setActionModalOpen(false);
      setResolutionNote('');
      setActiveReport(null);
      loadReports();
    } catch (err: any) {
      alert(err.message || 'Unable to resolve report.');
    }
  };

  const handleSanctionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReport || !sanctionReason.trim()) return;

    try {
      const targetUserId =
        activeReport.targetType === 'profile'
          ? activeReport.targetId
          : activeReport.targetPreview?.senderId;

      if (!targetUserId) {
        alert('Could not determine target user ID.');
        return;
      }

      if (sanctionType === 'warn') {
        await api.post(`/staff/members/${targetUserId}/warn`, { reason: sanctionReason.trim() });
      } else {
        await api.post(`/staff/members/${targetUserId}/suspend`, { reason: sanctionReason.trim() });
      }

      setSanctionModalOpen(false);
      setSanctionReason('');
      alert(`Member has been ${sanctionType === 'warn' ? 'warned' : 'suspended'}.`);
    } catch (err: any) {
      alert(err.message || 'Action failed.');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading moderation queue..." />;
  }

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-ink-950)' }}>
          Community Moderation Queue
        </h1>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.9375rem', marginTop: 'var(--space-1)' }}>
          Review reported profiles, messages, and feedback with full audit logging and transparent dispute management.
        </p>
      </div>

      {/* Segmented Status Tabs */}
      <div
        style={{
          display: 'flex',
          gap: 'var(--space-2)',
          borderBottom: '1px solid var(--color-line)',
          paddingBottom: 'var(--space-1)',
        }}
      >
        {['submitted', 'under_review', 'resolved', 'dismissed', ''].map((st) => {
          const isActive = statusFilter === st;
          return (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              style={{
                padding: 'var(--space-2) var(--space-4)',
                background: 'none',
                border: 'none',
                borderBottom: isActive ? '3px solid var(--color-crimson-600)' : '3px solid transparent',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--color-crimson-600)' : 'var(--color-muted)',
                cursor: 'pointer',
                fontSize: '0.9375rem',
                textTransform: 'capitalize',
                transition: 'all 0.15s ease',
              }}
            >
              {st ? st.replace('_', ' ') : 'All Reports'}
            </button>
          );
        })}
      </div>

      {/* Queue Content */}
      {reports.length === 0 ? (
        <EmptyState
          title="No reports in this category"
          description="There are currently no reports matching the selected status filter."
          icon={<Flag size={36} />}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {reports.map((rep) => (
            <div
              key={rep.id}
              className="paper-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-4)',
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-pill)',
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        backgroundColor: 'rgba(250, 163, 7, 0.12)',
                        color: 'var(--color-amber-500)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {rep.targetType}
                    </span>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-ink-950)', margin: 0 }}>
                      {rep.reason}
                    </h2>
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', marginTop: '4px' }}>
                    Reported by {rep.reporter?.displayName || 'Anonymous'} ({rep.reporter?.email}) •{' '}
                    {new Date(rep.createdAt).toLocaleString()}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  {rep.status === 'submitted' || rep.status === 'under_review' ? (
                    <>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => {
                          setActiveReport(rep);
                          setResolutionAction('resolved');
                          setActionModalOpen(true);
                        }}
                      >
                        Resolve / Dismiss
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setActiveReport(rep);
                          setSanctionType('warn');
                          setSanctionModalOpen(true);
                        }}
                      >
                        Sanction Member
                      </Button>
                    </>
                  ) : (
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-pill)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        backgroundColor: rep.status === 'resolved' ? 'rgba(208, 0, 0, 0.08)' : 'rgba(3, 7, 30, 0.05)',
                        color: rep.status === 'resolved' ? 'var(--color-crimson-600)' : 'var(--color-muted)',
                        textTransform: 'capitalize',
                      }}
                    >
                      Status: {rep.status}
                    </span>
                  )}
                </div>
              </div>

              {rep.description ? (
                <div
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--color-ink-950)',
                    lineHeight: 1.55,
                    backgroundColor: 'rgba(3, 7, 30, 0.03)',
                    padding: 'var(--space-3) var(--space-4)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-line)',
                  }}
                >
                  <strong style={{ color: 'var(--color-ink-950)' }}>Reporter note:</strong> {rep.description}
                </div>
              ) : null}

              {rep.targetPreview ? (
                <div
                  style={{
                    fontSize: '0.8125rem',
                    color: 'var(--color-ink-muted)',
                    borderLeft: '3px solid var(--color-burgundy-600)',
                    paddingLeft: 'var(--space-3)',
                    backgroundColor: 'rgba(106, 4, 15, 0.04)',
                    padding: 'var(--space-2) var(--space-3)',
                    borderRadius: '0 var(--radius-control) var(--radius-control) 0',
                  }}
                >
                  <strong>Reported item preview:</strong>{' '}
                  {rep.targetType === 'profile' && `Profile: ${rep.targetPreview.displayName} (${rep.targetPreview.email})`}
                  {rep.targetType === 'message' && `Message: "${rep.targetPreview.body}"`}
                  {rep.targetType === 'review' && `Review (${rep.targetPreview.rating}★): "${rep.targetPreview.body}"`}
                </div>
              ) : null}

              {rep.resolutionNote ? (
                <div
                  style={{
                    fontSize: '0.8125rem',
                    color: 'var(--color-burgundy-700)',
                    backgroundColor: 'rgba(106, 4, 15, 0.08)',
                    padding: 'var(--space-2) var(--space-3)',
                    borderRadius: 'var(--radius-control)',
                  }}
                >
                  <strong>Moderator resolution note:</strong> {rep.resolutionNote}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {/* Resolve / Dismiss Modal */}
      {activeReport ? (
        <Modal
          isOpen={actionModalOpen}
          onClose={() => setActionModalOpen(false)}
          title="Resolve Report"
          description="Record a transparent resolution note. All actions are immutably preserved in the audit log."
        >
          <form onSubmit={handleResolveSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer', fontSize: '0.875rem' }}>
                <input
                  type="radio"
                  name="action"
                  checked={resolutionAction === 'resolved'}
                  onChange={() => setResolutionAction('resolved')}
                />
                Mark as Resolved (Action taken)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer', fontSize: '0.875rem' }}>
                <input
                  type="radio"
                  name="action"
                  checked={resolutionAction === 'dismissed'}
                  onChange={() => setResolutionAction('dismissed')}
                />
                Dismiss (No violation found)
              </label>
            </div>

            <Textarea
              label="Resolution note (required)"
              required
              placeholder="State the findings, justification, and actions taken..."
              value={resolutionNote}
              onChange={(e) => setResolutionNote(e.target.value)}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
              <Button type="button" variant="secondary" onClick={() => setActionModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit Decision</Button>
            </div>
          </form>
        </Modal>
      ) : null}

      {/* Member Sanction Modal */}
      {activeReport ? (
        <Modal
          isOpen={sanctionModalOpen}
          onClose={() => setSanctionModalOpen(false)}
          title="Sanction Member"
          description="Issue a formal warning or suspend this member's access. This administrative action will be recorded."
        >
          <form onSubmit={handleSanctionSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer', fontSize: '0.875rem' }}>
                <input
                  type="radio"
                  name="sanction"
                  checked={sanctionType === 'warn'}
                  onChange={() => setSanctionType('warn')}
                />
                Send Formal Warning
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer', fontSize: '0.875rem' }}>
                <input
                  type="radio"
                  name="sanction"
                  checked={sanctionType === 'suspend'}
                  onChange={() => setSanctionType('suspend')}
                />
                Suspend Member Account
              </label>
            </div>

            <Textarea
              label="Reason (sent to member and recorded in audit log)"
              required
              placeholder="Specify the community guideline violated..."
              value={sanctionReason}
              onChange={(e) => setSanctionReason(e.target.value)}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
              <Button type="button" variant="secondary" onClick={() => setSanctionModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant={sanctionType === 'suspend' ? 'destructive' : 'primary'}>
                Apply {sanctionType === 'warn' ? 'Warning' : 'Suspension'}
              </Button>
            </div>
          </form>
        </Modal>
      ) : null}
    </div>
  );
};
