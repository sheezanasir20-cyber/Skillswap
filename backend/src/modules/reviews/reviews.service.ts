import { inMemoryDb, ReviewEntity, UserEntity } from '../../services/db.js';
import { NotFoundError, ForbiddenError, ConflictError, ValidationError } from '../../utils/errors.js';
import { NotificationsService } from '../notifications/notifications.service.js';

export interface EnrichedReview extends Omit<ReviewEntity, 'reviewer' | 'reviewee'> {
  reviewer: Omit<UserEntity, 'passwordHash'>;
  reviewee: Omit<UserEntity, 'passwordHash'>;
}

export class ReviewsService {
  public static async createReview(
    userId: string,
    sessionId: string,
    data: { rating: number; body?: string }
  ): Promise<ReviewEntity> {
    const session = inMemoryDb.sessions.get(sessionId);
    if (!session) {
      throw new NotFoundError('Session not found.');
    }

    if (session.status !== 'completed') {
      throw new ValidationError('Reviews can only be submitted for completed sessions.');
    }

    const conn = inMemoryDb.connections.get(session.connectionId);
    if (!conn || (conn.requesterId !== userId && conn.recipientId !== userId)) {
      throw new ForbiddenError('You are not a participant in this session.');
    }

    const revieweeId = conn.requesterId === userId ? conn.recipientId : conn.requesterId;
    if (revieweeId === userId) {
      throw new ValidationError('You cannot review yourself.');
    }

    // Check unique constraint: 1 review per reviewer per session
    const existing = Array.from(inMemoryDb.reviews.values()).find(
      (r) => r.sessionId === sessionId && r.reviewerId === userId
    );

    if (existing) {
      throw new ConflictError('You have already submitted a review for this session.');
    }

    const reviewer = inMemoryDb.users.get(userId);

    const review: ReviewEntity = {
      id: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      sessionId,
      reviewerId: userId,
      revieweeId,
      rating: data.rating,
      body: data.body ? data.body.trim() : null,
      status: 'visible',
      createdAt: new Date(),
    };

    inMemoryDb.reviews.set(review.id, review);

    // Notify reviewee
    await NotificationsService.create({
      userId: revieweeId,
      type: 'review_received',
      title: 'New Review Received',
      body: `${reviewer?.displayName || 'Your partner'} left you a ${data.rating}-star review.`,
      resourceType: 'review',
      resourceId: review.id,
    });

    return review;
  }

  public static async getMemberReviews(memberId: string): Promise<EnrichedReview[]> {
    const reviews = Array.from(inMemoryDb.reviews.values()).filter(
      (r) => r.revieweeId === memberId && r.status === 'visible'
    );

    const enriched: EnrichedReview[] = [];
    for (const r of reviews) {
      const reviewer = inMemoryDb.users.get(r.reviewerId);
      const reviewee = inMemoryDb.users.get(r.revieweeId);
      if (reviewer && reviewee) {
        const { passwordHash: _p1, ...safeReviewer } = reviewer;
        const { passwordHash: _p2, ...safeReviewee } = reviewee;
        enriched.push({
          ...r,
          reviewer: safeReviewer,
          reviewee: safeReviewee,
        });
      }
    }

    return enriched.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}
