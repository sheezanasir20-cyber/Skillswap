import { describe, it, expect, beforeEach } from 'vitest';
import { ConnectionsService } from '../../backend/src/modules/connections/connections.service.js';
import { inMemoryDb, UserEntity } from '../../backend/src/services/db.js';

describe('White-Box Testing: Connection Management Lifecycle & State Transitions', () => {
  let userA: UserEntity;
  let userB: UserEntity;
  let userC: UserEntity;

  beforeEach(() => {
    inMemoryDb.clearAll();

    userA = {
      id: 'user-a',
      email: 'a@example.com',
      passwordHash: 'hash',
      displayName: 'User A',
      timezone: 'UTC',
      role: 'member',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    userB = {
      id: 'user-b',
      email: 'b@example.com',
      passwordHash: 'hash',
      displayName: 'User B',
      timezone: 'UTC',
      role: 'member',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    userC = {
      id: 'user-c',
      email: 'c@example.com',
      passwordHash: 'hash',
      displayName: 'User C',
      timezone: 'UTC',
      role: 'member',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    inMemoryDb.users.set(userA.id, userA);
    inMemoryDb.users.set(userB.id, userB);
    inMemoryDb.users.set(userC.id, userC);
  });

  describe('1. Request Sending Logic & Guard Conditions', () => {
    it('sends connection request with optional note successfully', async () => {
      const conn = await ConnectionsService.sendRequest(
        userA.id,
        userB.id,
        'Hi, I would love to learn Spanish from you!'
      );

      expect(conn).toBeDefined();
      expect(conn.requesterId).toBe(userA.id);
      expect(conn.recipientId).toBe(userB.id);
      expect(conn.status).toBe('pending');
      expect(conn.requestNote).toBe('Hi, I would love to learn Spanish from you!');

      // Notification created for recipient
      const notifs = Array.from(inMemoryDb.notifications.values());
      const recNotif = notifs.find((n) => n.userId === userB.id);
      expect(recNotif).toBeDefined();
      expect(recNotif?.type).toBe('connection_request');
    });

    it('rejects self-connection request with ValidationError', async () => {
      await expect(ConnectionsService.sendRequest(userA.id, userA.id)).rejects.toThrow(
        'You cannot send a connection request to yourself.'
      );
    });

    it('rejects connection request to inactive or non-existent user with NotFoundError', async () => {
      await expect(ConnectionsService.sendRequest(userA.id, 'ghost-user')).rejects.toThrow(
        'Recipient member not found or is inactive.'
      );

      userB.status = 'suspended';
      inMemoryDb.users.set(userB.id, userB);
      await expect(ConnectionsService.sendRequest(userA.id, userB.id)).rejects.toThrow(
        'Recipient member not found or is inactive.'
      );
    });

    it('prevents duplicate pending requests from same requester', async () => {
      await ConnectionsService.sendRequest(userA.id, userB.id);
      await expect(ConnectionsService.sendRequest(userA.id, userB.id)).rejects.toThrow(
        'You have already sent a pending connection request to this member.'
      );
    });

    it('prevents reverse duplicate pending request when recipient already initiated', async () => {
      await ConnectionsService.sendRequest(userA.id, userB.id);
      await expect(ConnectionsService.sendRequest(userB.id, userA.id)).rejects.toThrow(
        'This member has already sent you a connection request. Please accept it instead.'
      );
    });

    it('prevents request if already accepted', async () => {
      const conn = await ConnectionsService.sendRequest(userA.id, userB.id);
      await ConnectionsService.acceptRequest(userB.id, conn.id);

      await expect(ConnectionsService.sendRequest(userA.id, userB.id)).rejects.toThrow(
        'You are already connected with this member.'
      );
    });

    it('blocks connection if relationship status is blocked', async () => {
      const conn = await ConnectionsService.sendRequest(userA.id, userB.id);
      conn.status = 'blocked';
      inMemoryDb.connections.set(conn.id, conn);

      await expect(ConnectionsService.sendRequest(userA.id, userB.id)).rejects.toThrow(
        'Unable to connect with this member.'
      );
    });
  });

  describe('2. Acceptance Lifecycle & Conversation Auto-Creation', () => {
    it('accepts request, transitions state to accepted, and auto-creates conversation', async () => {
      const req = await ConnectionsService.sendRequest(userA.id, userB.id);
      const accepted = await ConnectionsService.acceptRequest(userB.id, req.id);

      expect(accepted.status).toBe('accepted');

      // Verify conversation auto-created
      const conv = Array.from(inMemoryDb.conversations.values()).find(
        (c) => c.connectionId === req.id
      );
      expect(conv).toBeDefined();

      // Verify requester receives connection_accepted notification
      const notifs = Array.from(inMemoryDb.notifications.values());
      const reqNotif = notifs.find(
        (n) => n.userId === userA.id && n.type === 'connection_accepted'
      );
      expect(reqNotif).toBeDefined();
    });

    it('prevents requester from accepting their own sent request', async () => {
      const req = await ConnectionsService.sendRequest(userA.id, userB.id);
      await expect(ConnectionsService.acceptRequest(userA.id, req.id)).rejects.toThrow(
        'Only the recipient can accept a connection request.'
      );
    });

    it('prevents third-party user from accepting request', async () => {
      const req = await ConnectionsService.sendRequest(userA.id, userB.id);
      await expect(ConnectionsService.acceptRequest(userC.id, req.id)).rejects.toThrow(
        'Only the recipient can accept a connection request.'
      );
    });

    it('prevents accepting an already processed request', async () => {
      const req = await ConnectionsService.sendRequest(userA.id, userB.id);
      await ConnectionsService.acceptRequest(userB.id, req.id);

      await expect(ConnectionsService.acceptRequest(userB.id, req.id)).rejects.toThrow(
        'Cannot accept request in status "accepted".'
      );
    });
  });

  describe('3. Rejection & Cancellation Lifecycles', () => {
    it('allows recipient to reject pending request', async () => {
      const req = await ConnectionsService.sendRequest(userA.id, userB.id);
      const rejected = await ConnectionsService.rejectRequest(userB.id, req.id);
      expect(rejected.status).toBe('rejected');
    });

    it('prevents non-recipient from rejecting request', async () => {
      const req = await ConnectionsService.sendRequest(userA.id, userB.id);
      await expect(ConnectionsService.rejectRequest(userA.id, req.id)).rejects.toThrow(
        'Only the recipient can reject a connection request.'
      );
    });

    it('allows requester to cancel pending request', async () => {
      const req = await ConnectionsService.sendRequest(userA.id, userB.id);
      const cancelled = await ConnectionsService.cancelRequest(userA.id, req.id);
      expect(cancelled.status).toBe('cancelled');
    });

    it('prevents recipient or third party from cancelling request', async () => {
      const req = await ConnectionsService.sendRequest(userA.id, userB.id);
      await expect(ConnectionsService.cancelRequest(userB.id, req.id)).rejects.toThrow(
        'Only the requester can cancel a pending connection request.'
      );
    });
  });

  describe('4. getMyConnections Loop Testing', () => {
    it('categorizes connections into incoming, outgoing, and accepted collections', async () => {
      // 1 outgoing pending
      await ConnectionsService.sendRequest(userA.id, userB.id);
      // 1 incoming pending
      await ConnectionsService.sendRequest(userC.id, userA.id);

      const res = await ConnectionsService.getMyConnections(userA.id);
      expect(res.outgoing.length).toBe(1);
      expect(res.outgoing[0].partner.id).toBe(userB.id);

      expect(res.incoming.length).toBe(1);
      expect(res.incoming[0].partner.id).toBe(userC.id);

      expect(res.accepted.length).toBe(0);

      // Now accept outgoing
      const outgoingId = res.outgoing[0].id;
      await ConnectionsService.acceptRequest(userB.id, outgoingId);

      const updated = await ConnectionsService.getMyConnections(userA.id);
      expect(updated.outgoing.length).toBe(0);
      expect(updated.accepted.length).toBe(1);
      expect(updated.accepted[0].conversationId).toBeDefined();
    });
  });
});
