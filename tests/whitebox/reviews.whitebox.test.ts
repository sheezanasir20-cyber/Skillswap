import { describe, it, expect, beforeEach } from 'vitest';
import { ReviewsService } from '../../backend/src/modules/reviews/reviews.service.js';
import { inMemoryDb } from '../../backend/src/services/db.js';
import { createReviewSchema } from '../../backend/src/modules/reviews/reviews.validation.js';
import { ValidationError, ForbiddenError, ConflictError, NotFoundError } from '../../backend/src/utils/errors.js';

describe('White-Box Testing: Reviews Logic, Boundaries & Security Gates', () => {
  const memberA = 'user-rev-a';
  const memberB = 'user-rev-b';
  const memberC = 'user-rev-c';
  const connectionId = 'conn-rev-ab';
  const completedSessionId = 'session-completed-1';
  const activeSessionId = 'session-confirmed-2';

  beforeEach(() => {
    inMemoryDb.clearAll();

    // Seed test users
    inMemoryDb.users.set(memberA, {
      id: memberA,
      email: 'membera@test.com',
      passwordHash: 'hash',
      displayName: 'Member A',
      bio: null,
      avatarUrl: null,
      timezone: 'UTC',
      role: 'member',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    inMemoryDb.users.set(memberB, {
      id: memberB,
      email: 'memberb@test.com',
      passwordHash: 'hash',
      displayName: 'Member B',
      bio: null,
      avatarUrl: null,
      timezone: 'UTC',
      role: 'member',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    inMemoryDb.users.set(memberC, {
      id: memberC,
      email: 'memberc@test.com',
      passwordHash: 'hash',
      displayName: 'Member C',
      bio: null,
      avatarUrl: null,
      timezone: 'UTC',
      role: 'member',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Seed connection
    inMemoryDb.connections.set(connectionId, {
      id: connectionId,
      requesterId: memberA,
      recipientId: memberB,
      status: 'accepted',
      requestNote: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Seed completed session
    inMemoryDb.sessions.set(completedSessionId, {
      id: completedSessionId,
      connectionId,
      proposerId: memberA,
      title: 'Python Mentoring Session',
      description: 'Covered decorators and generators',
      startsAt: new Date(Date.now() - 7200000),
      endsAt: new Date(Date.now() - 3600000),
      timezone: 'UTC',
      status: 'completed',
      externalMeetingUrl: null,
      rescheduleVersion: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Seed uncompleted session
    inMemoryDb.sessions.set(activeSessionId, {
      id: activeSessionId,
      connectionId,
      proposerId: memberA,
      title: 'Pending Session',
      description: 'Upcoming',
      startsAt: new Date(Date.now() + 3600000),
      endsAt: new Date(Date.now() + 7200000),
      timezone: 'UTC',
      status: 'confirmed',
      externalMeetingUrl: null,
      rescheduleVersion: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  describe('1. Review Validation Schema & Boundaries', () => {
    it('accepts ratings from 1 to 5 with optional body', () => {
      expect(createReviewSchema.parse({ rating: 1 })).toEqual({ rating: 1 });
      expect(createReviewSchema.parse({ rating: 5, body: 'Outstanding session!' })).toEqual({
        rating: 5,
        body: 'Outstanding session!',
      });
      expect(createReviewSchema.parse({ rating: 3, body: '' })).toEqual({ rating: 3, body: '' });
    });

    it('rejects ratings below 1, above 5, or non-integer', () => {
      expect(() => createReviewSchema.parse({ rating: 0 })).toThrow();
      expect(() => createReviewSchema.parse({ rating: 6 })).toThrow();
      expect(() => createReviewSchema.parse({ rating: 4.5 })).toThrow();
      expect(() => createReviewSchema.parse({ rating: 'five' as any })).toThrow();
    });

    it('rejects bodies exceeding 1000 characters', () => {
      const longBody = 'A'.repeat(1001);
      expect(() => createReviewSchema.parse({ rating: 5, body: longBody })).toThrow();
    });
  });

  describe('2. Review Eligibility Gates & Business Rules', () => {
    it('successfully creates review for completed session and sends notification', async () => {
      const review = await ReviewsService.createReview(memberA, completedSessionId, {
        rating: 5,
        body: 'Excellent teacher, very clear examples.',
      });

      expect(review).toBeDefined();
      expect(review.reviewerId).toBe(memberA);
      expect(review.revieweeId).toBe(memberB);
      expect(review.rating).toBe(5);
      expect(review.status).toBe('visible');

      // Verify in-memory storage
      expect(inMemoryDb.reviews.has(review.id)).toBe(true);

      // Verify notification dispatched to reviewee
      const notifications = Array.from(inMemoryDb.notifications.values()).filter(
        (n) => n.userId === memberB
      );
      expect(notifications.length).toBe(1);
      expect(notifications[0].type).toBe('review_received');
      expect(notifications[0].resourceId).toBe(review.id);
    });

    it('prevents reviews on sessions that are not completed (ValidationError)', async () => {
      await expect(
        ReviewsService.createReview(memberA, activeSessionId, { rating: 5 })
      ).rejects.toThrow(ValidationError);
    });

    it('throws NotFoundError for non-existent session', async () => {
      await expect(
        ReviewsService.createReview(memberA, 'non-existent-session', { rating: 5 })
      ).rejects.toThrow(NotFoundError);
    });

    it('throws ForbiddenError if reviewer is not a participant in the session', async () => {
      await expect(
        ReviewsService.createReview(memberC, completedSessionId, { rating: 4 })
      ).rejects.toThrow(ForbiddenError);
    });

    it('prevents duplicate reviews from the same reviewer for the same session (ConflictError)', async () => {
      await ReviewsService.createReview(memberA, completedSessionId, {
        rating: 5,
        body: 'First review',
      });

      // Second attempt by memberA must throw ConflictError
      await expect(
        ReviewsService.createReview(memberA, completedSessionId, {
          rating: 4,
          body: 'Second attempt',
        })
      ).rejects.toThrow(ConflictError);
    });

    it('allows reciprocal review from memberB for the same completed session', async () => {
      const reviewA = await ReviewsService.createReview(memberA, completedSessionId, {
        rating: 5,
        body: 'Great student!',
      });
      const reviewB = await ReviewsService.createReview(memberB, completedSessionId, {
        rating: 4,
        body: 'Great mentor!',
      });

      expect(reviewA.reviewerId).toBe(memberA);
      expect(reviewA.revieweeId).toBe(memberB);
      expect(reviewB.reviewerId).toBe(memberB);
      expect(reviewB.revieweeId).toBe(memberA);

      // Both stored
      expect(inMemoryDb.reviews.size).toBe(2);
    });
  });

  describe('3. Review Retrieval & Visibility Filtering', () => {
    it('returns only visible reviews enriched with reviewer information', async () => {
      await ReviewsService.createReview(memberA, completedSessionId, {
        rating: 5,
        body: 'Visible review',
      });

      const reviewsForB = await ReviewsService.getMemberReviews(memberB);
      expect(reviewsForB.length).toBe(1);
      expect(reviewsForB[0].reviewer.displayName).toBe('Member A');
      expect(reviewsForB[0].rating).toBe(5);

      // Hide review (e.g., moderation action)
      reviewsForB[0].status = 'hidden';
      inMemoryDb.reviews.set(reviewsForB[0].id, reviewsForB[0]);

      const visibleAfterHide = await ReviewsService.getMemberReviews(memberB);
      expect(visibleAfterHide.length).toBe(0);
    });
  });
});
