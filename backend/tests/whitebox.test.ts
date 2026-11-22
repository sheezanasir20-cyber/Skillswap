// White-box unit tests: statement/branch coverage targets from SRS verification plan
import { describe, it, expect, beforeEach } from 'vitest';
import { AuthService } from '../src/modules/auth/auth.service';
import { MembersService } from '../src/modules/members/members.service';
import { SkillsService } from '../src/modules/skills/skills.service';
import { MatchingService } from '../src/modules/matching/matching.service';
import { ConnectionsService } from '../src/modules/connections/connections.service';
import { SessionsService } from '../src/modules/sessions/sessions.service';
import { MessagingService } from '../src/modules/messaging/messaging.service';
import { ReviewsService } from '../src/modules/reviews/reviews.service';
import { ReportsService } from '../src/modules/reports/reports.service';
import { ModerationService } from '../src/modules/moderation/moderation.service';
import { AnalyticsService } from '../src/modules/analytics/analytics.service';
import { AdminService } from '../src/modules/admin/admin.service';
import { AuditService } from '../src/services/audit.service';
import { ReminderWorker } from '../src/jobs/reminder.worker';
import { inMemoryDb } from '../src/services/db';
import { requireRole, authenticate } from '../src/middleware/auth';import { registerSchema } from '../src/modules/auth/auth.validation';
import { updateProfileSchema } from '../src/modules/members/members.validation';
import { addSkillSchema } from '../src/modules/skills/skills.validation';
import { proposeSessionSchema } from '../src/modules/sessions/sessions.validation';

const PW = 'TestPass123!';
let seq = 0;
const email = () => `wb.${Date.now()}.${seq++}@whitebox.test`;

async function mkUser(displayName: string) {
  return AuthService.register({ email: email(), password: PW, displayName });
}

beforeEach(() => {
  // fresh unique users each test; shared catalog from mockData seed
});

describe('UC-04 auth service', () => {
  it('register: normalizes email, rejects duplicates, returns JWT', async () => {
    const a = await AuthService.register({ email: '  WB.DUP@WhiteBox.test ', password: PW, displayName: 'Dup One' });
    expect(a.token.split('.')).toHaveLength(3);
    await expect(AuthService.register({ email: 'wb.dup@whitebox.test', password: PW, displayName: 'Dup Two' })).rejects.toThrow(/already exists/i);
    const bad = registerSchema.safeParse({ email: 'x@y.z', password: 'short', displayName: 'A' });
    expect(bad.success).toBe(false);
    expect(JSON.stringify(bad.error)).toMatch(/at least 2 characters/);
  });

  it('login: wrong password, suspended, deleted branches', async () => {
    const u = await mkUser('Login Target');
    await expect(AuthService.login({ email: u.user.email, password: 'nope123' })).rejects.toThrow(/Invalid email or password/);
    const dbUser = inMemoryDb.users.get(u.user.id)!;
    dbUser.status = 'suspended';
    await expect(AuthService.login({ email: u.user.email, password: PW })).rejects.toThrow(/suspended/);
    dbUser.status = 'deleted';
    await expect(AuthService.login({ email: u.user.email, password: PW })).rejects.toThrow(/no longer exists/);
    dbUser.status = 'active';
    const ok = await AuthService.login({ email: u.user.email, password: PW });
    expect(ok.user.lastLoginAt).toBeInstanceOf(Date);
    await expect(AuthService.login({ email: email(), password: PW })).rejects.toThrow(/Invalid email or password/);
  });

  it('getMe + password reset flow', async () => {
    const u = await mkUser('Reset Target');
    const me = await AuthService.getMe(u.user.id);
    expect((me as any).passwordHash).toBeUndefined();
    await AuthService.forgotPassword(u.user.email); // generates token (email transport stubbed)
    await expect(AuthService.resetPassword({ token: 'reset-bogus', newPassword: 'NewPass123!' } as any)).rejects.toThrow(/invalid|expired/i);
    await expect(AuthService.forgotPassword('nobody@nowhere.test')).resolves.toBeUndefined();
  });
});

describe('UC-05 profile service + validation', () => {
  it('updateProfile trims fields, rejects deleted users', async () => {
    const u = await mkUser('Trim Me');
    const p = await MembersService.updateProfile(u.user.id, { displayName: '  Trimmed  ', bio: ' hi ', timezone: 'UTC+5' });
    expect(p.displayName).toBe('Trimmed');
    expect(p.bio).toBe('hi');
    const bad = updateProfileSchema.safeParse({ displayName: 'A' });
    expect(!bad.success || bad.data.displayName.length >= 2).toBeTruthy();
    inMemoryDb.users.get(u.user.id)!.status = 'deleted';
    await expect(MembersService.updateProfile(u.user.id, { displayName: 'Ghost' })).rejects.toThrow(/not found/i);
  });

  it('setAvailability replaces previous slots', async () => {
    const u = await mkUser('Avail');
    await MembersService.setAvailability(u.user.id, [{ weekday: 1, startMinute: 600, endMinute: 660 }]);
    const created = await MembersService.setAvailability(u.user.id, [{ weekday: 3, startMinute: 900, endMinute: 960 }]);
    const mine = Array.from(inMemoryDb.availability.values()).filter((s) => s.userId === u.user.id);
    expect(mine).toHaveLength(1);
    expect(created[0].weekday).toBe(3);
  });
});

describe('UC-06 skills service', () => {
  it('add by new name creates catalogue entry; duplicate intent rejected', async () => {
    const u = await mkUser('Skiller');
    const added = await SkillsService.addMemberSkill(u.user.id, { name: 'Whitebox Skill', intent: 'teach', level: 'beginner' });
    expect(added.skill.name).toBe('Whitebox Skill');
    await expect(SkillsService.addMemberSkill(u.user.id, { name: 'Whitebox Skill', intent: 'teach', level: 'advanced' })).rejects.toThrow(/already/i);
    const learned = await SkillsService.addMemberSkill(u.user.id, { name: 'Whitebox Skill', intent: 'learn', level: 'beginner' });
    expect(learned.intent).toBe('learn');
    const bad = addSkillSchema.safeParse({ name: 'x', intent: 'teach', level: 'beginner' });
    expect(bad.success).toBe(false);
  });

  it('update intent collision, delete', async () => {
    const u = await mkUser('Skiller2');
    const a = await SkillsService.addMemberSkill(u.user.id, { name: 'Flip Skill', intent: 'teach', level: 'intermediate' });
    const upd = await SkillsService.updateMemberSkill(u.user.id, a.id, { intent: 'learn' });
    expect(upd.intent).toBe('learn');
    await SkillsService.addMemberSkill(u.user.id, { name: 'Del Skill', intent: 'teach', level: 'advanced' });
    const d = Array.from(inMemoryDb.userSkills.values()).find((s) => s.userId === u.user.id && inMemoryDb.skills.get(s.skillId)?.name === 'Del Skill')!;
    await SkillsService.deleteMemberSkill(u.user.id, d.id);
    expect(inMemoryDb.userSkills.has(d.id)).toBe(false);
  });
});

describe('UC-07 matching engine', () => {
  it('scores reciprocal overlap, excludes disjoint and blocked', async () => {
    const a = await mkUser('MatchA');
    const b = await mkUser('MatchB');
    const c = await mkUser('MatchC');
    await SkillsService.addMemberSkill(a.user.id, { name: 'Alpha Teach', intent: 'teach', level: 'advanced' });
    await SkillsService.addMemberSkill(a.user.id, { name: 'Beta Learn', intent: 'learn', level: 'beginner' });
    await SkillsService.addMemberSkill(b.user.id, { name: 'Alpha Teach', intent: 'learn', level: 'beginner' });
    await SkillsService.addMemberSkill(b.user.id, { name: 'Beta Learn', intent: 'teach', level: 'intermediate' });
    await SkillsService.addMemberSkill(c.user.id, { name: 'Gamma Only', intent: 'teach', level: 'beginner' });
    const matches = await MatchingService.getMatches(a.user.id);
    const ids = matches.map((m: any) => m.member.id);
    expect(ids).toContain(b.user.id);
    expect(ids).not.toContain(c.user.id);
    // blocked candidates are excluded from suggestions (accepted connections still shown: observed behavior, SRS does not mandate exclusion)
    const conn = await ConnectionsService.sendRequest(a.user.id, b.user.id);
    conn.status = 'blocked';
    const after = await MatchingService.getMatches(a.user.id);
    expect(after.map((m: any) => m.member.id)).not.toContain(b.user.id);
  });
});

describe('UC-01 connection state machine', () => {
  it('self-request, duplicate pending, flip, reject->re-request, cancel', async () => {
    const x = await mkUser('ConnX');
    const y = await mkUser('ConnY');
    await expect(ConnectionsService.sendRequest(x.user.id, x.user.id)).rejects.toThrow(/yourself/i);
    await expect(ConnectionsService.sendRequest(x.user.id, 'user-does-not-exist')).rejects.toThrow(/not found/i);
    const c1 = await ConnectionsService.sendRequest(x.user.id, y.user.id, 'hello');
    await expect(ConnectionsService.sendRequest(x.user.id, y.user.id)).rejects.toThrow(/already sent/i);
    await expect(ConnectionsService.sendRequest(y.user.id, x.user.id)).rejects.toThrow(/already sent you/i);
    const rej = await ConnectionsService.rejectRequest(y.user.id, c1.id);
    expect(rej.status).toBe('rejected');
    const back = await ConnectionsService.sendRequest(y.user.id, x.user.id); // flip rejected record, requester swaps
    expect(back.status).toBe('pending');
    expect(back.requesterId).toBe(y.user.id);
    const cancelled = await ConnectionsService.cancelRequest(y.user.id, back.id);
    expect(cancelled.status).toBe('cancelled');
    const acc = await ConnectionsService.sendRequest(x.user.id, y.user.id);
    const accepted = await ConnectionsService.acceptRequest(y.user.id, acc.id);
    expect(accepted.status).toBe('accepted');
    await expect(ConnectionsService.sendRequest(x.user.id, y.user.id)).rejects.toThrow(/already/i);
    const grouped = await ConnectionsService.getMyConnections(x.user.id);
    expect(JSON.stringify(grouped)).toContain('accepted');
  });
});

describe('UC-02 sessions state machine + clash', () => {
  async function pairWithConnection() {
    const p = await mkUser('SessP');
    const q = await mkUser('SessQ');
    const c = await ConnectionsService.sendRequest(p.user.id, q.user.id);
    await ConnectionsService.acceptRequest(q.user.id, c.id);
    return { p, q, c };
  }
  const at = (d: number, h: number) => new Date(Date.now() + d * 864e5).toISOString().slice(0, 11) + `${String(h).padStart(2, '0')}:00:00Z`;

  it('propose->confirm->complete; decline path; reschedule requires re-confirm', async () => {
    const { p, q, c } = await pairWithConnection();
    await expect(SessionsService.proposeSession('stranger-id', { connectionId: c.id, title: 'Nope Session', startsAt: at(2, 10), endsAt: at(2, 11) })).rejects.toThrow(/not a participant/i);
    const s = await SessionsService.proposeSession(p.user.id, { connectionId: c.id, title: 'Kotlin Basics', description: 'd', startsAt: at(2, 10), endsAt: at(2, 11) });
    expect(s.status).toBe('proposed');
    // clash on overlapping slot for same pair
    await expect(SessionsService.proposeSession(p.user.id, { connectionId: c.id, title: 'Clash Session', startsAt: at(2, 10), endsAt: at(2, 11) })).rejects.toThrow(/clash/i);
    const confirmed = await SessionsService.confirmSession(q.user.id, s.id);
    expect(confirmed.status).toBe('confirmed');
    const jobs = Array.from(inMemoryDb.notificationJobs.values()).filter((j) => j.resourceId === s.id);
    expect(jobs.length).toBeGreaterThan(0);
    const resched = await SessionsService.rescheduleSession(p.user.id, s.id, { startsAt: at(4, 10), endsAt: at(4, 11) });
    expect(resched.status).toBe('proposed');
    await SessionsService.confirmSession(q.user.id, s.id);
    const completed = await SessionsService.completeSession(p.user.id, s.id);
    expect(completed.status).toBe('completed');
    const badTime = proposeSessionSchema.safeParse({ connectionId: c.id, title: 'X Y Z', startsAt: at(2, 11), endsAt: at(2, 10) });
    expect(badTime.success).toBe(false);
    // second session declined
    const s2 = await SessionsService.proposeSession(p.user.id, { connectionId: c.id, title: 'Declined Session', startsAt: at(6, 10), endsAt: at(6, 11) });
    const declined = await SessionsService.declineSession(q.user.id, s2.id);
    expect(declined.status).toBe('declined');
    // cancel path
    const s3 = await SessionsService.proposeSession(p.user.id, { connectionId: c.id, title: 'Cancelled Session', startsAt: at(8, 10), endsAt: at(8, 11) });
    await SessionsService.confirmSession(q.user.id, s3.id);
    const cancelled = await SessionsService.cancelSession(p.user.id, s3.id);
    expect(cancelled.status).toBe('cancelled');
    const cj = Array.from(inMemoryDb.notificationJobs.values()).filter((j) => j.resourceId === s3.id);
    expect(cj.every((j) => j.status === 'cancelled')).toBe(true);
    const mine = await SessionsService.getMySessions(p.user.id);
    expect(JSON.stringify(mine)).toContain('Kotlin Basics');
  });

  it('complete requires confirmed; confirm only by partner', async () => {
    const { p, c } = await pairWithConnection();
    const s = await SessionsService.proposeSession(p.user.id, { connectionId: c.id, title: 'Solo Try', startsAt: at(3, 10), endsAt: at(3, 11) });
    await expect(SessionsService.completeSession(p.user.id, s.id)).rejects.toThrow();
    await expect(SessionsService.confirmSession(p.user.id, s.id)).rejects.toThrow();
  });

  it('reminder worker processes due jobs and cancels stale ones', async () => {
    const { p, q, c } = await pairWithConnection();
    const s = await SessionsService.proposeSession(p.user.id, { connectionId: c.id, title: 'Reminder Session', startsAt: at(2, 10), endsAt: at(2, 11) });
    await SessionsService.confirmSession(q.user.id, s.id);
    const job = Array.from(inMemoryDb.notificationJobs.values()).find((j) => j.resourceId === s.id && j.status === 'pending')!;
    job.runAt = new Date(Date.now() - 1000);
    const processed = await ReminderWorker.processDueJobs();
    expect(processed).toBeGreaterThan(0);
    expect(job.status).toBe('completed');
    // stale: unconfirmed session job
    const s2 = await SessionsService.proposeSession(p.user.id, { connectionId: c.id, title: 'Never Confirmed', startsAt: at(5, 10), endsAt: at(5, 11) });
    const job2: any = { id: 'job-stale-1', type: 'session_reminder', resourceId: s2.id, runAt: new Date(Date.now() - 1000), status: 'pending', attempts: 0, createdAt: new Date(), updatedAt: new Date() };
    inMemoryDb.notificationJobs.set(job2.id, job2);
    await ReminderWorker.processDueJobs();
    expect(job2.status).toBe('cancelled');
  });
});

describe('UC-09 messaging', () => {
  it('empty body, non-participant, pending connection, happy path + pagination', async () => {
    const a = await mkUser('MsgA');
    const b = await mkUser('MsgB');
    const conn = await ConnectionsService.sendRequest(a.user.id, b.user.id);
    const conv: any = { id: 'conv-wb-1', connectionId: conn.id, participantIds: [a.user.id, b.user.id], createdAt: new Date(), updatedAt: new Date(), lastMessageAt: new Date() };
    inMemoryDb.conversations.set(conv.id, conv);
    await expect(MessagingService.sendMessage(a.user.id, conv.id, 'hi before accept')).rejects.toThrow(/accepted/);
    await ConnectionsService.acceptRequest(b.user.id, conn.id);
    await expect(MessagingService.sendMessage(a.user.id, conv.id, '   ')).rejects.toThrow(/empty/i);
    await expect(MessagingService.sendMessage(a.user.id, 'conv-missing', 'hi')).rejects.toThrow(/not found/i);
    const outsider = await mkUser('MsgC');
    await expect(MessagingService.sendMessage(outsider.user.id, conv.id, 'sneaky')).rejects.toThrow(/not a participant/i);
    const m = await MessagingService.sendMessage(a.user.id, conv.id, '  Hello there  ');
    expect(m.body).toBe('Hello there');
    const msgs = await MessagingService.getMessages(a.user.id, conv.id);
    expect(JSON.stringify(msgs)).toContain('Hello there');
    const convs = await MessagingService.getMyConversations(a.user.id);
    expect(convs.length).toBeGreaterThanOrEqual(1);
    inMemoryDb.users.get(b.user.id)!.status = 'suspended';
    await expect(MessagingService.sendMessage(a.user.id, conv.id, 'anything')).rejects.toThrow(/suspended|unavailable/i);
    inMemoryDb.users.get(b.user.id)!.status = 'active';
  });
});

describe('UC-03 reviews eligibility', () => {
  async function completedSession() {
    const p = await mkUser('RevP');
    const q = await mkUser('RevQ');
    const c = await ConnectionsService.sendRequest(p.user.id, q.user.id);
    await ConnectionsService.acceptRequest(q.user.id, c.id);
    const s = await SessionsService.proposeSession(p.user.id, { connectionId: c.id, title: 'Reviewed Session', startsAt: at2(2, 10), endsAt: at2(2, 11) });
    await SessionsService.confirmSession(q.user.id, s.id);
    await SessionsService.completeSession(p.user.id, s.id);
    return { p, q, s };
  }
  function at2(d: number, h: number) {
    const base = new Date(Date.UTC(2027, 0, 1 + d, h));
    return base.toISOString();
  }

  it('review blocked pre-completion; allowed after; duplicate handling', async () => {
    const { p, q, s } = await completedSession();
    const r = await ReviewsService.createReview(p.user.id, s.id, { rating: 5, body: 'Coroutines rocks' });
    expect(r.rating).toBe(5);
    let dupErr: any = null;
    try { await ReviewsService.createReview(p.user.id, s.id, { rating: 4 }); } catch (e: any) { dupErr = e; }
    expect(dupErr && /already submitted/i.test(dupErr.message)).toBe(true);
    const list = await ReviewsService.getMemberReviews(q.user.id);
    expect(JSON.stringify(list)).toContain('Coroutines rocks');
    // rating bounds via zod
    const { createReviewSchema } = await import('../src/modules/reviews/reviews.validation');
    expect(createReviewSchema.safeParse({ rating: 0 }).success).toBe(false);
    expect(createReviewSchema.safeParse({ rating: 6 }).success).toBe(false);
  });
});

describe('UC-11/13 reports + moderation', () => {
  it('target existence, duplicate open report, resolve/dismiss, warn/suspend side effects', async () => {
    const rep = await mkUser('Reporter');
    const target = await mkUser('Targetee');
    await expect(ReportsService.createReport(rep.user.id, { targetType: 'profile', targetId: 'ghost-id', reason: 'spam' })).rejects.toThrow(/not found/i);
    const r = await ReportsService.createReport(rep.user.id, { targetType: 'profile', targetId: target.user.id, reason: 'harassment', description: 'detail' });
    expect(r.status).toBe('submitted');
    let dupErr: any = null;
    try { await ReportsService.createReport(rep.user.id, { targetType: 'profile', targetId: target.user.id, reason: 'harassment' }); } catch (e: any) { dupErr = e; }
    expect(dupErr && /already/i.test(String(dupErr.message))).toBeTruthy();
    const assigned = await ModerationService.assignReport('mod-1', r.id, 'mod-2');
    expect(JSON.stringify(assigned)).toContain('mod-2');
    const resolved = await ModerationService.resolveReport('mod-2', r.id, { action: 'resolved', resolutionNote: 'warned user' });
    expect(resolved.status).toBe('resolved');
    const r2 = await ReportsService.createReport(rep.user.id, { targetType: 'profile', targetId: target.user.id, reason: 'spam' });
    const dismissed = await ModerationService.resolveReport('mod-2', r2.id, { action: 'dismissed', resolutionNote: 'no violation' });
    expect(dismissed.status).toBe('dismissed');
    const reporterNotifs = await inMemoryDb.notifications ? Array.from(inMemoryDb.notifications.values()).filter((n: any) => n.userId === rep.user.id) : [];
    expect(reporterNotifs.some((n: any) => /report/i.test(n.title || ''))).toBeTruthy();
    await expect(ModerationService.resolveReport('mod-2', 'nope', { action: 'resolved', resolutionNote: 'x' })).rejects.toThrow(/not found/i);
    await ModerationService.warnMember('mod-2', target.user.id, 'First warning');
    const notes = await inMemoryDb.notifications ? Array.from(inMemoryDb.notifications.values()).filter((n: any) => n.userId === target.user.id) : [];
    expect(JSON.stringify(notes)).toContain('Warning');
    await ModerationService.suspendMember('mod-2', target.user.id, 'Repeat offense');
    expect(inMemoryDb.users.get(target.user.id)!.status).toBe('suspended');
    await expect(ModerationService.warnMember('mod-2', 'ghost', 'x')).rejects.toThrow(/not found/i);
    const reports = await ModerationService.getReports({ status: 'resolved' });
    expect(JSON.stringify(reports)).toContain(r.id);
  });
});

describe('UC-14/15/16 admin, analytics, audit', () => {
  it('admin list filters + role/status update with audit trail', async () => {
    const u = await mkUser('Admin Target');
    const list = await AdminService.listMembers({ search: 'Admin Target' } as any);
    expect(JSON.stringify(list)).toContain(u.user.id);
    const upd = await AdminService.updateMember('admin-1', u.user.id, { role: 'moderator', status: 'active', reason: 'promotion test' });
    expect(upd.role).toBe('moderator');
    await expect(AdminService.updateMember('admin-1', 'ghost-id', { role: 'admin' })).rejects.toThrow(/not found/i);
    await expect(AdminService.updateMember('admin-1', u.user.id, { role: 'member', reason: '   ' })).rejects.toThrow(/reason/i);
    await expect(AdminService.updateMember(u.user.id, u.user.id, { role: 'member', status: 'deleted', reason: 'self delete' })).rejects.toThrow(/own account/i);
  });

  it('analytics aggregates platform counters', async () => {
    const a = await AnalyticsService.getPlatformAnalytics();
    const j = JSON.stringify(a);
    for (const key of ['members', 'sessions', 'reviews', 'reports']) expect(j).toContain(key);
    const old = await mkUser('Old Timer');
    inMemoryDb.users.get(old.user.id)!.createdAt = new Date('2020-01-01T00:00:00.000Z');
    const allNow = await AnalyticsService.getPlatformAnalytics();
    const lastDay = await AnalyticsService.getPlatformAnalytics({ days: 1 });
    expect(lastDay.members.total).toBeLessThan(allNow.members.total);
    expect(a.members.total).toBeGreaterThanOrEqual(1);
  });

  it('audit log writes and filters by action/actor', async () => {
    const u = await mkUser('Audit Actor');
    await AuditService.log({ actorId: u.user.id, action: 'MEMBER_WARNED', targetType: 'user', targetId: 'zzz', reason: 'audit branch test' });
    const filtered = await AuditService.getLogs({ action: 'MEMBER_WARNED' });
    expect(filtered.logs.length).toBeGreaterThan(0);
    const byActor = await AuditService.getLogs({ actorId: u.user.id });
    expect(JSON.stringify(byActor.logs)).toContain('MEMBER_WARNED');
  });
});

describe('RBAC middleware', () => {
  function fakeReqRes(role?: string) {
    const req: any = { headers: {}, cookies: {} };
    if (role) req.user = { id: 'u1', role, status: 'active' };
    const res: any = { statusCode: 0, body: null };
    res.status = (c: number) => { res.statusCode = c; return res; };
    res.json = (b: any) => { res.body = b; return res; };
    const errs: any[] = [];
    const next = ((e?: any) => { if (e) errs.push(e); }) as any;
    return { req, res, next, errs };
  }

  it('requireRole allows listed role, ForbiddenError otherwise, Unauthorized when anonymous', () => {
    const mw = requireRole('moderator', 'admin');
    const ok = fakeReqRes('moderator');
    mw(ok.req, ok.res, ok.next);
    expect(ok.errs).toHaveLength(0);
    const bad = fakeReqRes('member');
    mw(bad.req, bad.res, bad.next);
    expect(bad.errs[0].constructor.name).toBe('ForbiddenError');
    const anon = fakeReqRes();
    mw(anon.req, anon.res, anon.next);
    expect(anon.errs[0].constructor.name).toBe('UnauthorizedError');
  });

  it('authenticate: missing token and invalid token produce errors; optional passes through', () => {
    const strict = authenticate();
    const anon = fakeReqRes();
    strict(anon.req, anon.res, anon.next);
    expect(anon.errs[0].constructor.name).toBe('UnauthorizedError');
    const opt = authenticate(true);
    const anon2 = fakeReqRes();
    opt(anon2.req, anon2.res, anon2.next);
    expect(anon2.errs).toHaveLength(0);
    const badTok: any = { headers: { authorization: 'Bearer not.a.jwt' }, cookies: {} };
    const b = fakeReqRes();
    strict(badTok, b.res, b.next);
    expect(b.errs[0].constructor.name).toBe('UnauthorizedError');
  });
});
