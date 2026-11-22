// Database abstraction layer
// Supports Prisma ORM and seamless fallback store for unit & whitebox testing

export interface UserEntity {
  id: string;
  email: string;
  passwordHash: string;
  displayName: string;
  bio?: string | null;
  avatarUrl?: string | null;
  timezone: string;
  role: 'member' | 'moderator' | 'admin';
  status: 'active' | 'suspended' | 'deleted' | 'pending_verification';
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date | null;
}

export interface SkillEntity {
  id: string;
  name: string;
  category?: string | null;
  isActive: boolean;
  createdAt: Date;
}

export interface UserSkillEntity {
  id: string;
  userId: string;
  skillId: string;
  intent: 'teach' | 'learn';
  level: 'beginner' | 'intermediate' | 'advanced';
  createdAt: Date;
  skill?: SkillEntity;
}

export interface AvailabilityEntity {
  id: string;
  userId: string;
  weekday: number;
  startMinute: number;
  endMinute: number;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConnectionEntity {
  id: string;
  requesterId: string;
  recipientId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'blocked';
  requestNote?: string | null;
  createdAt: Date;
  updatedAt: Date;
  requester?: UserEntity;
  recipient?: UserEntity;
}

export interface ConversationEntity {
  id: string;
  connectionId: string;
  createdAt: Date;
  connection?: ConnectionEntity;
}

export interface MessageEntity {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  createdAt: Date;
  editedAt?: Date | null;
  sender?: UserEntity;
}

export interface SessionEntity {
  id: string;
  connectionId: string;
  proposedBy: string;
  title: string;
  description?: string | null;
  startsAt: Date;
  endsAt: Date;
  timezone: string;
  externalMeetingUrl?: string | null;
  status: 'proposed' | 'confirmed' | 'declined' | 'cancelled' | 'completed';
  version: number;
  createdAt: Date;
  updatedAt: Date;
  connection?: ConnectionEntity;
  proposer?: UserEntity;
}

export interface ReviewEntity {
  id: string;
  sessionId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number; // 1-5
  body?: string | null;
  status: 'visible' | 'hidden_pending_review' | 'removed';
  createdAt: Date;
  reviewer?: UserEntity;
  reviewee?: UserEntity;
}

export interface ReportEntity {
  id: string;
  reporterId: string;
  targetType: 'profile' | 'message' | 'review';
  targetId: string;
  reason: string;
  description?: string | null;
  status: 'submitted' | 'under_review' | 'resolved' | 'dismissed';
  assignedTo?: string | null;
  resolutionNote?: string | null;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date | null;
  reporter?: UserEntity;
  assignee?: UserEntity | null;
}

export interface NotificationEntity {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  resourceType?: string | null;
  resourceId?: string | null;
  readAt?: Date | null;
  createdAt: Date;
}

export interface AuditLogEntity {
  id: string;
  actorId: string;
  action: string;
  targetType: string;
  targetId: string;
  reason?: string | null;
  metadata?: Record<string, any> | null;
  createdAt: Date;
  actor?: UserEntity;
}

export interface NotificationJobEntity {
  id: string;
  type: string;
  resourceId: string;
  runAt: Date;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  attempts: number;
  lastError?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// In-Memory Database Store with Full CRUD and Querying support
export class InMemoryDatabase {
  public users: Map<string, UserEntity> = new Map();
  public skills: Map<string, SkillEntity> = new Map();
  public userSkills: Map<string, UserSkillEntity> = new Map();
  public availability: Map<string, AvailabilityEntity> = new Map();
  public connections: Map<string, ConnectionEntity> = new Map();
  public conversations: Map<string, ConversationEntity> = new Map();
  public messages: Map<string, MessageEntity> = new Map();
  public sessions: Map<string, SessionEntity> = new Map();
  public reviews: Map<string, ReviewEntity> = new Map();
  public reports: Map<string, ReportEntity> = new Map();
  public notifications: Map<string, NotificationEntity> = new Map();
  public auditLogs: Map<string, AuditLogEntity> = new Map();
  public notificationJobs: Map<string, NotificationJobEntity> = new Map();

  constructor() {
    this.seedDefaultSkills();
  }

  public clearAll() {
    this.users.clear();
    this.skills.clear();
    this.userSkills.clear();
    this.availability.clear();
    this.connections.clear();
    this.conversations.clear();
    this.messages.clear();
    this.sessions.clear();
    this.reviews.clear();
    this.reports.clear();
    this.notifications.clear();
    this.auditLogs.clear();
    this.notificationJobs.clear();
    this.seedDefaultSkills();
  }

  public seedDefaultSkills() {
    const defaultSkills = [
      { id: 'skill-1', name: 'JavaScript', category: 'Programming', isActive: true, createdAt: new Date() },
      { id: 'skill-2', name: 'TypeScript', category: 'Programming', isActive: true, createdAt: new Date() },
      { id: 'skill-3', name: 'Python', category: 'Programming', isActive: true, createdAt: new Date() },
      { id: 'skill-4', name: 'React', category: 'Web Development', isActive: true, createdAt: new Date() },
      { id: 'skill-5', name: 'Node.js', category: 'Backend Development', isActive: true, createdAt: new Date() },
      { id: 'skill-6', name: 'Figma', category: 'Design', isActive: true, createdAt: new Date() },
      { id: 'skill-7', name: 'UI/UX Design', category: 'Design', isActive: true, createdAt: new Date() },
      { id: 'skill-8', name: 'Graphic Design', category: 'Design', isActive: true, createdAt: new Date() },
      { id: 'skill-9', name: 'Spanish', category: 'Languages', isActive: true, createdAt: new Date() },
      { id: 'skill-10', name: 'English Writing', category: 'Languages', isActive: true, createdAt: new Date() },
      { id: 'skill-11', name: 'Data Analysis', category: 'Data Science', isActive: true, createdAt: new Date() },
      { id: 'skill-12', name: 'Machine Learning', category: 'Data Science', isActive: true, createdAt: new Date() },
      { id: 'skill-13', name: 'Public Speaking', category: 'Soft Skills', isActive: true, createdAt: new Date() },
      { id: 'skill-14', name: 'Project Management', category: 'Business', isActive: true, createdAt: new Date() },
    ];
    for (const skill of defaultSkills) {
      this.skills.set(skill.id, skill);
    }
  }
}

export const inMemoryDb = new InMemoryDatabase();
