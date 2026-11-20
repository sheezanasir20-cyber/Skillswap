import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Compass, Users, Calendar, Star, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/ui/Button.js';

export const HowItWorksPage: React.FC = () => {
  const navigate = useNavigate();

  const steps = [
    {
      num: '01',
      title: 'Skills and Experience Levels',
      icon: <BookOpen size={20} color="var(--color-jade-700)" />,
      bg: 'var(--color-jade-100)',
      text: 'When you create your profile, you select skills you can teach and skills you want to learn. Levels are self-assessed as Beginner, Intermediate, or Advanced. We treat levels as descriptive guidelines so you can find a partner whose expectations align with yours.',
    },
    {
      num: '02',
      title: 'Transparent Reciprocal Matching',
      icon: <Compass size={20} color="var(--color-amber-600)" />,
      bg: 'var(--color-amber-100)',
      text: 'Our matching engine evaluates mutual fit based on what you teach and what candidates want to learn. When you see a suggested match, we show you the exact reason in plain English: for example, "You can teach JavaScript, and Alex wants to learn it. Alex can teach Figma, which is on your learning list."',
    },
    {
      num: '03',
      title: 'Safe Connections and Chat',
      icon: <Users size={20} color="var(--color-sky-700)" />,
      bg: 'var(--color-sky-100)',
      text: 'Before messaging begins, members exchange connection requests. You can view a member’s public profile and decide whether to accept or decline. Only accepted connections can message each other or schedule learning sessions.',
    },
    {
      num: '04',
      title: 'Scheduling and Reminders',
      icon: <Calendar size={20} color="var(--color-clay-600)" />,
      bg: 'var(--color-clay-100)',
      text: 'Either member can propose a session date, time, and external meeting link (e.g. Google Meet, Zoom). The session is confirmed once the other member accepts. SkillSwap automatically schedules reminders 24 hours and 1 hour before the start time.',
    },
    {
      num: '05',
      title: 'Reviews and Community Trust',
      icon: <Star size={20} color="var(--color-amber-600)" />,
      bg: 'var(--color-amber-100)',
      text: 'Once a session has taken place, both members can submit a rating and written feedback. Reviews help highlight dependable, helpful members across the community and cannot be fabricated without a real session record.',
    },
  ];

  return (
    <div className="container" style={{ maxWidth: '840px', padding: 'var(--space-16) var(--space-6)' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
        <div
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: 'var(--color-jade-700)',
            letterSpacing: '0.08em',
            marginBottom: 'var(--space-2)',
          }}
        >
          Principles & Process
        </div>
        <h1
          style={{
            fontSize: '2.5rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            color: 'var(--color-forest-950)',
            letterSpacing: '-0.025em',
            marginBottom: 'var(--space-4)',
          }}
        >
          How SkillSwap Works
        </h1>
        <p style={{ fontSize: '1.0625rem', color: 'var(--color-ink-soft)', lineHeight: 1.6, maxWidth: '640px', margin: '0 auto' }}>
          SkillSwap operates on a simple principle: everyone knows something valuable, and everyone
          has something they want to learn. By exchanging knowledge peer-to-peer, high quality
          one-on-one learning becomes accessible without monetary barriers.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {steps.map((s) => (
          <div
            key={s.num}
            className="paper-card"
            style={{
              padding: 'var(--space-6) var(--space-8)',
              display: 'flex',
              gap: 'var(--space-6)',
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: s.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {s.icon}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-muted)', letterSpacing: '0.08em', marginBottom: '2px' }}>
                Step {s.num}
              </div>
              <h2
                style={{
                  fontSize: '1.25rem',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  color: 'var(--color-forest-950)',
                  marginBottom: 'var(--space-2)',
                }}
              >
                {s.title}
              </h2>
              <p style={{ fontSize: '0.9375rem', color: 'var(--color-ink-soft)', lineHeight: 1.6 }}>
                {s.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 'var(--space-12)',
          padding: 'var(--space-8)',
          backgroundColor: 'var(--color-paper)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-line)',
          boxShadow: 'var(--shadow-card)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-3)',
        }}
      >
        <ShieldCheck size={28} color="var(--color-jade-700)" />
        <h3 style={{ fontSize: '1.375rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-forest-950)' }}>
          Ready to trade your knowledge?
        </h3>
        <p style={{ fontSize: '0.9375rem', color: 'var(--color-ink-soft)', maxWidth: '480px' }}>
          Create your profile in two minutes and start discovering compatible learning partners today.
        </p>
        <div style={{ marginTop: 'var(--space-2)' }}>
          <Button size="lg" variant="primary" onClick={() => navigate('/register')}>
            Create your profile <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};
