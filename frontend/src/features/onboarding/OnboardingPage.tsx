import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ArrowLeft, BookOpen, Check } from 'lucide-react';
import { Button } from '../../components/ui/Button.js';
import { Input } from '../../components/ui/Input.js';
import { Textarea } from '../../components/ui/Textarea.js';
import { Select } from '../../components/ui/Select.js';
import { SkillBadge } from '../../components/ui/SkillBadge.js';
import { api } from '../../services/apiClient.js';

export const OnboardingPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [bio, setBio] = useState('');
  const [teachSkills, setTeachSkills] = useState<Array<{ name: string; level: 'beginner' | 'intermediate' | 'advanced' }>>([]);
  const [learnSkills, setLearnSkills] = useState<Array<{ name: string; level: 'beginner' | 'intermediate' | 'advanced' }>>([]);
  const [newTeachSkill, setNewTeachSkill] = useState('');
  const [newTeachLevel, setNewTeachLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [newLearnSkill, setNewLearnSkill] = useState('');
  const [newLearnLevel, setNewLearnLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAddTeachSkill = () => {
    if (!newTeachSkill.trim()) return;
    if (teachSkills.some((s) => s.name.toLowerCase() === newTeachSkill.trim().toLowerCase())) return;
    setTeachSkills([...teachSkills, { name: newTeachSkill.trim(), level: newTeachLevel }]);
    setNewTeachSkill('');
  };

  const handleAddLearnSkill = () => {
    if (!newLearnSkill.trim()) return;
    if (learnSkills.some((s) => s.name.toLowerCase() === newLearnSkill.trim().toLowerCase())) return;
    setLearnSkills([...learnSkills, { name: newLearnSkill.trim(), level: newLearnLevel }]);
    setNewLearnSkill('');
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      if (bio.trim()) {
        await api.patch('/members/me', { bio: bio.trim() });
      }

      for (const s of teachSkills) {
        await api.post('/members/me/skills', {
          name: s.name,
          intent: 'teach',
          level: s.level,
        });
      }

      for (const s of learnSkills) {
        await api.post('/members/me/skills', {
          name: s.name,
          intent: 'learn',
          level: s.level,
        });
      }

      navigate('/app');
    } catch (err) {
      console.error(err);
      navigate('/app');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: 'var(--space-8) var(--space-4)' }}>
      {/* Stepper Header per design.md §10.3 */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-jade-700)' }}>
            Studio Setup Wizard
          </div>
          <div style={{ fontSize: '0.8125rem', fontWeight: 650, color: 'var(--color-muted)' }}>
            Step {step} of 3
          </div>
        </div>

        {/* Visual Progress Track */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-2)' }}>
          <div style={{ height: '4px', borderRadius: 'var(--radius-pill)', backgroundColor: step >= 1 ? 'var(--color-jade-700)' : 'var(--color-line)' }} />
          <div style={{ height: '4px', borderRadius: 'var(--radius-pill)', backgroundColor: step >= 2 ? 'var(--color-jade-700)' : 'var(--color-line)' }} />
          <div style={{ height: '4px', borderRadius: 'var(--radius-pill)', backgroundColor: step >= 3 ? 'var(--color-jade-700)' : 'var(--color-line)' }} />
        </div>
      </div>

      <div className="paper-card" style={{ padding: 'var(--space-8) var(--space-10)' }}>
        {step === 1 && (
          <div>
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <h1
                style={{
                  fontSize: '1.75rem',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  color: 'var(--color-forest-950)',
                  letterSpacing: '-0.02em',
                  marginBottom: 'var(--space-1)',
                }}
              >
                Introduce yourself to the studio
              </h1>
              <p style={{ fontSize: '0.9375rem', color: 'var(--color-ink-soft)' }}>
                Share a brief introduction so potential learning partners understand your background and learning style.
              </p>
            </div>

            <Textarea
              label="Bio & Background (optional)"
              placeholder="e.g. Software engineer with 5 years of experience looking to learn conversational Spanish and explore UI design systems."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={500}
              style={{ minHeight: '130px' }}
              helperText="You can always revise your bio later in Account Settings."
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-8)' }}>
              <Button size="lg" variant="primary" onClick={() => setStep(2)}>
                Next: Skills you can teach <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--color-jade-700)',
                  backgroundColor: 'var(--color-jade-100)',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-pill)',
                  marginBottom: 'var(--space-2)',
                }}
              >
                Jade Role
              </div>
              <h1
                style={{
                  fontSize: '1.75rem',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  color: 'var(--color-forest-950)',
                  letterSpacing: '-0.02em',
                  marginBottom: 'var(--space-1)',
                }}
              >
                Skills you can teach
              </h1>
              <p style={{ fontSize: '0.9375rem', color: 'var(--color-ink-soft)' }}>
                Add skills you feel confident sharing with peers in 1-on-1 collaborative sessions.
              </p>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(220, 237, 230, 0.25)',
                border: '1px solid rgba(52, 135, 119, 0.25)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-5)',
                marginBottom: 'var(--space-6)',
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', alignItems: 'flex-end' }}>
                <div style={{ flex: '1 1 240px' }}>
                  <Input
                    label="Skill name"
                    placeholder="e.g. Python, Figma, Photography, Data Analysis"
                    value={newTeachSkill}
                    onChange={(e) => setNewTeachSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTeachSkill())}
                  />
                </div>
                <div style={{ width: '160px' }}>
                  <Select
                    label="Proficiency level"
                    value={newTeachLevel}
                    onChange={(e: any) => setNewTeachLevel(e.target.value)}
                    options={[
                      { value: 'intermediate', label: 'Intermediate' },
                      { value: 'advanced', label: 'Advanced' },
                      { value: 'beginner', label: 'Beginner' },
                    ]}
                  />
                </div>
                <Button type="button" variant="secondary" onClick={handleAddTeachSkill}>
                  + Add skill
                </Button>
              </div>

              {teachSkills.length > 0 ? (
                <div style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid rgba(52, 135, 119, 0.2)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-jade-700)', marginBottom: 'var(--space-2)' }}>
                    Added Teaching Skills ({teachSkills.length})
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                    {teachSkills.map((s, idx) => (
                      <SkillBadge
                        key={idx}
                        name={s.name}
                        intent="teach"
                        level={s.level}
                        onRemove={() => setTeachSkills(teachSkills.filter((_, i) => i !== idx))}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-8)' }}>
              <Button variant="secondary" onClick={() => setStep(1)}>
                <ArrowLeft size={16} /> Back
              </Button>
              <Button size="lg" variant="primary" onClick={() => setStep(3)}>
                Next: Learning goals <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--color-clay-600)',
                  backgroundColor: 'var(--color-clay-100)',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-pill)',
                  marginBottom: 'var(--space-2)',
                }}
              >
                Clay Role
              </div>
              <h1
                style={{
                  fontSize: '1.75rem',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  color: 'var(--color-forest-950)',
                  letterSpacing: '-0.02em',
                  marginBottom: 'var(--space-1)',
                }}
              >
                Skills you want to learn
              </h1>
              <p style={{ fontSize: '0.9375rem', color: 'var(--color-ink-soft)' }}>
                What topics, languages, or tools are you currently seeking to explore?
              </p>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(246, 229, 222, 0.25)',
                border: '1px solid rgba(201, 111, 85, 0.25)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-5)',
                marginBottom: 'var(--space-6)',
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', alignItems: 'flex-end' }}>
                <div style={{ flex: '1 1 240px' }}>
                  <Input
                    label="Skill name"
                    placeholder="e.g. JavaScript, Public Speaking, Guitar, Spanish"
                    value={newLearnSkill}
                    onChange={(e) => setNewLearnSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLearnSkill())}
                  />
                </div>
                <div style={{ width: '160px' }}>
                  <Select
                    label="Current experience"
                    value={newLearnLevel}
                    onChange={(e: any) => setNewLearnLevel(e.target.value)}
                    options={[
                      { value: 'beginner', label: 'Beginner' },
                      { value: 'intermediate', label: 'Intermediate' },
                      { value: 'advanced', label: 'Advanced' },
                    ]}
                  />
                </div>
                <Button type="button" variant="secondary" onClick={handleAddLearnSkill}>
                  + Add goal
                </Button>
              </div>

              {learnSkills.length > 0 ? (
                <div style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid rgba(201, 111, 85, 0.2)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-clay-600)', marginBottom: 'var(--space-2)' }}>
                    Added Learning Goals ({learnSkills.length})
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                    {learnSkills.map((s, idx) => (
                      <SkillBadge
                        key={idx}
                        name={s.name}
                        intent="learn"
                        level={s.level}
                        onRemove={() => setLearnSkills(learnSkills.filter((_, i) => i !== idx))}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-8)' }}>
              <Button variant="secondary" onClick={() => setStep(2)}>
                <ArrowLeft size={16} /> Back
              </Button>
              <Button size="lg" variant="primary" onClick={handleFinish} isLoading={loading}>
                Complete setup & view matches <Sparkles size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
