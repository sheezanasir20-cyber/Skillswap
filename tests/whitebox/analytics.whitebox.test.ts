import { describe, it, expect, beforeEach } from 'vitest';
import { AnalyticsService } from '../../backend/src/modules/analytics/analytics.service.js';
import { inMemoryDb } from '../../backend/src/services/db.js';

describe('White-Box Testing: Platform Analytics Aggregation Engine', () => {
  beforeEach(() => {
    inMemoryDb.clearAll();

    // 1. Seed members: 3 active, 1 suspended
    inMemoryDb.users.set('u1', {
      id: 'u1',
      email: 'u1@test.com',
      passwordHash: 'hash',
      displayName: 'User One',
      bio: 'Complete bio here',
      avatarUrl: 'https://example.com/avatar.jpg',
      timezone: 'UTC',
      role: 'member',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    inMemoryDb.users.set('u2', {
      id: 'u2',
      email: 'u2@test.com',
      passwordHash: 'hash',
      displayName: 'User Two',
      bio: null,
      avatarUrl: null,
      timezone: 'UTC',
      role: 'member',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    inMemoryDb.users.set('u3', {
      id: 'u3',
      email: 'u3@test.com',
      passwordHash: 'hash',
      displayName: 'User Three',
      bio: 'Short bio',
      avatarUrl: null,
      timezone: 'UTC',
      role: 'member',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    inMemoryDb.users.set('u4', {
      id: 'u4',
      email: 'u4@test.com',
      passwordHash: 'hash',
      displayName: 'Suspended User',
      bio: null,
      avatarUrl: null,
      timezone: 'UTC',
      role: 'member',
      status: 'suspended',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // 2. Seed skills
    inMemoryDb.userSkills.set('us1', {
      id: 'us1',
      userId: 'u1',
      skillId: 's-python',
      intent: 'teach',
      level: 'advanced',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    inMemoryDb.userSkills.set('us2', {
      id: 'us2',
      userId: 'u1',
      skillId: 's-react',
      intent: 'learn',
      level: 'beginner',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    inMemoryDb.userSkills.set('us3', {
      id: 'us3',
      userId: 'u2',
      skillId: 's-react',
      intent: 'teach',
      level: 'intermediate',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // 3. Seed connections: 2 accepted, 1 pending, 1 rejected
    inMemoryDb.connections.set('c1', {
      id: 'c1',
      requesterId: 'u1',
      recipientId: 'u2',
      status: 'accepted',
      requestNote: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    inMemoryDb.connections.set('c2', {
      id: 'c2',
      requesterId: 'u1',
      recipientId: 'u3',
      status: 'accepted',
      requestNote: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    inMemoryDb.connections.set('c3', {
      id: 'c3',
      requesterId: 'u2',
      recipientId: 'u3',
      status: 'pending',
      requestNote: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    inMemoryDb.connections.set('c4', {
      id: 'c4',
      requesterId: 'u3',
      recipientId: 'u4',
      status: 'rejected',
      requestNote: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // 4. Seed sessions: 2 completed, 1 confirmed, 1 canceled
    inMemoryDb.sessions.set('sess1', {
      id: 'sess1',
      connectionId: 'c1',
      proposerId: 'u1',
      title: 'Session 1',
      description: null,
      startsAt: new Date(),
      endsAt: new Date(),
      timezone: 'UTC',
      status: 'completed',
      externalMeetingUrl: null,
      rescheduleVersion: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    inMemoryDb.sessions.set('sess2', {
      id: 'sess2',
      connectionId: 'c2',
      proposerId: 'u1',
      title: 'Session 2',
      description: null,
      startsAt: new Date(),
      endsAt: new Date(),
      timezone: 'UTC',
      status: 'completed',
      externalMeetingUrl: null,
      rescheduleVersion: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    inMemoryDb.sessions.set('sess3', {
      id: 'sess3',
      connectionId: 'c1',
      proposerId: 'u2',
      title: 'Session 3',
      description: null,
      startsAt: new Date(),
      endsAt: new Date(),
      timezone: 'UTC',
      status: 'confirmed',
      externalMeetingUrl: null,
      rescheduleVersion: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    inMemoryDb.sessions.set('sess4', {
      id: 'sess4',
      connectionId: 'c1',
      proposerId: 'u1',
      title: 'Session 4',
      description: null,
      startsAt: new Date(),
      endsAt: new Date(),
      timezone: 'UTC',
      status: 'canceled',
      externalMeetingUrl: null,
      rescheduleVersion: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // 5. Seed reviews
    inMemoryDb.reviews.set('rev1', {
      id: 'rev1',
      sessionId: 'sess1',
      reviewerId: 'u1',
      revieweeId: 'u2',
      rating: 5,
      body: 'Great session',
      status: 'visible',
      createdAt: new Date(),
    });
    inMemoryDb.reviews.set('rev2', {
      id: 'rev2',
      sessionId: 'sess2',
      reviewerId: 'u1',
      revieweeId: 'u3',
      rating: 4,
      body: 'Helpful',
      status: 'visible',
      createdAt: new Date(),
    });
  });

  describe('1. Platform Aggregations & Acceptance Rate Calculations', () => {
    it('calculates accurate platform summary counts', async () => {
      const summary = await AnalyticsService.getPlatformAnalytics();

      expect(summary.members.total).toBe(4);
      expect(summary.members.active).toBe(3);
      expect(summary.members.suspended).toBe(1);
      expect(summary.connections.total).toBe(4);
      expect(summary.connections.accepted).toBe(2);
      expect(summary.sessions.total).toBe(4);
      expect(summary.sessions.completed).toBe(2);
      expect(summary.reviews.total).toBe(2);
      expect(summary.reviews.averageRating).toBe(4.5);
    });

    it('calculates connection acceptance rate correctly (2 accepted out of 3 resolved = 66.7%)', async () => {
      const summary = await AnalyticsService.getPlatformAnalytics();
      expect(summary.connections.acceptanceRate).toBe(66.7);
    });

    it('handles zero divisions gracefully when database has no records', async () => {
      inMemoryDb.clearAll();
      const emptySummary = await AnalyticsService.getPlatformAnalytics();

      expect(emptySummary.members.total).toBe(0);
      expect(emptySummary.connections.acceptanceRate).toBe(0);
      expect(emptySummary.reviews.averageRating).toBe(0);
    });
  });
});
