import { inMemoryDb, ConnectionEntity, ConversationEntity, UserEntity } from '../../services/db.js';
import { NotFoundError, ConflictError, ForbiddenError, ValidationError } from '../../utils/errors.js';
import { NotificationsService } from '../notifications/notifications.service.js';

export interface EnrichedConnection extends ConnectionEntity {
  partner: Omit<UserEntity, 'passwordHash'>;
  conversationId?: string;
}

export class ConnectionsService {
  public static async sendRequest(
    requesterId: string,
    recipientId: string,
    requestNote?: string
  ): Promise<ConnectionEntity> {
    if (requesterId === recipientId) {
      throw new ValidationError('You cannot send a connection request to yourself.');
    }

    const recipient = inMemoryDb.users.get(recipientId);
    if (!recipient || recipient.status !== 'active') {
      throw new NotFoundError('Recipient member not found or is inactive.');
    }

    const requester = inMemoryDb.users.get(requesterId);

    // Check for existing connection between the pair
    const existing = Array.from(inMemoryDb.connections.values()).find(
      (c) =>
        (c.requesterId === requesterId && c.recipientId === recipientId) ||
        (c.requesterId === recipientId && c.recipientId === requesterId)
    );

    if (existing) {
      if (existing.status === 'blocked') {
        throw new ForbiddenError('Unable to connect with this member.');
      }
      if (existing.status === 'pending') {
        if (existing.requesterId === requesterId) {
          throw new ConflictError('You have already sent a pending connection request to this member.');
        } else {
          throw new ConflictError(
            'This member has already sent you a connection request. Please accept it instead.'
          );
        }
      }
      if (existing.status === 'accepted') {
        throw new ConflictError('You are already connected with this member.');
      }
      // If rejected or cancelled, allow re-requesting by updating the record
      existing.requesterId = requesterId;
      existing.recipientId = recipientId;
      existing.status = 'pending';
      existing.requestNote = requestNote ? requestNote.trim() : null;
      existing.updatedAt = new Date();
      inMemoryDb.connections.set(existing.id, existing);

      // In-app notification
      await NotificationsService.create({
        userId: recipientId,
        type: 'connection_request',
        title: 'New Connection Request',
        body: `${requester?.displayName || 'A member'} sent you a connection request.`,
        resourceType: 'connection',
        resourceId: existing.id,
      });

      return existing;
    }

    const connection: ConnectionEntity = {
      id: `conn-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      requesterId,
      recipientId,
      status: 'pending',
      requestNote: requestNote ? requestNote.trim() : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    inMemoryDb.connections.set(connection.id, connection);

    // In-app notification
    await NotificationsService.create({
      userId: recipientId,
      type: 'connection_request',
      title: 'New Connection Request',
      body: `${requester?.displayName || 'A member'} sent you a connection request.`,
      resourceType: 'connection',
      resourceId: connection.id,
    });

    return connection;
  }

  public static async acceptRequest(userId: string, connectionId: string): Promise<ConnectionEntity> {
    const conn = inMemoryDb.connections.get(connectionId);
    if (!conn) {
      throw new NotFoundError('Connection request not found.');
    }

    if (conn.recipientId !== userId) {
      throw new ForbiddenError('Only the recipient can accept a connection request.');
    }

    if (conn.status !== 'pending') {
      throw new ValidationError(`Cannot accept request in status "${conn.status}".`);
    }

    conn.status = 'accepted';
    conn.updatedAt = new Date();
    inMemoryDb.connections.set(conn.id, conn);

    // Automatically create conversation for accepted connection if not exists
    let conv = Array.from(inMemoryDb.conversations.values()).find(
      (c) => c.connectionId === conn.id
    );
    if (!conv) {
      conv = {
        id: `conv-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        connectionId: conn.id,
        createdAt: new Date(),
      };
      inMemoryDb.conversations.set(conv.id, conv);
    }

    const recipient = inMemoryDb.users.get(userId);

    // Notify requester
    await NotificationsService.create({
      userId: conn.requesterId,
      type: 'connection_accepted',
      title: 'Connection Accepted',
      body: `${recipient?.displayName || 'A member'} accepted your connection request.`,
      resourceType: 'connection',
      resourceId: conn.id,
    });

    return conn;
  }

  public static async rejectRequest(userId: string, connectionId: string): Promise<ConnectionEntity> {
    const conn = inMemoryDb.connections.get(connectionId);
    if (!conn) {
      throw new NotFoundError('Connection request not found.');
    }

    if (conn.recipientId !== userId) {
      throw new ForbiddenError('Only the recipient can reject a connection request.');
    }

    if (conn.status !== 'pending') {
      throw new ValidationError(`Cannot reject request in status "${conn.status}".`);
    }

    conn.status = 'rejected';
    conn.updatedAt = new Date();
    inMemoryDb.connections.set(conn.id, conn);

    // UC-01 A4: notify the sender that their request was declined
    const recipientUser = inMemoryDb.users.get(userId);
    await NotificationsService.create({
      userId: conn.requesterId,
      type: 'connection_update',
      title: 'Connection Request Declined',
      body: `${recipientUser?.displayName || 'A member'} declined your connection request.`,
      resourceType: 'connection',
      resourceId: conn.id,
    });

    return conn;
  }

  public static async cancelRequest(userId: string, connectionId: string): Promise<ConnectionEntity> {
    const conn = inMemoryDb.connections.get(connectionId);
    if (!conn) {
      throw new NotFoundError('Connection request not found.');
    }

    if (conn.requesterId !== userId) {
      throw new ForbiddenError('Only the requester can cancel a pending connection request.');
    }

    if (conn.status !== 'pending') {
      throw new ValidationError(`Cannot cancel request in status "${conn.status}".`);
    }

    conn.status = 'cancelled';
    conn.updatedAt = new Date();
    inMemoryDb.connections.set(conn.id, conn);

    return conn;
  }

  public static async getMyConnections(userId: string): Promise<{
    incoming: EnrichedConnection[];
    outgoing: EnrichedConnection[];
    accepted: EnrichedConnection[];
  }> {
    const incoming: EnrichedConnection[] = [];
    const outgoing: EnrichedConnection[] = [];
    const accepted: EnrichedConnection[] = [];

    for (const conn of inMemoryDb.connections.values()) {
      if (conn.status === 'blocked') continue;

      const isRequester = conn.requesterId === userId;
      const isRecipient = conn.recipientId === userId;

      if (!isRequester && !isRecipient) continue;

      const partnerId = isRequester ? conn.recipientId : conn.requesterId;
      const partner = inMemoryDb.users.get(partnerId);
      if (!partner) continue;

      const { passwordHash: _, ...safePartner } = partner;
      const conv = Array.from(inMemoryDb.conversations.values()).find(
        (c) => c.connectionId === conn.id
      );

      const enriched: EnrichedConnection = {
        ...conn,
        partner: safePartner,
        conversationId: conv?.id,
      };

      if (conn.status === 'accepted') {
        accepted.push(enriched);
      } else if (conn.status === 'pending') {
        if (isRequester) {
          outgoing.push(enriched);
        } else {
          incoming.push(enriched);
        }
      }
    }

    return { incoming, outgoing, accepted };
  }
}
