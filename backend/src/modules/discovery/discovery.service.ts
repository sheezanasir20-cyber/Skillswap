import { inMemoryDb } from '../../services/db.js';
import { MembersService, PublicMemberProfile } from '../members/members.service.js';

export interface SearchFilters {
  q?: string;
  skillId?: string;
  intent?: 'teach' | 'learn';
  level?: 'beginner' | 'intermediate' | 'advanced';
  weekday?: number;
  limit?: number;
  offset?: number;
}

export class DiscoveryService {
  public static async searchMembers(
    requesterId: string | undefined,
    filters: SearchFilters
  ): Promise<{ members: PublicMemberProfile[]; total: number }> {
    const q = filters.q ? filters.q.toLowerCase().trim() : undefined;
    const skillId = filters.skillId;
    const intent = filters.intent;
    const level = filters.level;
    const weekday = filters.weekday;

    let candidateIds = new Set<string>();

    for (const user of inMemoryDb.users.values()) {
      if (user.status !== 'active') continue;
      if (requesterId && user.id === requesterId) continue;

      // Check text search
      if (q) {
        const nameMatches = user.displayName.toLowerCase().includes(q);
        const bioMatches = user.bio ? user.bio.toLowerCase().includes(q) : false;
        
        // Also check if any of their skills match query
        const userSkillMatches = Array.from(inMemoryDb.userSkills.values()).some((us) => {
          if (us.userId !== user.id) return false;
          const s = inMemoryDb.skills.get(us.skillId);
          return s ? s.name.toLowerCase().includes(q) : false;
        });

        if (!nameMatches && !bioMatches && !userSkillMatches) {
          continue;
        }
      }

      // Check skill filters
      if (skillId || intent || level) {
        const matchesSkillFilter = Array.from(inMemoryDb.userSkills.values()).some((us) => {
          if (us.userId !== user.id) return false;
          if (skillId && us.skillId !== skillId) return false;
          if (intent && us.intent !== intent) return false;
          if (level && us.level !== level) return false;
          return true;
        });
        if (!matchesSkillFilter) continue;
      }

      // Check availability weekday
      if (weekday !== undefined) {
        const hasWeekday = Array.from(inMemoryDb.availability.values()).some(
          (a) => a.userId === user.id && a.weekday === weekday
        );
        if (!hasWeekday) continue;
      }

      candidateIds.add(user.id);
    }

    const total = candidateIds.size;
    const offset = filters.offset || 0;
    const limit = filters.limit || 20;

    const idsArray = Array.from(candidateIds).slice(offset, offset + limit);
    const profiles: PublicMemberProfile[] = [];

    for (const id of idsArray) {
      const p = await MembersService.getPublicMember(id);
      profiles.push(p);
    }

    return { members: profiles, total };
  }
}
