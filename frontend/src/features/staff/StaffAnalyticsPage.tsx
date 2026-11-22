import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Calendar, Star, CheckCircle, PieChart, TrendingUp } from 'lucide-react';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner.js';
import { Select } from '../../components/ui/Select.js';
import { api } from '../../services/apiClient.js';

export const StaffAnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [dateRange, setDateRange] = useState('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      try {
        const daysMap: Record<string, number> = { '7d': 7, '30d': 30, '90d': 90 };
        const res: any = await api.get('/staff/analytics', daysMap[dateRange] ? { days: daysMap[dateRange] } : undefined);
        setAnalytics(res.analytics);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, [dateRange]);

  if (loading) {
    return <LoadingSpinner message="Calculating operational platform metrics..." />;
  }

  const { members, connections, sessions, reviews, reports } = analytics || {};

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-ink-950)' }}>
            Platform Analytics & Operations
          </h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.9375rem', marginTop: 'var(--space-1)' }}>
            Real-time operational metrics derived directly from genuine database records.
          </p>
        </div>

        <div style={{ width: '180px' }}>
          <Select
            label="Date basis"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            options={[
              { value: '7d', label: 'Past 7 days' },
              { value: '30d', label: 'Past 30 days' },
              { value: '90d', label: 'Past 90 days' },
              { value: 'all', label: 'All time' },
            ]}
          />
        </div>
      </div>

      {/* Grid of 4 Atelier Metric Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
        {/* Members Metrics */}
        <div className="paper-card" style={{ borderTop: '3px solid var(--color-burgundy-800)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-burgundy-800)', marginBottom: 'var(--space-2)' }}>
            <Users size={18} />
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Members</span>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 700, color: 'var(--color-ink-950)' }}>
            {members?.total || 0}
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', marginTop: '2px' }}>
            Total registered community accounts
          </div>
          <div style={{ marginTop: 'var(--space-4)', borderTop: '1px solid var(--color-line)', paddingTop: 'var(--space-3)', fontSize: '0.8125rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-muted)' }}>Active accounts:</span>
              <strong style={{ color: 'var(--color-ink-950)' }}>{members?.active || 0}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-muted)' }}>Profile completion:</span>
              <strong style={{ color: 'var(--color-crimson-600)' }}>{members?.profileCompletionRate || 0}%</strong>
            </div>
          </div>
        </div>

        {/* Connections Metrics */}
        <div className="paper-card" style={{ borderTop: '3px solid var(--color-wine-900)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-wine-900)', marginBottom: 'var(--space-2)' }}>
            <CheckCircle size={18} />
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Connections</span>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 700, color: 'var(--color-ink-950)' }}>
            {connections?.total || 0}
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', marginTop: '2px' }}>
            Total connections initiated
          </div>
          <div style={{ marginTop: 'var(--space-4)', borderTop: '1px solid var(--color-line)', paddingTop: 'var(--space-3)', fontSize: '0.8125rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-muted)' }}>Accepted:</span>
              <strong style={{ color: 'var(--color-ink-950)' }}>{connections?.accepted || 0}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-muted)' }}>Acceptance rate:</span>
              <strong style={{ color: 'var(--color-crimson-600)' }}>{connections?.acceptanceRate || 0}%</strong>
            </div>
          </div>
        </div>

        {/* Sessions Metrics */}
        <div className="paper-card" style={{ borderTop: '3px solid var(--color-ember-600)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-ember-600)', marginBottom: 'var(--space-2)' }}>
            <Calendar size={18} />
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Learning Sessions</span>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 700, color: 'var(--color-ink-950)' }}>
            {sessions?.completed || 0}
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', marginTop: '2px' }}>
            Completed peer learning sessions
          </div>
          <div style={{ marginTop: 'var(--space-4)', borderTop: '1px solid var(--color-line)', paddingTop: 'var(--space-3)', fontSize: '0.8125rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-muted)' }}>Confirmed / scheduled:</span>
              <strong style={{ color: 'var(--color-ink-950)' }}>{sessions?.confirmed || 0}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-muted)' }}>Proposed:</span>
              <strong style={{ color: 'var(--color-amber-500)' }}>{sessions?.proposed || 0}</strong>
            </div>
          </div>
        </div>

        {/* Reviews Metrics */}
        <div className="paper-card" style={{ borderTop: '3px solid var(--color-amber-500)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-amber-500)', marginBottom: 'var(--space-2)' }}>
            <Star size={18} />
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Reviews & Ratings</span>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 700, color: 'var(--color-ink-950)' }}>
            {reviews?.averageRating || 0} ★
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', marginTop: '2px' }}>
            Average platform rating
          </div>
          <div style={{ marginTop: 'var(--space-4)', borderTop: '1px solid var(--color-line)', paddingTop: 'var(--space-3)', fontSize: '0.8125rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-muted)' }}>Verified reviews:</span>
              <strong style={{ color: 'var(--color-ink-950)' }}>{reviews?.total || 0}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-muted)' }}>Review submission rate:</span>
              <strong style={{ color: 'var(--color-amber-500)' }}>{reviews?.reviewSubmissionRate || 0}%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Visual SVG Atelier Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
        {/* Session Distribution Chart */}
        <div className="paper-card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <TrendingUp size={18} color="var(--color-crimson-600)" />
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-ink)', margin: 0 }}>
              Session Pipeline Distribution
            </h2>
          </div>
          <div style={{ padding: 'var(--space-4) 0', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {/* Completed Bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '4px' }}>
                <span style={{ fontWeight: 500, color: 'var(--color-ink)' }}>Completed</span>
                <span style={{ fontWeight: 600, color: 'var(--color-crimson-600)' }}>{sessions?.completed || 0}</span>
              </div>
              <div style={{ height: '8px', backgroundColor: 'var(--color-paper-warm)', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${Math.min(100, ((sessions?.completed || 0) / Math.max(1, (sessions?.completed || 0) + (sessions?.confirmed || 0) + (sessions?.proposed || 0))) * 100)}%`,
                    backgroundColor: 'var(--color-crimson-600)',
                    borderRadius: '4px',
                  }}
                />
              </div>
            </div>

            {/* Confirmed Bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '4px' }}>
                <span style={{ fontWeight: 500, color: 'var(--color-ink)' }}>Scheduled / Confirmed</span>
                <span style={{ fontWeight: 600, color: 'var(--color-amber-600)' }}>{sessions?.confirmed || 0}</span>
              </div>
              <div style={{ height: '8px', backgroundColor: 'var(--color-paper-warm)', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${Math.min(100, ((sessions?.confirmed || 0) / Math.max(1, (sessions?.completed || 0) + (sessions?.confirmed || 0) + (sessions?.proposed || 0))) * 100)}%`,
                    backgroundColor: 'var(--color-amber-600)',
                    borderRadius: '4px',
                  }}
                />
              </div>
            </div>

            {/* Proposed Bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '4px' }}>
                <span style={{ fontWeight: 500, color: 'var(--color-ink)' }}>Awaiting Confirmation</span>
                <span style={{ fontWeight: 600, color: 'var(--color-ember-500)' }}>{sessions?.proposed || 0}</span>
              </div>
              <div style={{ height: '8px', backgroundColor: 'var(--color-paper-warm)', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${Math.min(100, ((sessions?.proposed || 0) / Math.max(1, (sessions?.completed || 0) + (sessions?.confirmed || 0) + (sessions?.proposed || 0))) * 100)}%`,
                    backgroundColor: 'var(--color-ember-500)',
                    borderRadius: '4px',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Community Trust Breakdown */}
        <div className="paper-card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <PieChart size={18} color="var(--color-ember-500)" />
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-ink)', margin: 0 }}>
              Reciprocity & Community Health
            </h2>
          </div>
          <div style={{ padding: 'var(--space-4) 0', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {/* Reciprocal Profile Readiness */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '4px' }}>
                <span style={{ fontWeight: 500, color: 'var(--color-ink)' }}>Reciprocal Readiness (Teach & Learn)</span>
                <span style={{ fontWeight: 600, color: 'var(--color-burgundy-700)' }}>{members?.profileCompletionRate || 0}%</span>
              </div>
              <div style={{ height: '8px', backgroundColor: 'var(--color-paper-warm)', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${Math.min(100, members?.profileCompletionRate || 0)}%`,
                    backgroundColor: 'var(--color-burgundy-700)',
                    borderRadius: '4px',
                  }}
                />
              </div>
            </div>

            {/* Connection Acceptance */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '4px' }}>
                <span style={{ fontWeight: 500, color: 'var(--color-ink)' }}>Request Acceptance Rate</span>
                <span style={{ fontWeight: 600, color: 'var(--color-crimson-700)' }}>{connections?.acceptanceRate || 0}%</span>
              </div>
              <div style={{ height: '8px', backgroundColor: 'var(--color-paper-warm)', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${Math.min(100, connections?.acceptanceRate || 0)}%`,
                    backgroundColor: 'var(--color-crimson-700)',
                    borderRadius: '4px',
                  }}
                />
              </div>
            </div>

            {/* Review Participation */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '4px' }}>
                <span style={{ fontWeight: 500, color: 'var(--color-ink)' }}>Post-Session Review Rate</span>
                <span style={{ fontWeight: 600, color: 'var(--color-amber-500)' }}>{reviews?.reviewSubmissionRate || 0}%</span>
              </div>
              <div style={{ height: '8px', backgroundColor: 'var(--color-paper-warm)', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${Math.min(100, reviews?.reviewSubmissionRate || 0)}%`,
                    backgroundColor: 'var(--color-amber-500)',
                    borderRadius: '4px',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Accessible data table */}
      <div className="paper-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--color-line-subtle)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-ink)', margin: 0 }}>
            Operational Audit Matrix
          </h2>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-line)', textAlign: 'left', backgroundColor: 'var(--color-paper-warm)' }}>
                <th style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, color: 'var(--color-ink)' }}>Metric Identifier</th>
                <th style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, color: 'var(--color-ink)' }}>Current Value</th>
                <th style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, color: 'var(--color-ink)' }}>Operational Scope</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--color-line-subtle)' }}>
                <td style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, color: 'var(--color-ink)' }}>Active Directory Members</td>
                <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-crimson-600)', fontWeight: 600 }}>{members?.active || 0}</td>
                <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-ink-muted)' }}>Members eligible for search, exchange matching, and direct messaging</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--color-line-subtle)' }}>
                <td style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, color: 'var(--color-ink)' }}>Reciprocal Profile Ratio</td>
                <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-burgundy-700)', fontWeight: 600 }}>{members?.profileCompletionRate || 0}%</td>
                <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-ink-muted)' }}>Members with ≥1 teach skill and ≥1 learn skill configured</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--color-line-subtle)' }}>
                <td style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, color: 'var(--color-ink)' }}>Connection Acceptance</td>
                <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-crimson-700)', fontWeight: 600 }}>{connections?.acceptanceRate || 0}%</td>
                <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-ink-muted)' }}>Ratio of sent connection requests affirmatively accepted by recipients</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--color-line-subtle)' }}>
                <td style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, color: 'var(--color-ink)' }}>Mutual Learning Sessions</td>
                <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-sky-700)', fontWeight: 600 }}>{sessions?.completed || 0}</td>
                <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-ink-muted)' }}>Concluded exchange sessions marked completed by both participants</td>
              </tr>
              <tr>
                <td style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, color: 'var(--color-ink)' }}>Unresolved Reports</td>
                <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-amber-600)', fontWeight: 600 }}>{reports?.pending || 0}</td>
                <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-ink-muted)' }}>Open moderation tickets pending staff review</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
