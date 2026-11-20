import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Flag, MessageSquare, Calendar, Star, UserPlus, CheckCircle2, Globe, Clock, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button.js';
import { Avatar } from '../../components/ui/Avatar.js';
import { SkillBadge } from '../../components/ui/SkillBadge.js';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner.js';
import { ReportModal } from '../reports/ReportModal.js';
import { api } from '../../services/apiClient.js';
import { User, Review } from '../../types/index.js';

export const MemberProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [member, setMember] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [requestSent, setRequestSent] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMemberData = async () => {
      if (!id) return;
      try {
        const [memberRes, reviewsRes]: any = await Promise.all([
          api.get(`/members/${id}`),
          api.get(`/members/${id}/reviews`),
        ]);
        setMember(memberRes.member);
        setReviews(reviewsRes.reviews || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMemberData();
  }, [id]);

  const handleSendConnectionRequest = async () => {
    if (!id) return;
    setSendingRequest(true);
    setFeedbackMessage(null);
    try {
      await api.post('/connections', { recipientId: id });
      setRequestSent(true);
      setFeedbackMessage('Connection request sent.');
    } catch (err: any) {
      setFeedbackMessage(err.message || 'Unable to send connection request.');
    } finally {
      setSendingRequest(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading member profile..." />;
  }

  if (!member) {
    return (
      <div
        className="paper-card"
        style={{
          textAlign: 'center',
          padding: 'var(--space-12) var(--space-6)',
          maxWidth: '560px',
          margin: 'var(--space-8) auto',
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-parchment-200)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--space-4) auto',
            color: 'var(--color-ink-muted)',
          }}
        >
          <Flag size={24} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-ink)' }}>
          Member not found
        </h2>
        <p style={{ color: 'var(--color-ink-muted)', fontSize: '0.9375rem', marginTop: 'var(--space-2)' }}>
          This member profile is unavailable, private, or has been deactivated.
        </p>
        <Button style={{ marginTop: 'var(--space-6)' }} onClick={() => navigate('/app/discover')}>
          <ArrowLeft size={16} /> Back to Discover
        </Button>
      </div>
    );
  }

  const teachSkills = member.skills?.filter((s) => s.intent === 'teach') || [];
  const learnSkills = member.skills?.filter((s) => s.intent === 'learn') || [];

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Top Breadcrumb */}
      <div>
        <button
          type="button"
          onClick={() => navigate('/app/discover')}
          style={{
            background: 'none',
            border: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            fontSize: '0.875rem',
            color: 'var(--color-ink-muted)',
            cursor: 'pointer',
            padding: 0,
            fontWeight: 500,
            transition: 'color 0.15s ease',
          }}
        >
          <ArrowLeft size={14} /> Back to Directory
        </button>
      </div>

      {/* Hero Profile Card with Atelier Banner */}
      <div
        className="paper-card"
        style={{
          position: 'relative',
          overflow: 'hidden',
          padding: 0,
        }}
      >
        {/* Decorative Forest/Jade Header Banner */}
        <div
          style={{
            height: '110px',
            background: 'linear-gradient(135deg, #142b28 0%, #1b3934 60%, #287565 100%)',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              right: '24px',
              top: '16px',
              opacity: 0.12,
              pointerEvents: 'none',
            }}
          >
            <svg width="120" height="80" viewBox="0 0 100 60" fill="none">
              <path d="M10 50 C 30 10, 70 10, 90 50 C 70 30, 30 30, 10 50 Z" fill="#ffffff" />
            </svg>
          </div>
        </div>

        {/* Profile Details Container */}
        <div style={{ padding: '0 var(--space-8) var(--space-8) var(--space-8)' }}>
          {/* Avatar and Primary Actions Row */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: 'var(--space-4)',
              marginTop: '-44px',
              marginBottom: 'var(--space-4)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-4)' }}>
              <div
                style={{
                  padding: '3px',
                  backgroundColor: 'var(--color-paper)',
                  borderRadius: '50%',
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                <Avatar name={member.displayName} avatarUrl={member.avatarUrl} size={84} />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              {requestSent ? (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: 'var(--color-jade-100)',
                    color: 'var(--color-jade-700)',
                    border: '1px solid rgba(52, 135, 119, 0.25)',
                  }}
                >
                  <CheckCircle2 size={16} /> Request Sent
                </div>
              ) : (
                <Button onClick={handleSendConnectionRequest} isLoading={sendingRequest}>
                  <UserPlus size={16} /> Connect to Exchange
                </Button>
              )}

              <button
                type="button"
                onClick={() => setIsReportOpen(true)}
                aria-label="Report member profile"
                title="Report member profile"
                style={{
                  background: 'none',
                  border: '1px solid var(--color-line)',
                  borderRadius: 'var(--radius-control)',
                  cursor: 'pointer',
                  color: 'var(--color-ink-muted)',
                  padding: '9px 12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  transition: 'background-color 0.15s ease',
                  backgroundColor: 'var(--color-paper)',
                }}
              >
                <Flag size={14} /> Report
              </button>
            </div>
          </div>

          {/* Member Name and Identity Metadata */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
              <h1
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.625rem',
                  fontWeight: 700,
                  color: 'var(--color-ink)',
                }}
              >
                {member.displayName}
              </h1>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-tag)',
                  backgroundColor: 'var(--color-jade-100)',
                  color: 'var(--color-jade-700)',
                }}
              >
                <ShieldCheck size={12} /> Community Member
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'var(--space-4)',
                fontSize: '0.8125rem',
                color: 'var(--color-ink-muted)',
                marginTop: 'var(--space-2)',
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={14} /> Timezone: {member.timezone || 'UTC'}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={14} /> Member since {new Date(member.createdAt).getFullYear()}
              </span>
              {member.averageRating ? (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: 'var(--color-amber-600)',
                    fontWeight: 600,
                  }}
                >
                  <Star size={14} fill="var(--color-amber-600)" /> {member.averageRating} Rating
                </span>
              ) : null}
            </div>
          </div>

          {feedbackMessage && !requestSent ? (
            <div
              style={{
                marginTop: 'var(--space-4)',
                padding: 'var(--space-3) var(--space-4)',
                borderRadius: 'var(--radius-control)',
                backgroundColor: 'rgba(179, 78, 74, 0.08)',
                color: 'var(--color-danger)',
                fontSize: '0.875rem',
              }}
            >
              {feedbackMessage}
            </div>
          ) : null}

          {/* Member Bio */}
          {member.bio ? (
            <div
              style={{
                marginTop: 'var(--space-6)',
                padding: 'var(--space-4) var(--space-5)',
                backgroundColor: 'var(--color-parchment-200)',
                borderRadius: 'var(--radius-panel)',
                border: '1px solid var(--color-line-subtle)',
              }}
            >
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: 'var(--color-ink-muted)',
                  marginBottom: 'var(--space-2)',
                }}
              >
                About {member.displayName}
              </div>
              <p style={{ fontSize: '0.9375rem', color: 'var(--color-ink)', lineHeight: 1.65, margin: 0 }}>
                {member.bio}
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Skills Inventory: Split 2-Column Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'var(--space-6)' }}>
        {/* Teaching Skills (Jade) */}
        <div
          className="paper-card"
          style={{
            borderTop: '3px solid var(--color-jade-600)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-4)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.125rem',
                fontWeight: 600,
                color: 'var(--color-jade-700)',
              }}
            >
              Skills {member.displayName} Can Teach
            </h2>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--color-jade-100)',
                color: 'var(--color-jade-700)',
              }}
            >
              {teachSkills.length} listed
            </span>
          </div>

          {teachSkills.length === 0 ? (
            <p style={{ fontSize: '0.875rem', color: 'var(--color-ink-muted)' }}>
              No teaching skills listed on this profile yet.
            </p>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
              {teachSkills.map((s) => (
                <SkillBadge key={s.id} name={s.name} intent="teach" level={s.level} />
              ))}
            </div>
          )}
        </div>

        {/* Learning Skills (Clay) */}
        <div
          className="paper-card"
          style={{
            borderTop: '3px solid var(--color-clay-600)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-4)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.125rem',
                fontWeight: 600,
                color: 'var(--color-clay-600)',
              }}
            >
              Skills {member.displayName} Wants to Learn
            </h2>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'rgba(201, 111, 85, 0.12)',
                color: 'var(--color-clay-600)',
              }}
            >
              {learnSkills.length} listed
            </span>
          </div>

          {learnSkills.length === 0 ? (
            <p style={{ fontSize: '0.875rem', color: 'var(--color-ink-muted)' }}>
              No learning goals listed on this profile yet.
            </p>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
              {learnSkills.map((s) => (
                <SkillBadge key={s.id} name={s.name} intent="learn" level={s.level} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Verified Reviews Section per PRD §6 & design.md §10 */}
      <div className="paper-card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-ink)' }}>
              Verified Post-Session Feedback ({reviews.length})
            </h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-ink-muted)', marginTop: '2px' }}>
              Authentic reviews submitted exclusively by verified exchange partners after completed sessions.
            </p>
          </div>

          {member.averageRating ? (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'rgba(185, 133, 63, 0.12)',
                color: 'var(--color-amber-600)',
                fontWeight: 700,
                fontSize: '0.9375rem',
              }}
            >
              <Star size={16} fill="var(--color-amber-600)" />
              {member.averageRating} / 5.0
            </div>
          ) : null}
        </div>

        {reviews.length === 0 ? (
          <div
            style={{
              padding: 'var(--space-8) var(--space-4)',
              textAlign: 'center',
              backgroundColor: 'var(--color-parchment-200)',
              borderRadius: 'var(--radius-control)',
              border: '1px dashed var(--color-line)',
            }}
          >
            <Star size={24} style={{ color: 'var(--color-amber-600)', opacity: 0.6, marginBottom: 'var(--space-2)' }} />
            <p style={{ fontSize: '0.875rem', color: 'var(--color-ink-muted)', margin: 0 }}>
              No reviews recorded yet. Reviews can only be submitted following a completed learning session.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {reviews.map((r) => (
              <div
                key={r.id}
                style={{
                  padding: 'var(--space-4) var(--space-5)',
                  borderRadius: 'var(--radius-control)',
                  backgroundColor: 'var(--color-parchment-200)',
                  border: '1px solid var(--color-line-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--color-ink)' }}>
                    {r.reviewer?.displayName || 'Learning Partner'}
                  </div>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < r.rating ? 'var(--color-amber-600)' : 'none'}
                        color={i < r.rating ? 'var(--color-amber-600)' : 'var(--color-line)'}
                      />
                    ))}
                  </div>
                </div>
                {r.body ? (
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-ink-muted)', lineHeight: 1.55, margin: 0 }}>
                    "{r.body}"
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Report Modal */}
      {id ? (
        <ReportModal
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          targetType="profile"
          targetId={id}
          targetName={member.displayName}
        />
      ) : null}
    </div>
  );
};
