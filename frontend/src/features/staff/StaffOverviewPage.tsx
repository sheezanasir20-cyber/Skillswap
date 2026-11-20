import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Flag, Users, BarChart3, Activity, ShieldCheck, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner.js';
import { Button } from '../../components/ui/Button.js';
import { api } from '../../services/apiClient.js';

export const StaffOverviewPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [pendingReports, setPendingReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadStaffData = async () => {
      try {
        const [anRes, repRes]: any = await Promise.all([
          api.get('/staff/analytics'),
          api.get('/staff/reports?status=submitted'),
        ]);
        setAnalytics(anRes.analytics);
        setPendingReports(repRes.reports || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadStaffData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading staff control center..." />;
  }

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-amber-600)', marginBottom: 'var(--space-1)' }}>
          <ShieldCheck size={18} />
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Staff Operations
          </span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.875rem', fontWeight: 700, color: 'var(--color-ink)' }}>
          Moderation & Administration
        </h1>
        <p style={{ color: 'var(--color-ink-muted)', fontSize: '0.9375rem', marginTop: 'var(--space-1)' }}>
          Monitor community health, resolve pending reports, review platform metrics, and audit actions.
        </p>
      </div>

      {/* 4 Atelier Operational Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
        {/* Pending Reports Card */}
        <div
          onClick={() => navigate('/staff/reports')}
          className="paper-card"
          style={{
            cursor: 'pointer',
            borderTop: '3px solid var(--color-amber-600)',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--color-amber-600)' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Pending Reports
            </span>
            <AlertTriangle size={18} />
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.25rem', fontWeight: 700, color: 'var(--color-ink)', marginTop: 'var(--space-2)' }}>
            {analytics?.reports?.pending || 0}
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--color-ink-muted)', marginTop: '4px' }}>
            Requires immediate moderator review
          </div>
        </div>

        {/* Total Members Card */}
        <div
          onClick={() => navigate('/staff/members')}
          className="paper-card"
          style={{
            cursor: 'pointer',
            borderTop: '3px solid var(--color-jade-600)',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--color-jade-700)' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total Members
            </span>
            <Users size={18} />
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.25rem', fontWeight: 700, color: 'var(--color-ink)', marginTop: 'var(--space-2)' }}>
            {analytics?.members?.total || 0}
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--color-ink-muted)', marginTop: '4px' }}>
            {analytics?.members?.active || 0} verified active members
          </div>
        </div>

        {/* Sessions Completed Card */}
        <div
          onClick={() => navigate('/staff/analytics')}
          className="paper-card"
          style={{
            cursor: 'pointer',
            borderTop: '3px solid var(--color-sky-700)',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--color-sky-700)' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Completed Sessions
            </span>
            <BarChart3 size={18} />
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.25rem', fontWeight: 700, color: 'var(--color-ink)', marginTop: 'var(--space-2)' }}>
            {analytics?.sessions?.completed || 0}
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--color-ink-muted)', marginTop: '4px' }}>
            {analytics?.sessions?.confirmed || 0} sessions currently scheduled
          </div>
        </div>

        {/* Audit Trail Card */}
        <div
          onClick={() => navigate('/staff/activity')}
          className="paper-card"
          style={{
            cursor: 'pointer',
            borderTop: '3px solid var(--color-forest-900)',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--color-forest-900)' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Staff Activity Log
            </span>
            <Activity size={18} />
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-ink)', marginTop: 'var(--space-3)' }}>
            Inspect Audit Trail
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--color-ink-muted)', marginTop: '4px' }}>
            Immutable administrative records
          </div>
        </div>
      </div>

      {/* Immediate Report Queue */}
      <div className="paper-card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-2)' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-ink)' }}>
              Reports Requiring Immediate Attention
            </h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-ink-muted)', marginTop: '2px' }}>
              Review user-flagged profiles, communications, and feedback submissions.
            </p>
          </div>
          <Link
            to="/staff/reports"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.875rem',
              color: 'var(--color-jade-700)',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Open Complete Queue <ArrowRight size={14} />
          </Link>
        </div>

        {pendingReports.length === 0 ? (
          <div
            style={{
              padding: 'var(--space-8)',
              textAlign: 'center',
              backgroundColor: 'var(--color-parchment-200)',
              borderRadius: 'var(--radius-control)',
              border: '1px dashed var(--color-line)',
            }}
          >
            <CheckCircle2 size={32} style={{ color: 'var(--color-jade-600)', margin: '0 auto var(--space-2) auto' }} />
            <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--color-ink)' }}>
              All reports are currently resolved!
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-ink-muted)', margin: '4px 0 0 0' }}>
              The community queue is clean. Check back later or review historical cases in the audit log.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {pendingReports.map((r) => (
              <div
                key={r.id}
                style={{
                  padding: 'var(--space-4)',
                  backgroundColor: 'var(--color-parchment-200)',
                  borderRadius: 'var(--radius-control)',
                  border: '1px solid var(--color-line-subtle)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 'var(--space-3)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-pill)',
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        backgroundColor: 'rgba(185, 133, 63, 0.15)',
                        color: 'var(--color-amber-600)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {r.targetType}
                    </span>
                    <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--color-ink)' }}>
                      {r.reason}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-ink-muted)', marginTop: '4px' }}>
                    Reported by {r.reporter?.displayName || 'Member'} on{' '}
                    {new Date(r.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <Link
                  to={`/staff/reports`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: 'var(--color-jade-700)',
                    textDecoration: 'none',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-control)',
                    backgroundColor: 'var(--color-paper)',
                    border: '1px solid var(--color-line-subtle)',
                  }}
                >
                  Review in queue <ArrowRight size={12} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
