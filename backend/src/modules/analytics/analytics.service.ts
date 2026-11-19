import { inMemoryDb } from '../../services/db.js';

export interface AnalyticsData {
  members: {
    total: number;
    active: number;
    suspended: number;
    withReciprocalSkills: number; // >= 1 teach AND >= 1 learn
    profileCompletionRate: number; // percentage
  };
  connections: {
    total: number;
    pending: number;
    accepted: number;
    rejected: number;
    acceptanceRate: number; // percentage of (accepted / (accepted + rejected))
  };
  sessions: {
    total: number;
    proposed: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
  reviews: {
    total: number;
    averageRating: number;
    reviewSubmissionRate: number; // percentage of completed sessions reviewed
  };
  reports: {
    total: number;
    pending: number;
    resolved: number;
    dismissed: number;
  };
}

export class AnalyticsService {
  public static async getPlatformAnalytics(): Promise<AnalyticsData> {
    const users = Array.from(inMemoryDb.users.values());
    const totalMembers = users.length;
    const activeMembers = users.filter((u) => u.status === 'active').length;
    const suspendedMembers = users.filter((u) => u.status === 'suspended').length;

    // Profiles with reciprocal skills
    let withReciprocalSkills = 0;
    for (const u of users) {
      const skills = Array.from(inMemoryDb.userSkills.values()).filter((s) => s.userId === u.id);
      const hasTeach = skills.some((s) => s.intent === 'teach');
      const hasLearn = skills.some((s) => s.intent === 'learn');
      if (hasTeach && hasLearn) {
        withReciprocalSkills++;
      }
    }
    const profileCompletionRate =
      totalMembers > 0 ? parseFloat(((withReciprocalSkills / totalMembers) * 100).toFixed(1)) : 0;

    // Connections
    const connections = Array.from(inMemoryDb.connections.values());
    const totalConnections = connections.length;
    const pendingConn = connections.filter((c) => c.status === 'pending').length;
    const acceptedConn = connections.filter((c) => c.status === 'accepted').length;
    const rejectedConn = connections.filter((c) => c.status === 'rejected').length;
    const resolvedConn = acceptedConn + rejectedConn;
    const acceptanceRate =
      resolvedConn > 0 ? parseFloat(((acceptedConn / resolvedConn) * 100).toFixed(1)) : 0;

    // Sessions
    const sessions = Array.from(inMemoryDb.sessions.values());
    const totalSessions = sessions.length;
    const proposedSessions = sessions.filter((s) => s.status === 'proposed').length;
    const confirmedSessions = sessions.filter((s) => s.status === 'confirmed').length;
    const completedSessions = sessions.filter((s) => s.status === 'completed').length;
    const cancelledSessions = sessions.filter((s) => s.status === 'cancelled').length;

    // Reviews
    const reviews = Array.from(inMemoryDb.reviews.values()).filter((r) => r.status === 'visible');
    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? parseFloat((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1))
        : 0;
    const reviewSubmissionRate =
      completedSessions > 0
        ? parseFloat(((reviews.length / (completedSessions * 2)) * 100).toFixed(1))
        : 0;

    // Reports
    const reports = Array.from(inMemoryDb.reports.values());
    const totalReports = reports.length;
    const pendingReports = reports.filter((r) => r.status === 'submitted' || r.status === 'under_review').length;
    const resolvedReports = reports.filter((r) => r.status === 'resolved').length;
    const dismissedReports = reports.filter((r) => r.status === 'dismissed').length;

    return {
      members: {
        total: totalMembers,
        active: activeMembers,
        suspended: suspendedMembers,
        withReciprocalSkills,
        profileCompletionRate,
      },
      connections: {
        total: totalConnections,
        pending: pendingConn,
        accepted: acceptedConn,
        rejected: rejectedConn,
        acceptanceRate,
      },
      sessions: {
        total: totalSessions,
        proposed: proposedSessions,
        confirmed: confirmedSessions,
        completed: completedSessions,
        cancelled: cancelledSessions,
      },
      reviews: {
        total: totalReviews,
        averageRating,
        reviewSubmissionRate,
      },
      reports: {
        total: totalReports,
        pending: pendingReports,
        resolved: resolvedReports,
        dismissed: dismissedReports,
      },
    };
  }
}
