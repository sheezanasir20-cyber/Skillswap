import { inMemoryDb, AuditLogEntity } from './db.js';
import { logger } from '../utils/logger.js';

export interface AuditParams {
  actorId: string;
  action: string;
  targetType: string;
  targetId: string;
  reason?: string | null;
  metadata?: Record<string, any> | null;
}

export class AuditService {
  public static async log(params: AuditParams): Promise<AuditLogEntity> {
    const entry: AuditLogEntity = {
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      actorId: params.actorId,
      action: params.action,
      targetType: params.targetType,
      targetId: params.targetId,
      reason: params.reason || null,
      metadata: params.metadata || null,
      createdAt: new Date(),
    };

    inMemoryDb.auditLogs.set(entry.id, entry);

    logger.info(`[Audit Log] ${params.action} by ${params.actorId} on ${params.targetType}:${params.targetId}`, {
      action: params.action,
      actorId: params.actorId,
      targetType: params.targetType,
      targetId: params.targetId,
    });

    return entry;
  }

  public static async getLogs(filters?: {
    actorId?: string;
    action?: string;
    targetType?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ logs: AuditLogEntity[]; total: number }> {
    let all = Array.from(inMemoryDb.auditLogs.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );

    if (filters?.actorId) {
      all = all.filter((l) => l.actorId === filters.actorId);
    }
    if (filters?.action) {
      all = all.filter((l) => l.action.toLowerCase() === filters.action!.toLowerCase());
    }
    if (filters?.targetType) {
      all = all.filter((l) => l.targetType.toLowerCase() === filters.targetType!.toLowerCase());
    }

    const total = all.length;
    const offset = filters?.offset || 0;
    const limit = filters?.limit || 50;
    const paginated = all.slice(offset, offset + limit);

    // Attach actor information
    const enriched = paginated.map((log) => {
      const actor = inMemoryDb.users.get(log.actorId);
      return {
        ...log,
        actor: actor ? { ...actor, passwordHash: '' } : undefined,
      };
    });

    return { logs: enriched, total };
  }
}
