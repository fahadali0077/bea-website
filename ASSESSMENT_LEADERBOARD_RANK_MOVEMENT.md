# Assessment Submission: Leaderboard Rank-Movement Functionality

## Technical Approach & Overview

This document summarizes the technical implementation of the leaderboard rank-movement feature, database snapshot deduplication, and frontend badge rendering.

---

## 1. Requirements Met

| Requirement | Implementation Summary |
|---|---|
| **1. Store Leaderboard Snapshots** | Enforced composite unique indexing on `LeaderboardSnapshot` (`[competitionId, userId, scope, scopeId, snapshotDate]`) and `AmbassadorLeaderboardSnapshot` (`[userId, snapshotDate]`). |
| **2. Calculate Rank Movement** | Queries the latest available historical snapshot (`snapshotDate < currentDate`) within the same competition and scope. Computes position delta: $\text{previousRank} - \text{currentRank}$. |
| **3. Replace Hardcoded `rankMovement: 0`** | Replaced mock values with dynamic snapshot comparison logic across all scopes (Campus, Market, National, Participation, and Ambassador metrics). |
| **4. Display `+3`, `-2`, `0`, `New` on Frontend** | Updated `<MovementBadge />` and table formatters across frontend dashboard views to render `+3` (green), `-2` (red), `0` (gray), and `New` (blue). |
| **5. Prevent Duplicate Snapshots** | Added `skipDuplicates: true` in Prisma `createMany` calls and composite unique constraints at the database level. |
| **6. Backward Compatibility** | Verified against existing system test suites (`test:leaderboards` & `test:leaderboard-srs`). |

---

## 2. Migration & Database Schema Changes

Added composite unique indexes in [`prisma/schema.prisma`](../bea-backend/prisma/schema.prisma):

```prisma
model LeaderboardSnapshot {
  ...
  @@unique([competitionId, userId, scope, scopeId, snapshotDate])
  @@index([competitionId, scope, scopeId, snapshotDate, capturedAt])
}

model AmbassadorLeaderboardSnapshot {
  ...
  @@unique([userId, snapshotDate])
  @@index([snapshotDate, capturedAt])
}
```

### Steps to Apply Database Migration Locally:
```bash
cd bea-backend
npx prisma db push --accept-data-loss
npx prisma generate
```

---

## 3. How to Verify in Local Environment

### A. Automated Backend Verification
Run the automated verification scripts inside `bea-backend`:
```bash
cmd /c npm run test:leaderboards
cmd /c npm run test:leaderboard-srs
```
Both test suites will pass cleanly:
- `Dashboard and leaderboard verification passed.`
- `BEA-014 leaderboard SRS verification passed.`

### B. Manual Local Verification (Frontend & API)

1. **Start Backend & Frontend Servers**:
   - Backend: `cd bea-backend && npm run dev` (Port `4000`)
   - Frontend: `cd bea-website && npm run dev` (Port `3000`)

2. **Trigger Snapshot Capture**:
   Execute the snapshot generation script:
   ```bash
   node scripts/snapshot-leaderboards.js
   ```

3. **Verify Deduplication**:
   Re-run `node scripts/snapshot-leaderboards.js` on the same day. Confirm no duplicate snapshot records are inserted in PostgreSQL.

4. **Verify UI Badges**:
   - Navigate to `http://localhost:3000/dashboard/leaderboard`
   - Observe rank movement badges displaying **`+3`** (green), **`-2`** (red), **`0`** (gray), or **`New`** (blue).

---

## 4. Assumptions

1. **Rank Movement Math**: In leaderboard rankings, a lower numerical rank indicates a higher position (Rank #1 is top). Thus, $\text{previousRank} - \text{currentRank} > 0$ yields upward movement (e.g. $5 - 2 = +3$).
2. **Snapshot Resolution**: If no snapshot exists for yesterday ($T-1$), the algorithm safely falls back to the most recent historical snapshot prior to $T-1$ for the exact same competition and scope.
