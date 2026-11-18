import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { inMemoryDb } from '../services/db.js';
import { AuthUser } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';

let ioInstance: SocketIOServer | null = null;

export function initSocketIO(server: any): SocketIOServer {
  const io = new SocketIOServer(server, {
    cors: {
      origin: config.corsOrigin,
      credentials: true,
    },
  });

  // Authenticate socket connections using JWT
  io.use((socket: Socket, next) => {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.replace('Bearer ', '');

    if (!token) {
      return next(new Error('Authentication token required for realtime connection.'));
    }

    try {
      const decoded = jwt.verify(token, config.jwtSecret) as AuthUser;
      (socket as any).user = decoded;
      next();
    } catch (err) {
      next(new Error('Invalid or expired realtime authentication token.'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const user: AuthUser = (socket as any).user;
    logger.info(`User connected to realtime socket: ${user.id}`);

    // Join personal notification room
    socket.join(`user:${user.id}`);

    // Handle joining a specific conversation room
    socket.on('join_conversation', (conversationId: string) => {
      // Authorization check: User must be a participant of this conversation's connection
      const conv = inMemoryDb.conversations.get(conversationId);
      if (!conv) {
        socket.emit('error', { message: 'Conversation not found.' });
        return;
      }
      const conn = inMemoryDb.connections.get(conv.connectionId);
      if (!conn || (conn.requesterId !== user.id && conn.recipientId !== user.id)) {
        socket.emit('error', { message: 'Unauthorized conversation access.' });
        return;
      }

      socket.join(`conversation:${conversationId}`);
      logger.info(`User ${user.id} joined conversation room: ${conversationId}`);
    });

    socket.on('leave_conversation', (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`);
    });

    socket.on('disconnect', () => {
      logger.info(`User disconnected from socket: ${user.id}`);
    });
  });

  ioInstance = io;
  return io;
}

export function getIO(): SocketIOServer | null {
  return ioInstance;
}

export function broadcastMessageCreated(conversationId: string, message: any): void {
  if (ioInstance) {
    ioInstance.to(`conversation:${conversationId}`).emit('message.created', message);
  }
}

export function broadcastNotification(userId: string, notification: any): void {
  if (ioInstance) {
    ioInstance.to(`user:${userId}`).emit('notification.created', notification);
  }
}
