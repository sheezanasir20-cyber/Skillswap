// Black-Box HTTP REST API Integration Test Suite
// Verifies all endpoints from the external client perspective using Supertest
import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { inMemoryDb } from '../src/services/db';
import { seedMockDatabase } from '../src/services/mockData';

let app: any;
let server: any;

const PW = 'TestPassword123!';
let userCounter = 0;
const uniqueEmail = () => `bb.api.${Date.now()}.${userCounter++}@blackbox.test`;

let tokenA: string;
let userA: any;

let tokenB: string;
let userB: any;

let tokenMod: string;
let userMod: any;

let tokenAdmin: string;
let userAdmin: any;

beforeAll(async () => {
  // Ensure DB has seed data for catalog and pre-existing staff
  if (inMemoryDb.users.size < 50) {
    seedMockDatabase(inMemoryDb);
  }
  const created = createApp();
  app = created.app;
  server = created.server;

  // Pre-create two standard members for bilateral workflow tests
  const regA = await request(app)
    .post('/api/v1/auth/register')
    .send({ email: uniqueEmail(), password: PW, displayName: 'Alice Test' });
  tokenA = regA.body.data.token;
  userA = regA.body.data.user;

  const regB = await request(app)
    .post('/api/v1/auth/register')
    .send({ email: uniqueEmail(), password: PW, displayName: 'Bob Test' });
  tokenB = regB.body.data.token;
  userB = regB.body.data.user;

  // Login as seeded moderator and admin
  const loginMod = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'mod@example.com', password: 'Password123!' });
  tokenMod = loginMod.body.data.token;
  userMod = loginMod.body.data.user;

  const loginAdmin = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'admin@example.com', password: 'Password123!' });
  tokenAdmin = loginAdmin.body.data.token;
  userAdmin = loginAdmin.body.data.user;
});

describe('1. Authentication & Registration (EP, BVA, Decision Table)', () => {
  it('BB-API-01: Valid user registration creates account and returns JWT (EP Valid)', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: uniqueEmail(), password: PW, displayName: 'Carol New' });

    expect(res.status).toBe(201);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.displayName).toBe('Carol New');
  });

  it('BB-API-02: Invalid email partition without domain rejected (EP Invalid)', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'not-an-email', password: PW, displayName: 'Bad Email' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('BB-API-03: Password below min boundary (7 chars) rejected (BVA)', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: uniqueEmail(), password: 'Pass1!', displayName: 'Short PW' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('BB-API-04: DisplayName below min boundary (1 char) rejected (BVA)', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: uniqueEmail(), password: PW, displayName: 'X' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('BB-API-05: Duplicate email registration returns 409 Conflict (Error Handling)', async () => {
    const dupEmail = uniqueEmail();
    await request(app)
      .post('/api/v1/auth/register')
      .send({ email: dupEmail, password: PW, displayName: 'Original' });

    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: dupEmail, password: PW, displayName: 'Duplicate' });

    expect(res.status).toBe(409);
    expect(res.body.error).toBeDefined();
  });

  it('BB-API-06: Valid login credentials return 200 OK + JWT (EP Valid)', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: userA.email, password: PW });

    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
  });

  it('BB-API-07: Invalid login password returns 401 Unauthorized (Error Handling)', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: userA.email, password: 'WrongPassword99!' });

    expect(res.status).toBe(401);
    expect(res.body.error).toBeDefined();
  });

  it('BB-API-08: Suspended account login returns 401 Unauthorized (Decision Table)', async () => {
    const suspEmail = uniqueEmail();
    const reg = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: suspEmail, password: PW, displayName: 'Suspended User' });
    
    // Suspend user in DB
    inMemoryDb.users.get(reg.body.data.user.id)!.status = 'suspended';

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: suspEmail, password: PW });

    expect(res.status).toBe(401);
    expect(res.body.error.message).toMatch(/suspended/i);
  });

  it('BB-API-09: Accessing optional /auth/me without token returns null user (Security)', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(200);
    expect(res.body.data.user).toBeNull();
  });

  it('BB-API-10: Accessing strict /members/me without token returns 401 (Security)', async () => {
    const res = await request(app).get('/api/v1/members/me');
    expect(res.status).toBe(401);
  });

  it('BB-API-11: Accessing /auth/me with valid Bearer token returns profile (Security/Auth)', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${tokenA}`);

    expect(res.status).toBe(200);
    expect(res.body.data.user.id).toBe(userA.id);
  });
});

describe('2. Member Profile, Skills & Availability (EP, BVA)', () => {
  it('BB-API-12: Public skills catalog endpoint returns list of standard skills (EP)', async () => {
    const res = await request(app).get('/api/v1/skills');
    expect(res.status).toBe(200);
    expect(res.body.data.skills.length).toBeGreaterThanOrEqual(10);
  });

  it('BB-API-13: Add teaching skill to member profile returns 201 Created (EP)', async () => {
    const res = await request(app)
      .post('/api/v1/members/me/skills')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ name: 'TypeScript Architecture', intent: 'teach', level: 'advanced' });

    expect(res.status).toBe(201);
    expect(res.body.data.skill.skill.name).toBe('TypeScript Architecture');
    expect(res.body.data.skill.intent).toBe('teach');
  });

  it('BB-API-14: Duplicate intent for identical skill rejected with 409 Conflict (DT)', async () => {
    const res = await request(app)
      .post('/api/v1/members/me/skills')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ name: 'TypeScript Architecture', intent: 'teach', level: 'intermediate' });

    expect(res.status).toBe(409);
    expect(res.body.error).toBeDefined();
  });

  it('BB-API-15: Member profile update with valid bio updates successfully (BVA)', async () => {
    const res = await request(app)
      .patch('/api/v1/members/me')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ bio: 'Software engineer and mentor with 10 years of experience.', timezone: 'America/New_York' });

    expect(res.status).toBe(200);
    expect(res.body.data.user.bio).toBe('Software engineer and mentor with 10 years of experience.');
    expect(res.body.data.user.timezone).toBe('America/New_York');
  });

  it('BB-API-16: Member availability slots set with valid weekday (0-6) intervals (BVA)', async () => {
    const res = await request(app)
      .put('/api/v1/members/me/availability')
      .set('Authorization', `Bearer ${tokenA}`)
      .send([
        { weekday: 1, startMinute: 540, endMinute: 1020, timezone: 'UTC' },
        { weekday: 3, startMinute: 600, endMinute: 900, timezone: 'UTC' }
      ]);

    expect(res.status).toBe(200);
    expect(res.body.data.availability.length).toBe(2);
  });

  it('BB-API-17: Member search directory filters by keyword (EP)', async () => {
    const res = await request(app)
      .get('/api/v1/members/search?q=Bob')
      .set('Authorization', `Bearer ${tokenA}`);

    expect(res.status).toBe(200);
    expect(res.body.data.members).toBeDefined();
    expect(res.body.data.members.some((m: any) => m.displayName.includes('Bob'))).toBe(true);
  });
});

describe('3. Bilateral Connections & Handshake (Use Case, Decision Table)', () => {
  let connectionId: string;

  it('BB-API-18: Member A sends connection request to Member B (Use Case)', async () => {
    const res = await request(app)
      .post('/api/v1/connections')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ recipientId: userB.id, requestNote: 'Hi Bob, excited to swap skills!' });

    expect(res.status).toBe(201);
    expect(res.body.data.connection.status).toBe('pending');
    expect(res.body.data.connection.recipientId).toBe(userB.id);
    connectionId = res.body.data.connection.id;
  });

  it('BB-API-19: Member cannot send connection request to self (DT / Error Handling)', async () => {
    const res = await request(app)
      .post('/api/v1/connections')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ recipientId: userA.id, requestNote: 'Self request' });

    expect(res.status).toBe(400);
    expect(res.body.error.message).toMatch(/yourself/i);
  });

  it('BB-API-20: Duplicate pending connection request returns 409 Conflict (DT)', async () => {
    const res = await request(app)
      .post('/api/v1/connections')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ recipientId: userB.id, requestNote: 'Another request' });

    expect(res.status).toBe(409);
  });

  it('BB-API-21: Unauthorized third party cannot accept connection (Security)', async () => {
    const res = await request(app)
      .post(`/api/v1/connections/${connectionId}/accept`)
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.status).toBe(403);
  });

  it('BB-API-22: Member B accepts connection request from Member A (Use Case)', async () => {
    const res = await request(app)
      .post(`/api/v1/connections/${connectionId}/accept`)
      .set('Authorization', `Bearer ${tokenB}`);

    expect(res.status).toBe(200);
    expect(res.body.data.connection.status).toBe('accepted');
  });

  it('BB-API-23: Member retrieve my connections list shows accepted connection (UC)', async () => {
    const res = await request(app)
      .get('/api/v1/connections')
      .set('Authorization', `Bearer ${tokenA}`);

    expect(res.status).toBe(200);
    expect(res.body.data.connections.accepted.some((c: any) => c.id === connectionId)).toBe(true);
  });
});

describe('4. Bilateral Messaging & Privacy (Security, BVA)', () => {
  let conversationId: string;

  beforeAll(async () => {
    const convs = await request(app)
      .get('/api/v1/conversations')
      .set('Authorization', `Bearer ${tokenA}`);
    conversationId = convs.body.data.conversations[0]?.id;
  });

  it('BB-API-24: Participant sends valid message in active conversation (EP Valid)', async () => {
    if (!conversationId) return;
    const res = await request(app)
      .post(`/api/v1/conversations/${conversationId}/messages`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ body: 'Hello Bob! When are you free for our exchange?' });

    expect(res.status).toBe(201);
    expect(res.body.data.message.body).toBe('Hello Bob! When are you free for our exchange?');
  });

  it('BB-API-25: Empty or whitespace-only message body rejected (BVA)', async () => {
    if (!conversationId) return;
    const res = await request(app)
      .post(`/api/v1/conversations/${conversationId}/messages`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ body: '     ' });

    expect(res.status).toBe(400);
  });

  it('BB-API-26: Non-participant cannot send message into conversation (Security)', async () => {
    if (!conversationId) return;
    const res = await request(app)
      .post(`/api/v1/conversations/${conversationId}/messages`)
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({ body: 'Intruder message' });

    expect(res.status).toBe(403);
  });
});

describe('5. Sessions Lifecycle & Conflict Prevention (State Machine, BVA, DT)', () => {
  let sessionId: string;
  let connectionId: string;

  beforeAll(async () => {
    const connRes = await request(app)
      .get('/api/v1/connections')
      .set('Authorization', `Bearer ${tokenA}`);
    connectionId = connRes.body.data.connections.accepted[0]?.id;
  });

  const futureTime = (days: number, hour: number) => {
    const d = new Date(Date.now() + days * 86400000);
    d.setUTCHours(hour, 0, 0, 0);
    return d.toISOString();
  };

  it('BB-API-27: Propose valid future session returns 201 Created (State: proposed)', async () => {
    const res = await request(app)
      .post('/api/v1/sessions')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        connectionId,
        title: 'Full Stack Architecture Mentorship',
        description: 'Reviewing database schemas and frontend state management.',
        startsAt: futureTime(3, 14),
        endsAt: futureTime(3, 15)
      });

    expect(res.status).toBe(201);
    expect(res.body.data.session.status).toBe('proposed');
    sessionId = res.body.data.session.id;
  });

  it('BB-API-28: Session with inverted start/end timestamps rejected (BVA)', async () => {
    const res = await request(app)
      .post('/api/v1/sessions')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        connectionId,
        title: 'Inverted Timestamps Session',
        startsAt: futureTime(4, 16),
        endsAt: futureTime(4, 15) // endsAt before startsAt
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('BB-API-29: Concurrent session slot clash for same bilateral pair rejected (DT)', async () => {
    const res = await request(app)
      .post('/api/v1/sessions')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        connectionId,
        title: 'Clashing Slot Session',
        startsAt: futureTime(3, 14),
        endsAt: futureTime(3, 15)
      });

    expect(res.status).toBe(409);
    expect(res.body.error.message).toMatch(/clash/i);
  });

  it('BB-API-30: Session creator cannot confirm their own proposed session (DT)', async () => {
    const res = await request(app)
      .post(`/api/v1/sessions/${sessionId}/confirm`)
      .set('Authorization', `Bearer ${tokenA}`);

    expect(res.status).toBe(400);
  });

  it('BB-API-31: Partner confirms proposed session (State: confirmed)', async () => {
    const res = await request(app)
      .post(`/api/v1/sessions/${sessionId}/confirm`)
      .set('Authorization', `Bearer ${tokenB}`);

    expect(res.status).toBe(200);
    expect(res.body.data.session.status).toBe('confirmed');
  });

  it('BB-API-32: Participant marks confirmed session as completed (State: completed)', async () => {
    const res = await request(app)
      .post(`/api/v1/sessions/${sessionId}/complete`)
      .set('Authorization', `Bearer ${tokenA}`);

    expect(res.status).toBe(200);
    expect(res.body.data.session.status).toBe('completed');
  });
});

describe('6. Reviews, Ratings & Eligibility Guard (BVA, DT)', () => {
  let completedSessionId: string;

  beforeAll(async () => {
    // Find completed session for userA
    const sessRes = await request(app)
      .get('/api/v1/sessions')
      .set('Authorization', `Bearer ${tokenA}`);
    const completed = sessRes.body.data.sessions.find((s: any) => s.status === 'completed');
    completedSessionId = completed?.id;
  });

  it('BB-API-33: Review rating boundary below min (0) rejected (BVA)', async () => {
    if (!completedSessionId) return;
    const res = await request(app)
      .post(`/api/v1/sessions/${completedSessionId}/reviews`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ rating: 0, body: 'Bad rating boundary' });

    expect(res.status).toBe(400);
  });

  it('BB-API-34: Review rating boundary above max (6) rejected (BVA)', async () => {
    if (!completedSessionId) return;
    const res = await request(app)
      .post(`/api/v1/sessions/${completedSessionId}/reviews`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ rating: 6, body: 'Super max boundary' });

    expect(res.status).toBe(400);
  });

  it('BB-API-35: Valid rating (5) on completed session submitted successfully (EP Valid)', async () => {
    if (!completedSessionId) return;
    const res = await request(app)
      .post(`/api/v1/sessions/${completedSessionId}/reviews`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ rating: 5, body: 'Outstanding mentorship and depth.' });

    expect(res.status).toBe(201);
    expect(res.body.data.review.rating).toBe(5);
  });

  it('BB-API-36: Duplicate review for same completed session rejected with 409 (DT)', async () => {
    if (!completedSessionId) return;
    const res = await request(app)
      .post(`/api/v1/sessions/${completedSessionId}/reviews`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ rating: 4, body: 'Second review attempt' });

    expect(res.status).toBe(409);
    expect(res.body.error.message).toMatch(/already submitted/i);
  });
});

describe('7. Moderation, Reports & Admin RBAC (Security, RBAC, DT)', () => {
  let createdReportId: string;

  it('BB-API-37: Member reports offending user profile returns 201 Created (EP)', async () => {
    const res = await request(app)
      .post('/api/v1/reports')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ targetType: 'profile', targetId: userB.id, reason: 'spam', description: 'Promotional spam links.' });

    expect(res.status).toBe(201);
    expect(res.body.data.report.status).toBe('submitted');
    createdReportId = res.body.data.report.id;
  });

  it('BB-API-38: Standard member accessing staff reports denied with 403 Forbidden (RBAC)', async () => {
    const res = await request(app)
      .get('/api/v1/staff/reports')
      .set('Authorization', `Bearer ${tokenA}`);

    expect(res.status).toBe(403);
  });

  it('BB-API-39: Moderator accessing staff reports returns 200 OK (RBAC)', async () => {
    const res = await request(app)
      .get('/api/v1/staff/reports')
      .set('Authorization', `Bearer ${tokenMod}`);

    expect(res.status).toBe(200);
    expect(res.body.data.reports).toBeDefined();
  });

  it('BB-API-40: Moderator resolves report with resolution note (State: resolved)', async () => {
    if (!createdReportId) return;
    const res = await request(app)
      .post(`/api/v1/staff/reports/${createdReportId}/resolve`)
      .set('Authorization', `Bearer ${tokenMod}`)
      .send({ action: 'resolved', resolutionNote: 'Reviewed and handled by moderator.' });

    expect(res.status).toBe(200);
    expect(res.body.data.report.status).toBe('resolved');
  });

  it('BB-API-41: Moderator issues formal warning to member (Action: warn)', async () => {
    const res = await request(app)
      .post(`/api/v1/staff/members/${userB.id}/warn`)
      .set('Authorization', `Bearer ${tokenMod}`)
      .send({ reason: 'Inappropriate profile advertising.' });

    expect(res.status).toBe(200);
    expect(res.body.data.message).toMatch(/warning/i);
  });

  it('BB-API-42: Admin accessing platform analytics returns aggregated counts (Admin)', async () => {
    const res = await request(app)
      .get('/api/v1/staff/analytics')
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.status).toBe(200);
    expect(res.body.data.analytics.members).toBeDefined();
    expect(res.body.data.analytics.sessions).toBeDefined();
  });

  it('BB-API-43: Admin accessing audit activity returns chronological trail (Audit)', async () => {
    const res = await request(app)
      .get('/api/v1/staff/activity')
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.status).toBe(200);
    expect(res.body.data.activity.length).toBeGreaterThan(0);
  });

  it('BB-API-44: Non-existent member profile request returns 404 Not Found (Error Handling)', async () => {
    const res = await request(app)
      .get('/api/v1/members/non-existent-user-uuid-999')
      .set('Authorization', `Bearer ${tokenA}`);

    expect(res.status).toBe(404);
  });
});
