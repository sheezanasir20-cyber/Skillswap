import React, { useState, useEffect } from 'react';
import { User, Sparkles, Plus, CheckCircle2, Shield, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button.js';
import { Input } from '../../components/ui/Input.js';
import { Textarea } from '../../components/ui/Textarea.js';
import { Select } from '../../components/ui/Select.js';
import { SkillBadge } from '../../components/ui/SkillBadge.js';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner.js';
import { api } from '../../services/apiClient.js';
import { User as UserType, UserSkill } from '../../types/index.js';

export const ProfileSettingsPage: React.FC = () => {
  const [profile, setProfile] = useState<UserType | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [timezone, setTimezone] = useState('');
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // New skill input
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillIntent, setNewSkillIntent] = useState<'teach' | 'learn'>('teach');
  const [newSkillLevel, setNewSkillLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');

  const loadProfile = async () => {
    try {
      const res: any = await api.get('/members/me');
      setProfile(res);
      setDisplayName(res.displayName || '');
      setBio(res.bio || '');
      setAvatarUrl(res.avatarUrl || '');
      setTimezone(res.timezone || 'UTC');
      setSkills(res.skills || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    try {
      await api.patch('/members/me', {
        displayName: displayName.trim(),
        bio: bio.trim() || null,
        avatarUrl: avatarUrl.trim() || null,
        timezone: timezone.trim(),
      });
      setSuccessMsg('Profile changes saved successfully.');
    } catch (err: any) {
      alert(err.message || 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    try {
      const res: any = await api.post('/members/me/skills', {
        name: newSkillName.trim(),
        intent: newSkillIntent,
        level: newSkillLevel,
      });
      setSkills((prev) => [...prev, res.skill]);
      setNewSkillName('');
    } catch (err: any) {
      alert(err.message || 'Failed to add skill.');
    }
  };

  const handleRemoveSkill = async (userSkillId: string) => {
    try {
      await api.delete(`/members/me/skills/${userSkillId}`);
      setSkills((prev) => prev.filter((s) => s.id !== userSkillId));
    } catch (err: any) {
      alert(err.message || 'Failed to delete skill.');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  const teachSkills = skills.filter((s) => s.intent === 'teach');
  const learnSkills = skills.filter((s) => s.intent === 'learn');

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      {/* Page Title */}
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-ink-950)' }}>
          Profile & Skills
        </h1>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.9375rem', marginTop: 'var(--space-1)' }}>
          Keep your public profile up to date and curate the skills you want to teach or learn.
        </p>
      </div>

      {successMsg ? (
        <div
          role="status"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: 'var(--space-3) var(--space-4)',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'rgba(208, 0, 0, 0.08)',
            color: 'var(--color-crimson-600)',
            border: '1px solid rgba(208, 0, 0, 0.25)',
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
        >
          <CheckCircle2 size={16} />
          {successMsg}
        </div>
      ) : null}

      {/* Basic Profile Info Card */}
      <form
        onSubmit={handleSaveProfile}
        className="paper-card"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-5)',
        }}
      >
        <div style={{ borderBottom: '1px solid var(--color-line)', paddingBottom: 'var(--space-3)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-ink-950)' }}>
            Public Profile Information
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', marginTop: '2px' }}>
            This information is visible to other members when browsing or scheduling sessions.
          </p>
        </div>

        <Input
          label="Display Name"
          required
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Your full or preferred name"
        />

        <Textarea
          label="Bio & Learning Philosophy"
          placeholder="Share your background, what projects you are working on, and how you prefer to learn..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={500}
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
          <Input
            label="Avatar URL (optional)"
            placeholder="https://example.com/photo.jpg"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
          />

          <Input
            label="Timezone (IANA)"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            placeholder="e.g. America/New_York, UTC, Asia/Karachi"
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
          <Button type="submit" variant="primary" isLoading={saving}>
            Save Profile Changes
          </Button>
        </div>
      </form>

      {/* Skills Management Card */}
      <div
        className="paper-card"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-6)',
        }}
      >
        <div style={{ borderBottom: '1px solid var(--color-line)', paddingBottom: 'var(--space-3)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-ink-950)' }}>
            Skill Matrix & Reciprocal Exchange
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', marginTop: '2px' }}>
            Add skills you can share with peers and skills you aspire to acquire.
          </p>
        </div>

        {/* Add Skill Form Row */}
        <form
          onSubmit={handleAddSkill}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-3)',
            alignItems: 'flex-end',
            padding: 'var(--space-4)',
            backgroundColor: 'rgba(3, 7, 30, 0.03)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-line)',
          }}
        >
          <div style={{ flex: '1 1 200px' }}>
            <Input
              label="Skill Name"
              placeholder="e.g. Python, UX Research, Spanish"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
            />
          </div>

          <div style={{ width: '150px' }}>
            <Select
              label="Intent"
              value={newSkillIntent}
              onChange={(e: any) => setNewSkillIntent(e.target.value)}
              options={[
                { value: 'teach', label: 'Can teach' },
                { value: 'learn', label: 'Want to learn' },
              ]}
            />
          </div>

          <div style={{ width: '150px' }}>
            <Select
              label="Proficiency Level"
              value={newSkillLevel}
              onChange={(e: any) => setNewSkillLevel(e.target.value)}
              options={[
                { value: 'beginner', label: 'Beginner' },
                { value: 'intermediate', label: 'Intermediate' },
                { value: 'advanced', label: 'Advanced' },
              ]}
            />
          </div>

          <Button type="submit" variant="secondary">
            + Add to Matrix
          </Button>
        </form>

        {/* Split Teach / Learn Display */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
          {/* Teach Skills */}
          <div
            style={{
              padding: 'var(--space-4)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(106, 4, 15, 0.04)',
              border: '1px solid rgba(106, 4, 15, 0.16)',
            }}
          >
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-burgundy-800)', marginBottom: 'var(--space-3)' }}>
              Skills You Can Teach ({teachSkills.length})
            </div>
            {teachSkills.length === 0 ? (
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-muted)' }}>No teaching skills listed.</p>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                {teachSkills.map((s) => (
                  <SkillBadge
                    key={s.id}
                    name={s.name}
                    intent="teach"
                    level={s.level}
                    onRemove={() => handleRemoveSkill(s.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Learn Skills */}
          <div
            style={{
              padding: 'var(--space-4)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(232, 93, 4, 0.04)',
              border: '1px solid rgba(232, 93, 4, 0.16)',
            }}
          >
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-crimson-600)', marginBottom: 'var(--space-3)' }}>
              Skills You Want to Learn ({learnSkills.length})
            </div>
            {learnSkills.length === 0 ? (
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-muted)' }}>No learning goals listed.</p>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                {learnSkills.map((s) => (
                  <SkillBadge
                    key={s.id}
                    name={s.name}
                    intent="learn"
                    level={s.level}
                    onRemove={() => handleRemoveSkill(s.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
