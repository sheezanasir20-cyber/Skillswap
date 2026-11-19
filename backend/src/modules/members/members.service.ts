import { inMemoryDb, UserEntity, UserSkillEntity, AvailabilityEntity } from '../../services/db.js';
import { NotFoundError } from '../../utils/errors.js';

export interface PublicMemberProfile {
  id: string;
  displayName: string;
  bio?: string | null;
  avatarUrl?: string | null;
  timezone: string;
  createdAt: Date;
  skills: Array<{
    id: string;
    skillId: string;
    name: string;
    category?: string | null;
    intent: 'teach' | 'learn';
    level: 'beginner' | 'intermediate' | 'advanced';
  }>;
  availability: AvailabilityEntity[];
  averageRating?: number;
  reviewCount?: number;
}

export class MembersService {
  public static async getProfile(userId: string): Promise<UserEntity> {
    const user = inMemoryDb.users.get(userId);
    if (!user || user.status === 'deleted') {
      throw new NotFoundError('Member not found.');
    }
    return user;
  }

  public static async updateProfile(
    userId: string,
    updates: {
      displayName?: string;
      bio?: string | null;
      avatarUrl?: string | null;
      timezone?: string;
    }
  ): Promise<Omit<UserEntity, 'passwordHash'>> {
    const user = inMemoryDb.users.get(userId);
    if (!user || user.status === 'deleted') {
      throw new NotFoundError('Member not found.');
    }

    if (updates.displayName !== undefined) user.displayName = updates.displayName.trim();
    if (updates.bio !== undefined) user.bio = updates.bio ? updates.bio.trim() : null;
    if (updates.avatarUrl !== undefined) user.avatarUrl = updates.avatarUrl;
    if (updates.timezone !== undefined) user.timezone = updates.timezone;
    user.updatedAt = new Date();

    inMemoryDb.users.set(user.id, user);

    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }

  public static async getPublicMember(memberId: string): Promise<PublicMemberProfile> {
    const user = inMemoryDb.users.get(memberId);
    if (!user || user.status !== 'active') {
      throw new NotFoundError('Member not found or account is not active.');
    }

    // Get skills
    const userSkills = Array.from(inMemoryDb.userSkills.values())
      .filter((us) => us.userId === memberId)
      .map((us) => {
        const skill = inMemoryDb.skills.get(us.skillId);
        return {
          id: us.id,
          skillId: us.skillId,
          name: skill ? skill.name : 'Unknown Skill',
          category: skill?.category || null,
          intent: us.intent,
          level: us.level,
        };
      });

    // Get availability
    const availability = Array.from(inMemoryDb.availability.values()).filter(
      (a) => a.userId === memberId
    );

    // Calculate reviews rating
    const reviews = Array.from(inMemoryDb.reviews.values()).filter(
      (r) => r.revieweeId === memberId && r.status === 'visible'
    );
    const reviewCount = reviews.length;
    const averageRating =
      reviewCount > 0
        ? parseFloat((reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1))
        : undefined;

    return {
      id: user.id,
      displayName: user.displayName,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      timezone: user.timezone,
      createdAt: user.createdAt,
      skills: userSkills,
      availability,
      averageRating,
      reviewCount,
    };
  }

  public static async setAvailability(
    userId: string,
    slots: Array<{ weekday: number; startMinute: number; endMinute: number; timezone?: string }>
  ): Promise<AvailabilityEntity[]> {
    // Remove existing slots
    for (const [id, slot] of inMemoryDb.availability.entries()) {
      if (slot.userId === userId) {
        inMemoryDb.availability.delete(id);
      }
    }

    const created: AvailabilityEntity[] = [];
    for (const slot of slots) {
      const entry: AvailabilityEntity = {
        id: `avail-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        userId,
        weekday: slot.weekday,
        startMinute: slot.startMinute,
        endMinute: slot.endMinute,
        timezone: slot.timezone || 'UTC',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      inMemoryDb.availability.set(entry.id, entry);
      created.push(entry);
    }

    return created;
  }
}
