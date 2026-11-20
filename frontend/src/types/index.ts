export interface User {
  id: string;
  email: string;
  displayName: string;
  bio?: string | null;
  avatarUrl?: string | null;
  timezone: string;
  role: 'member' | 'moderator' | 'admin';
  status: 'active' | 'suspended' | 'deleted' | 'pending_verification';
  createdAt: string;
  updatedAt: string;
  skills?: UserSkill[];
  availability?: AvailabilitySlot[];
  averageRating?: number;
  reviewCount?: number;
}

export interface Skill {
  id: string;
  name: string;
  category?: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface UserSkill {
  id: string;
  skillId: string;
  name: string;
  category?: string | null;
  intent: 'teach' | 'learn';
  level: 'beginner' | 'intermediate' | 'advanced';
}

export interface AvailabilitySlot {
  id: string;
  userId: string;
  weekday: number;
  startMinute: number;
  endMinute: number;
  timezone: string;
}

export interface Connection {
  id: string;
  requesterId: string;
  recipientId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'blocked';
  requestNote?: string | null;
  createdAt: string;
  updatedAt: string;
  partner: User;
  conversationId?: string;
}

export interface Conversation {
  id: string;
  connectionId: string;
  createdAt: string;
  partner: User;
  lastMessage?: Message | null;
  unreadCount: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  createdAt: string;
  editedAt?: string | null;
  sender?: User;
}

export interface Session {
  id: string;
  connectionId: string;
  proposedBy: string;
  title: string;
  description?: string | null;
  startsAt: string;
  endsAt: string;
  timezone: string;
  externalMeetingUrl?: string | null;
  status: 'proposed' | 'confirmed' | 'declined' | 'cancelled' | 'completed';
  version: number;
  createdAt: string;
  updatedAt: string;
  partner: User;
  isProposer: boolean;
  canReview: boolean;
}

export interface Review {
  id: string;
  sessionId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  body?: string | null;
  status: 'visible' | 'hidden_pending_review' | 'removed';
  createdAt: string;
  reviewer: User;
  reviewee: User;
}

export interface MatchScore {
  candidateId: string;
  totalScore: number;
  reciprocalScore: number;
  levelScore: number;
  availabilityScore: number;
  completenessScore: number;
  activityScore: number;
  reciprocalTeachSkills: string[];
  reciprocalLearnSkills: string[];
  explanation: string;
}

export interface MatchCard {
  member: User;
  match: MatchScore;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  resourceType?: string | null;
  resourceId?: string | null;
  readAt?: string | null;
  createdAt: string;
}

export interface ReportItem {
  id: string;
  reporterId: string;
  targetType: 'profile' | 'message' | 'review';
  targetId: string;
  reason: string;
  description?: string | null;
  status: 'submitted' | 'under_review' | 'resolved' | 'dismissed';
  assignedTo?: string | null;
  resolutionNote?: string | null;
  createdAt: string;
  reporter?: User;
  assignee?: User | null;
  targetPreview?: any;
}
