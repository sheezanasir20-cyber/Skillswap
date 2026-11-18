# Skill Matching Rules

## Purpose
Suggest people with reciprocal learning value. A member should be able to understand why another person appears in results.

## Eligibility
A candidate is eligible only when:
- Candidate is active and not suspended/deleted.
- Candidate is not the requesting member.
- Candidate is not blocked by or blocking the requester.
- Candidate has at least one skill they can teach that the requester wants to learn.
- The requester has at least one skill they can teach that the candidate wants to learn for a reciprocal match. If one-way discovery is allowed, label it clearly as a partial match.
- Privacy and discovery settings permit visibility.

## Initial ranking proposal
This scoring is an implementation proposal, not specified by the SRS:
- Reciprocal skill overlap: 0–50 points.
- Skill-level compatibility: 0–20 points.
- Availability overlap: 0–20 points.
- Profile completeness: 0–5 points.
- Recent activity: 0–5 points.

Total: 100 points. Do not show a percentage as a promise of success. Prefer a plain explanation:
“You can teach JavaScript, and Sam wants to learn it. Sam can teach Figma, which is on your learning list.”

## Level compatibility
Treat levels as descriptive, not proof:
- Beginner ↔ Intermediate: potentially compatible.
- Intermediate ↔ Advanced: potentially compatible.
- Same-level pairings: allowed.
- Avoid rigidly excluding members based only on self-selected level.

## Availability
Compare normalized time windows using each member's timezone. Do not expose detailed weekly availability publicly; show a broad overlap summary until connected.

## Search filters
- Skill (teach/learn intent)
- Level
- General availability
- Optional text query

## Cold-start behavior
If a member has no reciprocal match:
- Suggest completing their skill list.
- Offer one-way matches with explicit “partial match” label if product owner approves.
- Do not invent suggested users or skill data.

## Evaluation
Measure click-through, request rate, acceptance rate, and completed-session rate. Review ranking quality for unfairly suppressing new members. Do not use protected or sensitive personal attributes in ranking.
