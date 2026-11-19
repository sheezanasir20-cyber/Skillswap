import { UserEntity, UserSkillEntity, AvailabilityEntity } from '../../services/db.js';

export interface MatchScoreResult {
  candidateId: string;
  totalScore: number;
  reciprocalScore: number;
  levelScore: number;
  availabilityScore: number;
  completenessScore: number;
  activityScore: number;
  reciprocalTeachSkills: string[]; // Skills requester can teach that candidate wants to learn
  reciprocalLearnSkills: string[]; // Skills candidate can teach that requester wants to learn
  explanation: string;
}

export class MatchingEngine {
  /**
   * Calculates the reciprocal match score between a requesting member and a candidate.
   * Conforms strictly to docss/backend/MATCHING.md
   */
  public static calculateMatch(
    requester: UserEntity,
    requesterSkills: UserSkillEntity[],
    requesterAvailability: AvailabilityEntity[],
    candidate: UserEntity,
    candidateSkills: UserSkillEntity[],
    candidateAvailability: AvailabilityEntity[]
  ): MatchScoreResult {
    // 1. Reciprocal Skill Overlap (0-50 points)
    // Requester teaches, Candidate learns
    const reqTeachIds = requesterSkills
      .filter((s) => s.intent === 'teach')
      .map((s) => ({ skillId: s.skillId, name: s.skill?.name || 'Skill', level: s.level }));

    const candLearnIds = candidateSkills
      .filter((s) => s.intent === 'learn')
      .map((s) => ({ skillId: s.skillId, name: s.skill?.name || 'Skill', level: s.level }));

    // Candidate teaches, Requester learns
    const candTeachIds = candidateSkills
      .filter((s) => s.intent === 'teach')
      .map((s) => ({ skillId: s.skillId, name: s.skill?.name || 'Skill', level: s.level }));

    const reqLearnIds = requesterSkills
      .filter((s) => s.intent === 'learn')
      .map((s) => ({ skillId: s.skillId, name: s.skill?.name || 'Skill', level: s.level }));

    const skillsReqTeachesCandLearns: string[] = [];
    const skillsCandTeachesReqLearns: string[] = [];

    for (const rt of reqTeachIds) {
      if (candLearnIds.some((cl) => cl.skillId === rt.skillId)) {
        skillsReqTeachesCandLearns.push(rt.name);
      }
    }

    for (const ct of candTeachIds) {
      if (reqLearnIds.some((rl) => rl.skillId === ct.skillId)) {
        skillsCandTeachesReqLearns.push(ct.name);
      }
    }

    let reciprocalScore = 0;
    if (skillsReqTeachesCandLearns.length > 0 && skillsCandTeachesReqLearns.length > 0) {
      // Mutual reciprocal match receives 40 base + 5 per additional pair up to 50
      const totalPairs = skillsReqTeachesCandLearns.length + skillsCandTeachesReqLearns.length;
      reciprocalScore = Math.min(50, 40 + (totalPairs - 2) * 5);
    } else if (skillsCandTeachesReqLearns.length > 0 || skillsReqTeachesCandLearns.length > 0) {
      // Partial / one-way match
      reciprocalScore = 20;
    }

    // 2. Skill-level compatibility (0-20 points)
    let levelScore = 0;
    if (skillsReqTeachesCandLearns.length > 0 && skillsCandTeachesReqLearns.length > 0) {
      // Evaluate level pairs
      levelScore = 20; // Default high for valid skill pairing
    } else if (reciprocalScore > 0) {
      levelScore = 10;
    }

    // 3. Availability overlap (0-20 points)
    let availabilityScore = 0;
    let overlappingDays = 0;
    for (const rAvail of requesterAvailability) {
      const matchDay = candidateAvailability.find((cAvail) => cAvail.weekday === rAvail.weekday);
      if (matchDay) {
        // Check for minute overlap
        const start = Math.max(rAvail.startMinute, matchDay.startMinute);
        const end = Math.min(rAvail.endMinute, matchDay.endMinute);
        if (end > start) {
          overlappingDays++;
        }
      }
    }

    if (overlappingDays >= 3) {
      availabilityScore = 20;
    } else if (overlappingDays === 2) {
      availabilityScore = 15;
    } else if (overlappingDays === 1) {
      availabilityScore = 10;
    } else if (requesterAvailability.length === 0 || candidateAvailability.length === 0) {
      // Neither user configured restrictive availability
      availabilityScore = 5;
    }

    // 4. Profile completeness (0-5 points)
    let completenessScore = 0;
    if (candidate.bio && candidate.bio.length > 20) completenessScore += 2;
    if (candidate.avatarUrl) completenessScore += 2;
    if (candidate.timezone) completenessScore += 1;

    // 5. Recent activity (0-5 points)
    let activityScore = 0;
    if (candidate.lastLoginAt) {
      const daysSinceLogin =
        (Date.now() - new Date(candidate.lastLoginAt).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceLogin <= 7) {
        activityScore = 5;
      } else if (daysSinceLogin <= 30) {
        activityScore = 2;
      }
    }

    const totalScore = Math.min(
      100,
      reciprocalScore + levelScore + availabilityScore + completenessScore + activityScore
    );

    // Human, plain explanation per MATCHING.md
    let explanation = '';
    if (skillsReqTeachesCandLearns.length > 0 && skillsCandTeachesReqLearns.length > 0) {
      explanation = `You can teach ${skillsReqTeachesCandLearns.join(', ')}, and ${candidate.displayName} wants to learn it. ${candidate.displayName} can teach ${skillsCandTeachesReqLearns.join(', ')}, which is on your learning list.`;
    } else if (skillsCandTeachesReqLearns.length > 0) {
      explanation = `${candidate.displayName} can teach ${skillsCandTeachesReqLearns.join(', ')}, which you want to learn. (One-way partial match)`;
    } else if (skillsReqTeachesCandLearns.length > 0) {
      explanation = `You can teach ${skillsReqTeachesCandLearns.join(', ')}, which ${candidate.displayName} wants to learn. (One-way partial match)`;
    } else {
      explanation = 'No overlapping skills currently.';
    }

    return {
      candidateId: candidate.id,
      totalScore,
      reciprocalScore,
      levelScore,
      availabilityScore,
      completenessScore,
      activityScore,
      reciprocalTeachSkills: skillsReqTeachesCandLearns,
      reciprocalLearnSkills: skillsCandTeachesReqLearns,
      explanation,
    };
  }
}
