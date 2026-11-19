import { inMemoryDb, UserEntity } from '../../services/db.js';
import { NotFoundError, ForbiddenError, ValidationError } from '../../utils/errors.js';
import { AuditService } from '../../services/audit.service.js';

export class AdminService {
  public static async listMembers(filters?: {
    search?: string;
    role?: string;
    status?: string;
  }): Promise<Array<Omit<UserEntity, 'passwordHash'>>> {
    let all = Array.from(inMemoryDb.users.values());

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      all = all.filter(
        (u) =>
          u.displayName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
      );
    }

    if (filters?.role) {
      all = all.filter((u) => u.role === filters.role);
    }

    if (filters?.status) {
      all = all.filter((u) => u.status === filters.status);
    }

    return all
      .map(({ passwordHash: _, ...safe }) => safe)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  public static async updateMember(
    adminId: string,
    targetUserId: string,
    updates: {
      role?: 'member' | 'moderator' | 'admin';
      status?: 'active' | 'suspended' | 'deleted';
      reason?: string;
    }
  ): Promise<Omit<UserEntity, 'passwordHash'>> {
    const user = inMemoryDb.users.get(targetUserId);
    if (!user) throw new NotFoundError('User not found.');

    const changes: Record<string, any> = {};

    if (updates.role && updates.role !== user.role) {
      changes.oldRole = user.role;
      changes.newRole = updates.role;
      user.role = updates.role;
    }

    if (updates.status && updates.status !== user.status) {
      changes.oldStatus = user.status;
      changes.newStatus = updates.status;
      user.status = updates.status;
    }

    user.updatedAt = new Date();
    inMemoryDb.users.set(user.id, user);

    await AuditService.log({
      actorId: adminId,
      action: 'ADMIN_MEMBER_UPDATED',
      targetType: 'user',
      targetId: targetUserId,
      reason: updates.reason || 'Admin management update',
      metadata: changes,
    });

    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }
}
