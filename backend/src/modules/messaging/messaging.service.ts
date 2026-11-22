import { inMemoryDb, MessageEntity, ConversationEntity, UserEntity } from '../../services/db.js';
import { NotFoundError, ForbiddenError, ValidationError } from '../../utils/errors.js';
import { broadcastMessageCreated } from '../../realtime/socket.handler.js';
import { NotificationsService } from '../notifications/notifications.service.js';

export interface EnrichedConversation {
  id: string;
  connectionId: string;
  createdAt: Date;
  partner: Omit<UserEntity, 'passwordHash'>;
  lastMessage?: MessageEntity | null;
  unreadCount: number;
}

export class MessagingService {
  public static async getMyConversations(userId: string): Promise<EnrichedConversation[]> {
    const list: EnrichedConversation[] = [];

    for (const conv of inMemoryDb.conversations.values()) {
      const conn = inMemoryDb.connections.get(conv.connectionId);
      if (!conn || conn.status !== 'accepted') continue;

      const isParticipant = conn.requesterId === userId || conn.recipientId === userId;
      if (!isParticipant) continue;

      const partnerId = conn.requesterId === userId ? conn.recipientId : conn.requesterId;
      const partner = inMemoryDb.users.get(partnerId);
      if (!partner) continue;

      // Get messages for this conversation
      const messages = Array.from(inMemoryDb.messages.values())
        .filter((m) => m.conversationId === conv.id)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      const lastMessage = messages.length > 0 ? messages[0] : null;

      const { passwordHash: _, ...safePartner } = partner;
      list.push({
        id: conv.id,
        connectionId: conv.connectionId,
        createdAt: conv.createdAt,
        partner: safePartner,
        lastMessage,
        unreadCount: 0,
      });
    }

    // Sort by last message date desc or conversation created desc
    return list.sort((a, b) => {
      const dateA = a.lastMessage?.createdAt.getTime() || a.createdAt.getTime();
      const dateB = b.lastMessage?.createdAt.getTime() || b.createdAt.getTime();
      return dateB - dateA;
    });
  }

  public static async getMessages(
    userId: string,
    conversationId: string,
    limit = 50,
    before?: string
  ): Promise<{ messages: MessageEntity[]; hasMore: boolean }> {
    const conv = inMemoryDb.conversations.get(conversationId);
    if (!conv) {
      throw new NotFoundError('Conversation not found.');
    }

    const conn = inMemoryDb.connections.get(conv.connectionId);
    if (!conn || (conn.requesterId !== userId && conn.recipientId !== userId)) {
      throw new ForbiddenError('You are not a participant in this conversation.');
    }

    let allMessages = Array.from(inMemoryDb.messages.values())
      .filter((m) => m.conversationId === conversationId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    if (before) {
      const beforeDate = new Date(before).getTime();
      allMessages = allMessages.filter((m) => m.createdAt.getTime() < beforeDate);
    }

    const total = allMessages.length;
    const startIndex = Math.max(0, total - limit);
    const paginated = allMessages.slice(startIndex);
    const hasMore = startIndex > 0;

    // Attach sender information
    const enriched = paginated.map((m) => {
      const sender = inMemoryDb.users.get(m.senderId);
      return {
        ...m,
        sender: sender ? { ...sender, passwordHash: '' } : undefined,
      };
    });

    return { messages: enriched, hasMore };
  }

  public static async sendMessage(
    userId: string,
    conversationId: string,
    body: string
  ): Promise<MessageEntity> {
    const conv = inMemoryDb.conversations.get(conversationId);
    if (!conv) {
      throw new NotFoundError('Conversation not found.');
    }

    const conn = inMemoryDb.connections.get(conv.connectionId);
    if (!conn || (conn.requesterId !== userId && conn.recipientId !== userId)) {
      throw new ForbiddenError('You are not a participant in this conversation.');
    }

    if (conn.status !== 'accepted') {
      throw new ForbiddenError('Messages can only be sent in accepted connections.');
    }

    // UC-09 A3: chat is unavailable when the partner's account is suspended or deleted
    const partnerId = conn.requesterId === userId ? conn.recipientId : conn.requesterId;
    const partner = inMemoryDb.users.get(partnerId);
    if (partner && (partner.status === 'suspended' || partner.status === 'deleted')) {
      throw new ForbiddenError('Chat is unavailable: your partner\'s account is suspended or deleted.');
    }

    const sanitizedBody = body.trim();
    if (!sanitizedBody) {
      throw new ValidationError('Message cannot be empty.');
    }

    const sender = inMemoryDb.users.get(userId);

    const message: MessageEntity = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      conversationId,
      senderId: userId,
      body: sanitizedBody,
      createdAt: new Date(),
      editedAt: null,
      sender: sender ? { ...sender, passwordHash: '' } : undefined,
    };

    inMemoryDb.messages.set(message.id, message);

    // Broadcast via Socket.IO
    broadcastMessageCreated(conversationId, message);

    // Notify partner
    const recipientId = conn.requesterId === userId ? conn.recipientId : conn.requesterId;
    await NotificationsService.create({
      userId: recipientId,
      type: 'new_message',
      title: `Message from ${sender?.displayName || 'Partner'}`,
      body: sanitizedBody.length > 60 ? sanitizedBody.substring(0, 57) + '...' : sanitizedBody,
      resourceType: 'conversation',
      resourceId: conversationId,
    });

    return message;
  }
}
