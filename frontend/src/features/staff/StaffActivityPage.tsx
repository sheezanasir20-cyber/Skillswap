import React, { useState, useEffect } from 'react';
import { Activity, Search, ShieldCheck } from 'lucide-react';
import { Input } from '../../components/ui/Input.js';
import { Button } from '../../components/ui/Button.js';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner.js';
import { EmptyState } from '../../components/ui/EmptyState.js';
import { api } from '../../services/apiClient.js';

export const StaffActivityPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [actionFilter, setActionFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const loadActivity = async () => {
    setLoading(true);
    try {
      const res: any = await api.get('/staff/activity', {
        action: actionFilter || undefined,
        limit: 50,
      });
      setLogs(res.activity || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivity();
  }, []);

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-ink-950)' }}>
          Staff Activity & Audit Trail
        </h1>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.9375rem', marginTop: 'var(--space-1)' }}>
          Immutable log of all administrative actions, warnings, suspensions, and moderation resolutions.
        </p>
      </div>

      {/* Filter toolbar */}
      <div
        className="paper-card"
        style={{
          display: 'flex',
          gap: 'var(--space-3)',
          alignItems: 'flex-end',
          padding: 'var(--space-4)',
        }}
      >
        <div style={{ flex: 1 }}>
          <Input
            label="Filter by Action Type"
            placeholder="e.g. REPORT_RESOLVED, MEMBER_WARNED, ADMIN_MEMBER_UPDATED"
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadActivity()}
          />
        </div>
        <Button variant="primary" onClick={loadActivity} style={{ height: '42px' }}>
          <Search size={16} /> Filter Logs
        </Button>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading audit trail records..." />
      ) : logs.length === 0 ? (
        <EmptyState
          title="No audit records found"
          description="Actions performed by staff members and administrators will be logged here automatically."
          icon={<Activity size={36} />}
        />
      ) : (
        <div
          className="paper-card"
          style={{
            padding: 0,
            overflow: 'hidden',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-line)', backgroundColor: 'rgba(3, 7, 30, 0.03)' }}>
                  <th style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, color: 'var(--color-ink-950)' }}>Timestamp</th>
                  <th style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, color: 'var(--color-ink-950)' }}>Action</th>
                  <th style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, color: 'var(--color-ink-950)' }}>Staff Actor</th>
                  <th style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, color: 'var(--color-ink-950)' }}>Target</th>
                  <th style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, color: 'var(--color-ink-950)' }}>Reason / Notes</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid var(--color-line)' }}>
                    <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-muted)', whiteSpace: 'nowrap' }}>
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-pill)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          backgroundColor: 'rgba(3, 7, 30, 0.05)',
                          color: 'var(--color-ink-950)',
                          fontFamily: 'monospace',
                        }}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, color: 'var(--color-ink-950)' }}>
                      {log.actor?.displayName || log.actorId}
                    </td>
                    <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-muted)', fontFamily: 'monospace', fontSize: '0.8125rem' }}>
                      {log.targetType}:{log.targetId}
                    </td>
                    <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-ink-950)' }}>
                      {log.reason || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
