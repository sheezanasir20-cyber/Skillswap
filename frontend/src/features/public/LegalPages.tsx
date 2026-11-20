import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="container" style={{ maxWidth: '800px', padding: 'var(--space-16) var(--space-6)' }}>
      <div className="paper-card" style={{ padding: 'var(--space-10)' }}>
        <h1
          style={{
            fontSize: '2.25rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            color: 'var(--color-forest-950)',
            letterSpacing: '-0.025em',
            marginBottom: 'var(--space-2)',
          }}
        >
          Terms of Service
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', marginBottom: 'var(--space-8)' }}>
          Last updated: November 2026 • SkillSwap Community Standards
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', fontSize: '0.9375rem', lineHeight: 1.65, color: 'var(--color-ink)' }}>
          <p>
            Welcome to SkillSwap. By creating an account or using our website, you agree to comply with
            and be bound by these Terms of Service.
          </p>

          <div>
            <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-forest-950)', marginBottom: 'var(--space-2)' }}>
              1. Purpose and Exchange Model
            </h2>
            <p style={{ color: 'var(--color-ink-soft)' }}>
              SkillSwap is a platform designed exclusively for reciprocal, non-monetary skill exchange.
              Members agree not to solicit payments, fees, or monetary compensation for skills taught
              through the platform. SkillSwap is not a freelance marketplace or paid tutoring agency.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-forest-950)', marginBottom: 'var(--space-2)' }}>
              2. Code of Conduct
            </h2>
            <p style={{ color: 'var(--color-ink-soft)' }}>
              Members must treat each other with respect. Harassment, hate speech, commercial advertising,
              spam, fraud, and inappropriate conduct are strictly prohibited. Violations may result in
              warnings, content removal, or permanent account suspension audited by our moderation team.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-forest-950)', marginBottom: 'var(--space-2)' }}>
              3. External Services and Safety
            </h2>
            <p style={{ color: 'var(--color-ink-soft)' }}>
              SkillSwap does not host video or audio streams. Sessions occur through external third-party
              services chosen by members (e.g. Google Meet, Zoom, Discord). SkillSwap does not guarantee the quality, accuracy, or
              effectiveness of any skill exchange.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PrivacyPage: React.FC = () => {
  return (
    <div className="container" style={{ maxWidth: '800px', padding: 'var(--space-16) var(--space-6)' }}>
      <div className="paper-card" style={{ padding: 'var(--space-10)' }}>
        <h1
          style={{
            fontSize: '2.25rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            color: 'var(--color-forest-950)',
            letterSpacing: '-0.025em',
            marginBottom: 'var(--space-2)',
          }}
        >
          Privacy Policy
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', marginBottom: 'var(--space-8)' }}>
          Last updated: November 2026 • Data Protection & Member Boundary
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', fontSize: '0.9375rem', lineHeight: 1.65, color: 'var(--color-ink)' }}>
          <p>
            Your privacy is foundational to our community. This Privacy Policy describes how SkillSwap collects,
            protects, and uses information provided by members.
          </p>

          <div>
            <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-forest-950)', marginBottom: 'var(--space-2)' }}>
              1. Information We Collect
            </h2>
            <p style={{ color: 'var(--color-ink-soft)' }}>
              We collect basic profile information (display name, email address, password hash, bio,
              timezone), skill listings, general availability slots, in-app messages, session records,
              and reviews.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-forest-950)', marginBottom: 'var(--space-2)' }}>
              2. Strict Privacy Boundary
            </h2>
            <p style={{ color: 'var(--color-ink-soft)' }}>
              Your email address is strictly confidential and is never shown to other members or public
              visitors. Only your display name, bio, and listed skills are visible in discovery and
              matching. In-app messages and session details are accessible exclusively to accepted connection participants.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-forest-950)', marginBottom: 'var(--space-2)' }}>
              3. Security and Storage
            </h2>
            <p style={{ color: 'var(--color-ink-soft)' }}>
              Passwords are encrypted using cryptographically hardened key derivation functions. Session identifiers are stored in
              secure, HttpOnly cookies. We do not sell personal data to third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
