# Deployment and Operations

## Environments
- Local: developer machines with seeded non-production data.
- Test: automated integration environment.
- Staging: production-like configuration and acceptance testing.
- Production: restricted access, monitored, backed up.

## Proposed topology
- Static frontend hosting/CDN.
- API application container.
- Background worker container.
- PostgreSQL managed database.
- WebSocket endpoint through a proxy that supports upgrades.
- Email provider.
- Centralized logs and metrics.

## Configuration
Use environment variables or a secret manager. Example names:
```text
NODE_ENV
PORT
APP_ORIGIN
API_BASE_URL
DATABASE_URL
SESSION_SECRET
EMAIL_PROVIDER_API_KEY
EMAIL_FROM_ADDRESS
REDIS_URL
LOG_LEVEL
```
Never commit real values. Keep separate secrets per environment.

## CI/CD
1. Install locked dependencies.
2. Lint and type-check.
3. Run unit and integration tests.
4. Run dependency and secret scans.
5. Build frontend/API/worker.
6. Deploy to staging.
7. Run smoke tests and migration checks.
8. Require approval for production.
9. Deploy with rollback plan.

## Database
- Versioned migrations.
- Daily backups as required by the SRS.
- Encrypt backups.
- Define retention with project owner and applicable policy.
- Test restore regularly; a backup that has never been restored is unverified.
- Run migrations as a controlled release step.

## Monitoring and alerts
Alert on elevated 5xx rate, sustained latency, DB saturation, worker queue delay, email failures, and repeated authentication abuse. Keep logs free of secrets and private message bodies.

## Release checklist
- [ ] Environment secrets configured.
- [ ] TLS and secure headers enabled.
- [ ] Database backup completed and restore process tested.
- [ ] Migrations reviewed.
- [ ] Staff accounts and permissions checked.
- [ ] Email delivery verified.
- [ ] Reminder worker running.
- [ ] Error monitoring enabled.
- [ ] Rollback plan documented.
- [ ] Privacy and moderation policies published.
