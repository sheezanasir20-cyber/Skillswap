import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Compass, Sparkles, X, ArrowRight, UserPlus } from 'lucide-react';
import { Input } from '../../components/ui/Input.js';
import { Select } from '../../components/ui/Select.js';
import { Button } from '../../components/ui/Button.js';
import { Avatar } from '../../components/ui/Avatar.js';
import { SkillBadge } from '../../components/ui/SkillBadge.js';
import { EmptyState } from '../../components/ui/EmptyState.js';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner.js';
import { api } from '../../services/apiClient.js';
import { MatchCard, User } from '../../types/index.js';

export const DiscoverPage: React.FC = () => {
  const [tab, setTab] = useState<'matches' | 'search'>('matches');
  const [matches, setMatches] = useState<MatchCard[]>([]);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [intentFilter, setIntentFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const res: any = await api.get('/matches');
      setMatches(res.matches || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res: any = await api.get('/members/search', {
        q: searchQuery,
        level: levelFilter || undefined,
        intent: intentFilter || undefined,
      });
      setSearchResults(res.members || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tab === 'matches') {
      fetchMatches();
    } else {
      handleSearch();
    }
  }, [tab]);

  const clearFilters = () => {
    setSearchQuery('');
    setLevelFilter('');
    setIntentFilter('');
    setTimeout(handleSearch, 0);
  };

  const hasActiveFilters = Boolean(searchQuery || levelFilter || intentFilter);

  return (
    <div style={{ maxWidth: '1040px', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Title */}
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-crimson-600)', marginBottom: 'var(--space-1)' }}>
          Directory & Algorithm
        </div>
        <h1
          style={{
            fontSize: '2rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            color: 'var(--color-ink-950)',
            letterSpacing: '-0.02em',
          }}
        >
          Discover Learning Partners
        </h1>
        <p style={{ color: 'var(--color-ink-soft)', fontSize: '0.9375rem', marginTop: 'var(--space-1)' }}>
          Explore reciprocal exchange matches calculated from mutual teaching and learning overlap.
        </p>
      </div>

      {/* Segmented Tab Navigation per design.md §8 */}
      <div
        style={{
          display: 'inline-flex',
          backgroundColor: 'rgba(3, 7, 30, 0.06)',
          padding: '4px',
          borderRadius: 'var(--radius-pill)',
          width: 'fit-content',
        }}
      >
        <button
          type="button"
          onClick={() => setTab('matches')}
          style={{
            padding: '8px 20px',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            backgroundColor: tab === 'matches' ? 'var(--color-surface)' : 'transparent',
            fontWeight: tab === 'matches' ? 700 : 500,
            color: tab === 'matches' ? 'var(--color-ink-950)' : 'var(--color-muted)',
            boxShadow: tab === 'matches' ? 'var(--shadow-soft)' : 'none',
            cursor: 'pointer',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            transition: 'all var(--transition-fast)',
          }}
        >
          <Sparkles size={16} color={tab === 'matches' ? 'var(--color-amber-500)' : 'currentColor'} />
          Suggested Reciprocal Matches
        </button>

        <button
          type="button"
          onClick={() => setTab('search')}
          style={{
            padding: '8px 20px',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            backgroundColor: tab === 'search' ? 'var(--color-surface)' : 'transparent',
            fontWeight: tab === 'search' ? 700 : 500,
            color: tab === 'search' ? 'var(--color-ink-950)' : 'var(--color-muted)',
            boxShadow: tab === 'search' ? 'var(--shadow-soft)' : 'none',
            cursor: 'pointer',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            transition: 'all var(--transition-fast)',
          }}
        >
          <Search size={16} />
          Explore All Members
        </button>
      </div>

      {/* Floating Filter Surface (When on Search tab) per design.md §7.5 */}
      {tab === 'search' ? (
        <div
          className="paper-card"
          style={{
            padding: 'var(--space-6)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-4)',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', alignItems: 'flex-end' }}>
            <div style={{ flex: '1 1 260px' }}>
              <Input
                label="Search by name, skill, or bio"
                placeholder="e.g. Python, UX Research, Spanish, Maya"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div style={{ width: '170px' }}>
              <Select
                label="Skill Intent"
                value={intentFilter}
                onChange={(e: any) => setIntentFilter(e.target.value)}
                options={[
                  { value: '', label: 'All intents' },
                  { value: 'teach', label: 'Can teach' },
                  { value: 'learn', label: 'Wants to learn' },
                ]}
              />
            </div>
            <div style={{ width: '170px' }}>
              <Select
                label="Experience Level"
                value={levelFilter}
                onChange={(e: any) => setLevelFilter(e.target.value)}
                options={[
                  { value: '', label: 'All levels' },
                  { value: 'beginner', label: 'Beginner' },
                  { value: 'intermediate', label: 'Intermediate' },
                  { value: 'advanced', label: 'Advanced' },
                ]}
              />
            </div>
            <Button variant="primary" onClick={handleSearch}>
              <Search size={16} /> Search
            </Button>
          </div>

          {hasActiveFilters ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', paddingTop: 'var(--space-2)' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-muted)' }}>Active filters:</span>
              <button
                type="button"
                onClick={clearFilters}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-crimson-600)',
                  fontSize: '0.8125rem',
                  fontWeight: 650,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <X size={14} /> Clear all filters
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Results content */}
      {loading ? (
        <LoadingSpinner message="Searching verified members..." />
      ) : tab === 'matches' ? (
        matches.length === 0 ? (
          <EmptyState
            title="No reciprocal matches found yet"
            description="Our matching algorithm looks for reciprocal exchanges where you teach what a partner wants to learn, and they teach what you need. Add more skills to unlock matches."
            actionLabel="Add skills to profile"
            onAction={() => navigate('/app/profile')}
            icon={<Compass size={32} />}
          />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
            {matches.map((item) => (
              <div
                key={item.member.id}
                className="paper-card"
                style={{
                  padding: 'var(--space-6)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 'var(--space-5)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>
                    <Avatar name={item.member.displayName} avatarUrl={item.member.avatarUrl} size={48} />
                    <div style={{ overflow: 'hidden' }}>
                      <h2
                        style={{
                          fontSize: '1.125rem',
                          fontFamily: 'var(--font-display)',
                          fontWeight: 700,
                          color: 'var(--color-ink-950)',
                        }}
                      >
                        {item.member.displayName}
                      </h2>
                      {item.member.bio ? (
                        <p style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', marginTop: '2px', lineClamp: 2 }}>
                          {item.member.bio}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  {/* Transparent Match Explanation per MATCHING.md §2 */}
                  <div
                    style={{
                      padding: 'var(--space-3) var(--space-4)',
                      backgroundColor: 'rgba(106, 4, 15, 0.05)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8125rem',
                      color: 'var(--color-ink-950)',
                      fontWeight: 550,
                      lineHeight: 1.45,
                      border: '1px solid rgba(106, 4, 15, 0.16)',
                      marginBottom: 'var(--space-4)',
                    }}
                  >
                    {item.match.explanation}
                  </div>

                  {/* Skills badges */}
                  {item.member.skills && item.member.skills.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                      {item.member.skills.map((s) => (
                        <SkillBadge key={s.id} name={s.name} intent={s.intent} level={s.level} />
                      ))}
                    </div>
                  ) : null}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--color-line)' }}>
                  <Button size="sm" variant="primary" onClick={() => navigate(`/app/members/${item.member.id}`)}>
                    View profile & connect <ArrowRight size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : searchResults.length === 0 ? (
        <EmptyState
          title="No members match your criteria"
          description="Try broadening your search term or clearing level and intent filters."
          actionLabel="Clear filters"
          onAction={clearFilters}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {searchResults.map((member) => (
            <div
              key={member.id}
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
                <Avatar name={member.displayName} avatarUrl={member.avatarUrl} size={46} />
                <div>
                  <h2
                    style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      fontFamily: 'var(--font-display)',
                      color: 'var(--color-ink-950)',
                    }}
                  >
                    {member.displayName}
                  </h2>
                  {member.bio ? (
                    <p style={{ fontSize: '0.8125rem', color: 'var(--color-ink-soft)', marginTop: '2px' }}>
                      {member.bio}
                    </p>
                  ) : null}
                  {member.skills && member.skills.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                      {member.skills.slice(0, 4).map((s) => (
                        <SkillBadge key={s.id} name={s.name} intent={s.intent} level={s.level} />
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>

              <Button size="sm" variant="secondary" onClick={() => navigate(`/app/members/${member.id}`)}>
                View profile <ArrowRight size={14} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
