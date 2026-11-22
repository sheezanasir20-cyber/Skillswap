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
            backgroundColor: 'var(--color-paper-warm)',
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
        {/* Decorative Ember Noir Header Banner */}
        <div
          style={{
            height: '140px',
            background: 'var(--gradient-sidebar)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle warm ember ambient glow */}
          <div
            style={{
              position: 'absolute',
              top: '-30px',
              right: '-30px',
              width: '240px',
              height: '240px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(208, 0, 0, 0.28) 0%, rgba(232, 93, 4, 0.12) 50%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Profile Details Container */}
        <div style={{ padding: '0 var(--space-8) var(--space-8) var(--space-8)', position: 'relative', zIndex: 10 }}>
          {/* Avatar and Primary Actions Row */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: 'var(--space-4)',
              marginTop: '-48px',
              marginBottom: 'var(--space-4)',
              position: 'relative',
              zIndex: 11,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-4)' }}>
              <div
                style={{
                  padding: '4px',
                  backgroundColor: 'var(--color-surface)',
                  borderRadius: '50%',
                  boxShadow: '0 8px 24px rgba(3, 7, 30, 0.22)',
                  display: 'inline-block',
                  position: 'relative',
                  zIndex: 12,
                }}
              >
                <Avatar name={member.displayName} avatarUrl={member.avatarUrl} size={92} />
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
                    backgroundColor: 'rgba(208, 0, 0, 0.08)',
                    color: 'var(--color-crimson-600)',
                    border: '1px solid rgba(208, 0, 0, 0.25)',
                  }}
                >
                  <CheckCircle2 size={16} /> Request Sent
                </div>
              ) : (
                <Button variant="primary" onClick={handleSendConnectionRequest} isLoading={sendingRequest}>
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
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  color: 'var(--color-muted)',
                  padding: '9px 12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  transition: 'background-color 0.15s ease',
                  backgroundColor: 'var(--color-surface)',
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
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.625rem',
                  fontWeight: 700,
                  color: 'var(--color-ink-950)',
                }}
              >
                {member.displayName}
              </h1>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '0.75rem',
                  fontWeight: 650,
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor:
                    (member as any).role === 'admin'
                      ? 'rgba(250, 163, 7, 0.16)'
                      : (member as any).role === 'moderator'
                      ? 'rgba(232, 93, 4, 0.14)'
                      : 'rgba(106, 4, 15, 0.08)',
                  color:
                    (member as any).role === 'admin'
                      ? '#b35300'
                      : (member as any).role === 'moderator'
                      ? 'var(--color-crimson-700)'
                      : 'var(--color-burgundy-800)',
                  border:
                    (member as any).role === 'admin'
                      ? '1px solid rgba(250, 163, 7, 0.35)'
                      : (member as any).role === 'moderator'
                      ? '1px solid rgba(232, 93, 4, 0.3)'
                      : '1px solid rgba(106, 4, 15, 0.18)',
                }}
              >
                <ShieldCheck size={13} />
                {(member as any).role === 'admin'
                  ? 'Platform Administrator'
                  : (member as any).role === 'moderator'
                  ? 'Staff Moderator'
                  : 'Verified Community Member'}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'var(--space-4)',
                fontSize: '0.8125rem',
                color: 'var(--color-muted)',
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
                    color: 'var(--color-ink-950)',
                    fontWeight: 600,
                  }}
                >
                  <Star size={14} fill="#FFBA08" color="#FFBA08" /> {member.averageRating} Rating
                </span>
              ) : null}
            </div>
          </div>

          {feedbackMessage && !requestSent ? (
            <div
              style={{
                marginTop: 'var(--space-4)',
                padding: 'var(--space-3) var(--space-4)',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(208, 0, 0, 0.08)',
                color: 'var(--color-crimson-600)',
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
                backgroundColor: 'rgba(3, 7, 30, 0.03)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-line)',
              }}
            >
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: 'var(--color-muted)',
                  marginBottom: 'var(--space-2)',
                }}
              >
                About {member.displayName}
              </div>
              <p style={{ fontSize: '0.9375rem', color: 'var(--color-ink-950)', lineHeight: 1.65, margin: 0 }}>
                {member.bio}
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Skills Inventory: Split 2-Column Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
        {/* Teaching Skills (Burgundy) */}
        <div
          className="paper-card"
          style={{
            padding: 'var(--space-6)',
            borderTop: '3px solid var(--color-burgundy-800)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-4)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            <div>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  color: 'var(--color-burgundy-800)',
                  margin: 0,
                }}
              >
                Skills Offered to Teach
              </h2>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginTop: '2px' }}>
                Areas of expertise available for exchange
              </div>
            </div>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 650,
                padding: '3px 10px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'rgba(106, 4, 15, 0.08)',
                color: 'var(--color-burgundy-800)',
                border: '1px solid rgba(106, 4, 15, 0.2)',
                whiteSpace: 'nowrap',
              }}
            >
              {teachSkills.length} {teachSkills.length === 1 ? 'skill' : 'skills'}
            </span>
          </div>

          {teachSkills.length === 0 ? (
            <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', margin: 0 }}>
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

        {/* Learning Skills (Crimson) */}
        <div
          className="paper-card"
          style={{
            padding: 'var(--space-6)',
            borderTop: '3px solid var(--color-crimson-600)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-4)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            <div>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  color: 'var(--color-crimson-600)',
                  margin: 0,
                }}
              >
                Skills Desired to Learn
              </h2>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginTop: '2px' }}>
                Topics actively seeking reciprocal mentorship
              </div>
            </div>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 650,
                padding: '3px 10px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'rgba(232, 93, 4, 0.08)',
                color: 'var(--color-crimson-600)',
                border: '1px solid rgba(232, 93, 4, 0.2)',
                whiteSpace: 'nowrap',
              }}
            >
              {learnSkills.length} {learnSkills.length === 1 ? 'skill' : 'skills'}
            </span>
          </div>

          {learnSkills.length === 0 ? (
            <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', margin: 0 }}>
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
      <div
        className="paper-card"
        style={{
          padding: 'var(--space-6)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-6)',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-ink-950)' }}>
              Verified Post-Session Feedback ({reviews.length})
            </h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', marginTop: '2px' }}>
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
                backgroundColor: 'rgba(250, 163, 7, 0.12)',
                color: 'var(--color-ink-950)',
                fontWeight: 700,
                fontSize: '0.9375rem',
              }}
            >
              <Star size={16} fill="#FFBA08" color="#FFBA08" />
              {member.averageRating} / 5.0
            </div>
          ) : null}
        </div>

        {reviews.length === 0 ? (
          <div
            style={{
              padding: 'var(--space-8) var(--space-4)',
              textAlign: 'center',
              backgroundColor: 'rgba(3, 7, 30, 0.03)',
              borderRadius: 'var(--radius-sm)',
              border: '1px dashed var(--color-line)',
            }}
          >
            <Star size={24} style={{ color: '#FFBA08', opacity: 0.6, marginBottom: 'var(--space-2)' }} />
            <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', margin: 0 }}>
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
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(3, 7, 30, 0.03)',
                  border: '1px solid var(--color-line)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--color-ink-950)' }}>
                    {r.reviewer?.displayName || 'Learning Partner'}
                  </div>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < r.rating ? '#FFBA08' : 'none'}
                        color={i < r.rating ? '#FFBA08' : 'var(--color-line)'}
                      />
                    ))}
                  </div>
                </div>
                {r.body ? (
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-ink-soft)', lineHeight: 1.55, margin: 0 }}>
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
