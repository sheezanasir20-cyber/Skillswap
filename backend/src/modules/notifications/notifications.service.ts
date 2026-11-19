import { inMemoryDb, NotificationEntity } from '../../services/db.js';

export class NotificationsService {
  public static async create(data: {
    userId: string;
    type: string;
    title: string;
    body: string;
    resourceType?: string;
    resourceId?: string;
  }): Promise<NotificationEntity> {
    const notification: NotificationEntity = {
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      userId: data.userId,
      type: data.type,
      title: data.title,
      body: data.body,
      resourceType: data.resourceType || null,
      resourceId: data.resourceId || null,
      readAt: null,
      createdAt: new Date(),
    };

    inMemoryDb.notifications.set(notification.id, notification);
    return notification;
  }

  public static async getForUser(
    userId: string,
    limit = 50,
    offset = 0
  ): Promise<{ notifications: NotificationEntity[]; unreadCount: number; total: number }> {
    const all = Array.from(inMemoryDb.notifications.values())
      .filter((n) => n.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const total = all.length;
    const unreadCount = all.filter((n) => n.readAt === null).length;
    const paginated = all.slice(offset, offset + limit);

    return { notifications: paginated, unreadCount, total };
  }

  public static async markAsRead(userId: string, notificationId: string): Promise<NotificationEntity | null> {
    const n = inMemoryDb.notifications.get(notificationId);
    if (!n || n.userId !== userId) {
      return null;
    }
    n.readAt = new Date();
    inMemoryDb.notifications.set(n.id, n);
    return n;
  }

  public static async markAllAsRead(userId: string): Promise<void> {
    for (const n of inMemoryDb.notifications.values()) {
      if (n.userId === userId && n.readAt === null) {
        n.readAt = new Date();
        inMemoryDb.notifications.set(n.id, n);
      }
    }
  }
}
