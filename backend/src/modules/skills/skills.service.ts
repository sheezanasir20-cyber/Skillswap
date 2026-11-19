import { inMemoryDb, SkillEntity, UserSkillEntity } from '../../services/db.js';
import { NotFoundError, ConflictError, ValidationError } from '../../utils/errors.js';

export class SkillsService {
  public static async getCatalogue(query?: string): Promise<SkillEntity[]> {
    let all = Array.from(inMemoryDb.skills.values()).filter((s) => s.isActive);
    if (query) {
      const q = query.toLowerCase().trim();
      all = all.filter(
        (s) => s.name.toLowerCase().includes(q) || (s.category && s.category.toLowerCase().includes(q))
      );
    }
    return all.sort((a, b) => a.name.localeCompare(b.name));
  }

  public static async addMemberSkill(
    userId: string,
    data: {
      skillId?: string;
      name?: string;
      category?: string;
      intent: 'teach' | 'learn';
      level: 'beginner' | 'intermediate' | 'advanced';
    }
  ): Promise<UserSkillEntity & { skill: SkillEntity }> {
    let skill: SkillEntity | undefined;

    if (data.skillId) {
      skill = inMemoryDb.skills.get(data.skillId);
      if (!skill) {
        throw new NotFoundError('Skill not found in catalogue.');
      }
    } else if (data.name) {
      const normalizedName = data.name.trim();
      skill = Array.from(inMemoryDb.skills.values()).find(
        (s) => s.name.toLowerCase() === normalizedName.toLowerCase()
      );
      if (!skill) {
        // Create new skill in catalogue
        skill = {
          id: `skill-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          name: normalizedName,
          category: data.category || 'General',
          isActive: true,
          createdAt: new Date(),
        };
        inMemoryDb.skills.set(skill.id, skill);
      }
    }

    if (!skill) {
      throw new ValidationError('Skill could not be identified or created.');
    }

    // Check unique constraint: (userId, skillId, intent)
    const existing = Array.from(inMemoryDb.userSkills.values()).find(
      (us) => us.userId === userId && us.skillId === skill!.id && us.intent === data.intent
    );

    if (existing) {
      throw new ConflictError(
        `You already have "${skill.name}" listed under skills you ${data.intent}.`
      );
    }

    const userSkill: UserSkillEntity = {
      id: `uskill-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      userId,
      skillId: skill.id,
      intent: data.intent,
      level: data.level,
      createdAt: new Date(),
      skill,
    };

    inMemoryDb.userSkills.set(userSkill.id, userSkill);
    return userSkill as UserSkillEntity & { skill: SkillEntity };
  }

  public static async updateMemberSkill(
    userId: string,
    userSkillId: string,
    updates: {
      level?: 'beginner' | 'intermediate' | 'advanced';
      intent?: 'teach' | 'learn';
    }
  ): Promise<UserSkillEntity> {
    const userSkill = inMemoryDb.userSkills.get(userSkillId);
    if (!userSkill || userSkill.userId !== userId) {
      throw new NotFoundError('User skill not found.');
    }

    if (updates.intent && updates.intent !== userSkill.intent) {
      // Check for collision with target intent
      const conflict = Array.from(inMemoryDb.userSkills.values()).find(
        (us) => us.userId === userId && us.skillId === userSkill.skillId && us.intent === updates.intent
      );
      if (conflict) {
        throw new ConflictError('You already have this skill listed under the target intent.');
      }
      userSkill.intent = updates.intent;
    }

    if (updates.level) {
      userSkill.level = updates.level;
    }

    inMemoryDb.userSkills.set(userSkill.id, userSkill);
    const skill = inMemoryDb.skills.get(userSkill.skillId);
    userSkill.skill = skill;
    return userSkill;
  }

  public static async deleteMemberSkill(userId: string, userSkillId: string): Promise<void> {
    const userSkill = inMemoryDb.userSkills.get(userSkillId);
    if (!userSkill || userSkill.userId !== userId) {
      throw new NotFoundError('User skill not found.');
    }
    inMemoryDb.userSkills.delete(userSkillId);
  }
}
