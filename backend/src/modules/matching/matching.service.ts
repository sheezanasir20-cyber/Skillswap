import { inMemoryDb } from '../../services/db.js';
import { MatchingEngine, MatchScoreResult } from './matching.engine.js';
import { PublicMemberProfile, MembersService } from '../members/members.service.js';

export interface MatchCardItem {
  member: PublicMemberProfile;
  match: MatchScoreResult;
}

export class MatchingService {
  public static async getMatches(userId: string): Promise<MatchCardItem[]> {
    const requester = inMemoryDb.users.get(userId);
    if (!requester || requester.status !== 'active') {
      return [];
    }

    const requesterSkills = Array.from(inMemoryDb.userSkills.values())
      .filter((us) => us.userId === userId)
      .map((us) => ({ ...us, skill: inMemoryDb.skills.get(us.skillId) }));

    const requesterAvailability = Array.from(inMemoryDb.availability.values()).filter(
      (a) => a.userId === userId
    );

    // Get blocked connections
    const blockedPairs = Array.from(inMemoryDb.connections.values()).filter(
      (c) =>
        c.status === 'blocked' &&
        (c.requesterId === userId || c.recipientId === userId)
    );
    const blockedUserIds = new Set<string>();
    for (const b of blockedPairs) {
      blockedUserIds.add(b.requesterId === userId ? b.recipientId : b.requesterId);
    }

    const matches: MatchCardItem[] = [];

    for (const candidate of inMemoryDb.users.values()) {
      if (candidate.id === userId) continue;
      if (candidate.status !== 'active') continue;
      if (blockedUserIds.has(candidate.id)) continue;

      const candidateSkills = Array.from(inMemoryDb.userSkills.values())
        .filter((us) => us.userId === candidate.id)
        .map((us) => ({ ...us, skill: inMemoryDb.skills.get(us.skillId) }));

      const candidateAvailability = Array.from(inMemoryDb.availability.values()).filter(
        (a) => a.userId === candidate.id
      );

      const score = MatchingEngine.calculateMatch(
        requester,
        requesterSkills,
        requesterAvailability,
        candidate,
        candidateSkills,
        candidateAvailability
      );

      // Only include candidate if there is at least some skill overlap
      if (score.reciprocalScore > 0) {
        const publicProfile = await MembersService.getPublicMember(candidate.id);
        matches.push({
          member: publicProfile,
          match: score,
        });
      }
    }

    // Rank primarily by totalScore descending
    matches.sort((a, b) => b.match.totalScore - a.match.totalScore);
    return matches;
  }
}
