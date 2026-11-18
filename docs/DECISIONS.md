# Decisions and Assumptions to Confirm

The supplied SRS establishes product behavior but leaves several implementation details open. Confirm these before development is considered final.

| Topic | Proposed default | Needs approval |
|---|---|---|
| Frontend stack | React + TypeScript + Vite | Yes |
| Backend stack | Node.js + TypeScript + Express | Yes |
| Database | PostgreSQL | Yes |
| Realtime | WebSocket/Socket.IO | Yes |
| Auth transport | Secure HttpOnly cookie session | Yes |
| Email provider | Select a provider | Yes |
| Reminder timing | 24 hours and 1 hour before | Yes |
| Match scoring | Weighted reciprocal score in `MATCHING.md` | Yes |
| One-way matches | Off by default; enable only if labelled partial | Yes |
| Member blocking | Recommended safety enhancement | Yes |
| Avatar upload | Optional; file limits and storage provider needed | Yes |
| Review editing | No edits after submission unless moderation workflow approves | Yes |
| Report retention | Define policy before production | Yes |
| Deleted accounts | Soft-delete/anonymize policy required | Yes |
| Timezone source | IANA timezone stored per member | Yes |
| Session completion | Participant action, with dispute handling to define | Yes |
| Analytics definitions | Define each metric and date basis | Yes |
| Custom skills | Catalogue-first; custom skill approval workflow to define | Yes |

## Source fidelity
The product scope and FR/NFR mapping are based on the supplied “Skill swape” SRS. Architecture, stack, endpoint shapes, schema, scoring weights, reminder schedule, and some safety enhancements are proposals added to make the pack actionable. They should be reviewed rather than treated as already-approved SRS requirements.
