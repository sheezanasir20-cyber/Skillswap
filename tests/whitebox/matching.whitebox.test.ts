import { describe, it, expect } from 'vitest';
import { MatchingEngine } from '../../backend/src/modules/matching/matching.engine.js';
import { UserEntity, UserSkillEntity, AvailabilityEntity } from '../../backend/src/services/db.js';

describe('White-Box Testing: Matching Engine Algorithm & MC/DC Branches', () => {
  const baseRequester: UserEntity = {
    id: 'req-1',
    email: 'requester@example.com',
    passwordHash: 'hash',
    displayName: 'Requester',
    bio: 'Experienced software developer interested in learning Spanish.',
    avatarUrl: 'https://example.com/avatar.jpg',
    timezone: 'UTC',
    role: 'member',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLoginAt: new Date(),
  };

  const baseCandidate: UserEntity = {
    id: 'cand-1',
    email: 'candidate@example.com',
    passwordHash: 'hash',
    displayName: 'Candidate Sam',
    bio: 'Native Spanish speaker looking to learn web development.',
    avatarUrl: 'https://example.com/sam.jpg',
    timezone: 'UTC',
    role: 'member',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLoginAt: new Date(),
  };

  const skillJS: UserSkillEntity = {
    id: 's1',
    userId: 'req-1',
    skillId: 'skill-js',
    intent: 'teach',
    level: 'advanced',
    createdAt: new Date(),
    skill: { id: 'skill-js', name: 'JavaScript', isActive: true, createdAt: new Date() },
  };

  const skillSpanish: UserSkillEntity = {
    id: 's2',
    userId: 'req-1',
    skillId: 'skill-spanish',
    intent: 'learn',
    level: 'beginner',
    createdAt: new Date(),
    skill: { id: 'skill-spanish', name: 'Spanish', isActive: true, createdAt: new Date() },
  };

  const candTeachSpanish: UserSkillEntity = {
    id: 's3',
    userId: 'cand-1',
    skillId: 'skill-spanish',
    intent: 'teach',
    level: 'advanced',
    createdAt: new Date(),
    skill: { id: 'skill-spanish', name: 'Spanish', isActive: true, createdAt: new Date() },
  };

  const candLearnJS: UserSkillEntity = {
    id: 's4',
    userId: 'cand-1',
    skillId: 'skill-js',
    intent: 'learn',
    level: 'beginner',
    createdAt: new Date(),
    skill: { id: 'skill-js', name: 'JavaScript', isActive: true, createdAt: new Date() },
  };

  describe('1. Reciprocal Skill Overlap Calculations', () => {
    it('calculates full reciprocal match with high score and mutual explanation', () => {
      const requesterSkills = [skillJS, skillSpanish];
      const candidateSkills = [candTeachSpanish, candLearnJS];

      const result = MatchingEngine.calculateMatch(
        baseRequester,
        requesterSkills,
        [],
        baseCandidate,
        candidateSkills,
        []
      );

      expect(result.reciprocalScore).toBeGreaterThanOrEqual(30);
      expect(result.totalScore).toBeGreaterThanOrEqual(50);
      expect(result.reciprocalTeachSkills).toContain('JavaScript');
      expect(result.reciprocalLearnSkills).toContain('Spanish');
      expect(result.explanation).toContain('You can teach JavaScript, and Candidate Sam wants to learn it');
      expect(result.explanation).toContain('Candidate Sam can teach Spanish, which is on your learning list');
    });

    it('calculates partial one-way match when candidate teaches but does not want requester skill', () => {
      const requesterSkills = [skillSpanish]; // Requester only wants Spanish
      const candidateSkills = [candTeachSpanish]; // Candidate teaches Spanish, wants nothing requester offers

      const result = MatchingEngine.calculateMatch(
        baseRequester,
        requesterSkills,
        [],
        baseCandidate,
        candidateSkills,
        []
      );

      expect(result.reciprocalScore).toBe(20);
      expect(result.explanation).toContain('One-way partial match');
      expect(result.explanation).toContain('Candidate Sam can teach Spanish');
    });

    it('calculates partial one-way match when requester teaches but candidate has no skill requester wants', () => {
      const requesterSkills = [skillJS];
      const candidateSkills = [candLearnJS];

      const result = MatchingEngine.calculateMatch(
        baseRequester,
        requesterSkills,
        [],
        baseCandidate,
        candidateSkills,
        []
      );

      expect(result.reciprocalScore).toBe(20);
      expect(result.explanation).toContain('One-way partial match');
      expect(result.explanation).toContain('You can teach JavaScript');
    });

    it('scores 0 reciprocal points when there is no skill overlap', () => {
      const skillPiano: UserSkillEntity = {
        id: 'sp',
        userId: 'cand-1',
        skillId: 'piano',
        intent: 'teach',
        level: 'advanced',
        createdAt: new Date(),
        skill: { id: 'piano', name: 'Piano', isActive: true, createdAt: new Date() },
      };

      const result = MatchingEngine.calculateMatch(
        baseRequester,
        [skillJS], // teaches JS
        [],
        baseCandidate,
        [skillPiano], // teaches Piano
        []
      );

      expect(result.reciprocalScore).toBe(0);
      expect(result.explanation).toBe('No overlapping skills currently.');
    });
  });

  describe('2. Availability Overlap Loops & Boundaries', () => {
    it('tests zero overlapping days', () => {
      const rAvail: AvailabilityEntity[] = [
        { id: '1', userId: 'req-1', weekday: 1, startMinute: 600, endMinute: 720, timezone: 'UTC', createdAt: new Date(), updatedAt: new Date() },
      ];
      const cAvail: AvailabilityEntity[] = [
        { id: '2', userId: 'cand-1', weekday: 2, startMinute: 600, endMinute: 720, timezone: 'UTC', createdAt: new Date(), updatedAt: new Date() },
      ];

      const result = MatchingEngine.calculateMatch(
        baseRequester,
        [skillJS, skillSpanish],
        rAvail,
        baseCandidate,
        [candTeachSpanish, candLearnJS],
        cAvail
      );

      expect(result.availabilityScore).toBe(0);
    });

    it('tests 1 overlapping day (10 points)', () => {
      const rAvail: AvailabilityEntity[] = [
        { id: '1', userId: 'req-1', weekday: 1, startMinute: 600, endMinute: 720, timezone: 'UTC', createdAt: new Date(), updatedAt: new Date() },
      ];
      const cAvail: AvailabilityEntity[] = [
        { id: '2', userId: 'cand-1', weekday: 1, startMinute: 650, endMinute: 800, timezone: 'UTC', createdAt: new Date(), updatedAt: new Date() },
      ];

      const result = MatchingEngine.calculateMatch(
        baseRequester,
        [skillJS, skillSpanish],
        rAvail,
        baseCandidate,
        [candTeachSpanish, candLearnJS],
        cAvail
      );

      expect(result.availabilityScore).toBe(10);
    });

    it('tests 2 overlapping days (15 points)', () => {
      const rAvail: AvailabilityEntity[] = [
        { id: '1', userId: 'req-1', weekday: 1, startMinute: 600, endMinute: 720, timezone: 'UTC', createdAt: new Date(), updatedAt: new Date() },
        { id: '2', userId: 'req-1', weekday: 3, startMinute: 600, endMinute: 720, timezone: 'UTC', createdAt: new Date(), updatedAt: new Date() },
      ];
      const cAvail: AvailabilityEntity[] = [
        { id: '3', userId: 'cand-1', weekday: 1, startMinute: 600, endMinute: 720, timezone: 'UTC', createdAt: new Date(), updatedAt: new Date() },
        { id: '4', userId: 'cand-1', weekday: 3, startMinute: 600, endMinute: 720, timezone: 'UTC', createdAt: new Date(), updatedAt: new Date() },
      ];

      const result = MatchingEngine.calculateMatch(
        baseRequester,
        [skillJS, skillSpanish],
        rAvail,
        baseCandidate,
        [candTeachSpanish, candLearnJS],
        cAvail
      );

      expect(result.availabilityScore).toBe(15);
    });

    it('tests 3 or more overlapping days (20 points max)', () => {
      const rAvail: AvailabilityEntity[] = [
        { id: '1', userId: 'req-1', weekday: 1, startMinute: 600, endMinute: 720, timezone: 'UTC', createdAt: new Date(), updatedAt: new Date() },
        { id: '2', userId: 'req-1', weekday: 2, startMinute: 600, endMinute: 720, timezone: 'UTC', createdAt: new Date(), updatedAt: new Date() },
        { id: '3', userId: 'req-1', weekday: 3, startMinute: 600, endMinute: 720, timezone: 'UTC', createdAt: new Date(), updatedAt: new Date() },
      ];
      const cAvail: AvailabilityEntity[] = [
        { id: '4', userId: 'cand-1', weekday: 1, startMinute: 600, endMinute: 720, timezone: 'UTC', createdAt: new Date(), updatedAt: new Date() },
        { id: '5', userId: 'cand-1', weekday: 2, startMinute: 600, endMinute: 720, timezone: 'UTC', createdAt: new Date(), updatedAt: new Date() },
        { id: '6', userId: 'cand-1', weekday: 3, startMinute: 600, endMinute: 720, timezone: 'UTC', createdAt: new Date(), updatedAt: new Date() },
      ];

      const result = MatchingEngine.calculateMatch(
        baseRequester,
        [skillJS, skillSpanish],
        rAvail,
        baseCandidate,
        [candTeachSpanish, candLearnJS],
        cAvail
      );

      expect(result.availabilityScore).toBe(20);
    });

    it('tests empty availability collection fallback (5 points)', () => {
      const result = MatchingEngine.calculateMatch(
        baseRequester,
        [skillJS, skillSpanish],
        [],
        baseCandidate,
        [candTeachSpanish, candLearnJS],
        []
      );

      expect(result.availabilityScore).toBe(5);
    });
  });

  describe('3. Profile Completeness and Recent Activity Conditions', () => {
    it('scores completeness based on bio, avatar, and timezone', () => {
      const completeCandidate: UserEntity = {
        ...baseCandidate,
        bio: 'This is a detailed bio that is well over twenty characters long.',
        avatarUrl: 'https://avatar.url/sam.png',
        timezone: 'UTC',
      };

      const result = MatchingEngine.calculateMatch(
        baseRequester,
        [skillJS, skillSpanish],
        [],
        completeCandidate,
        [candTeachSpanish, candLearnJS],
        []
      );

      expect(result.completenessScore).toBe(5); // 2 + 2 + 1
    });

    it('scores activity based on lastLoginAt within 7 days (5 points)', () => {
      const recentLoginCandidate: UserEntity = {
        ...baseCandidate,
        lastLoginAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      };

      const result = MatchingEngine.calculateMatch(
        baseRequester,
        [skillJS, skillSpanish],
        [],
        recentLoginCandidate,
        [candTeachSpanish, candLearnJS],
        []
      );

      expect(result.activityScore).toBe(5);
    });

    it('scores activity based on lastLoginAt within 30 days (2 points)', () => {
      const olderLoginCandidate: UserEntity = {
        ...baseCandidate,
        lastLoginAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
      };

      const result = MatchingEngine.calculateMatch(
        baseRequester,
        [skillJS, skillSpanish],
        [],
        olderLoginCandidate,
        [candTeachSpanish, candLearnJS],
        []
      );

      expect(result.activityScore).toBe(2);
    });
  });
});
