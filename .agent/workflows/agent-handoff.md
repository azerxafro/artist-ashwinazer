---
name: Agent Handoff Protocol
description: Inter-agent communication protocol for EPK-1 project
version: 2.0.0-epk1
---

# Agent Handoff Protocol — EPK-1 🔄

Inter-agent communication protocol for seamless task coordination between NEXUS, SENTINEL, and GUARDIAN on the Lucid ASH EPK project.

---

## Agent Communication Flow

```
Chief → Task Request
    ↓
NEXUS (Code) → React/TS/Tailwind/Framer Motion implementation
    ↓ Handoff
SENTINEL (Debug) → Strict TS, ESLint, animation perf, CVE scan
    ↓ Handoff
GUARDIAN (QA) → npm run lint → typecheck → build
    ↓ Report
Chief ← Final verdict (APPROVED / REJECTED)
```

---

## Handoff Artifacts

### Location

```text
.agent/handoffs/
├── active/          # Current handoffs in progress
└── completed/       # Archived completed handoffs
```

### Naming Convention

```text
[timestamp]-[from-agent]-[to-agent]-[type].md
Example: 2026-02-11-nexus-sentinel-code-review.md
```

---

## NEXUS → SENTINEL Handoff

**When**: New component/feature code complete, refactoring finished, bug fix implemented.

```yaml
---
handoff_id: NH-[timestamp]
from: NEXUS
to: SENTINEL
type: code_review | bug_fix | refactor | new_feature
priority: critical | high | medium | low
---

# Code Handoff: [Brief Description]

## Summary
[What was implemented]

## Files Changed
| File | Change Type | Risk Level | Description |
|------|-------------|------------|-------------|
| `src/components/X.tsx` | New | Medium | New EPK section |

## EPK-1 Conventions Followed
- [ ] Section pattern (numbered header, max-w-7xl)
- [ ] Framer Motion whileInView + viewport once
- [ ] Tailwind utilities only
- [ ] lucide-react icons only
- [ ] Color palette (#050505, #00f2ff, white opacity)
- [ ] Typography (Syne headings, Inter body)

## Debug Focus Areas
1. [TypeScript strict mode compliance]
2. [Framer Motion animation performance]
3. [ESLint rule violations]
```

---

## SENTINEL → GUARDIAN Handoff

**When**: Debugging complete, no critical bugs, ready for QA.

```yaml
---
handoff_id: SH-[timestamp]
from: SENTINEL
to: GUARDIAN
type: debug_complete
priority: critical | high | medium | low
---

# Debug Complete: [Brief Description]

## Bugs Found & Fixed
| Bug ID | Severity | File | Description | Status |
|--------|----------|------|-------------|--------|
| BUG-001 | Minor | `X.tsx:42` | Unused param | Fixed |

## Validation Results
| Check | Result | Details |
|-------|--------|---------|
| TypeScript strict | ✅ Pass | 0 errors |
| ESLint | ✅ Pass | 0 violations |
| npm audit | ✅ Pass | No vulnerabilities |
| Animation perf | ✅ Pass | No jank detected |

## Recommended Tests for GUARDIAN
- [ ] Run full pipeline: `npm run lint && npm run typecheck && npm run build`
- [ ] Verify section conventions
- [ ] Check responsive layout
```

---

## GUARDIAN → NEXUS Revision Request

**When**: Pipeline failures, convention violations, or security issues found.

```yaml
---
handoff_id: GN-[timestamp]
from: GUARDIAN
to: NEXUS
type: revision_request
priority: critical | high | medium | low
---

# Revision Required: [Brief Description]

## Pipeline Results
| Step | Result | Details |
|------|--------|---------|
| lint | ❌ FAIL | react-hooks/exhaustive-deps |
| typecheck | ✅ PASS | |
| build | ✅ PASS | |

## Issues Found
### Critical (Block Deploy)
- **File**: `src/components/X.tsx:42`
- **Issue**: Missing dependency in useEffect
- **Fix**: Add `scrollY` to dependency array

## After Revision
Return to GUARDIAN for re-validation via full pipeline.
```

---

## SENTINEL → NEXUS Escalation

**When**: Bug found that requires code change.

```yaml
---
handoff_id: SN-[timestamp]
from: SENTINEL
to: NEXUS
type: fix_required
priority: critical | high | medium | low
---

# Fix Required: [Brief Description]

## Issue
- **File**: `src/components/X.tsx`
- **Line**: 42
- **Type**: TypeScript strict mode violation
- **Description**: Unused parameter `index` in map callback
- **Fix**: Use `_index` or remove parameter

## After Fix
Return to SENTINEL for verification, then GUARDIAN for QA.
```

---

## Handoff Status Values

| Status | Description |
|--------|-------------|
| `PENDING` | Handoff created, awaiting pickup |
| `IN_PROGRESS` | Receiving agent working |
| `COMPLETE` | Work finished |
| `ESCALATED` | Issue found, returned to sender |

---

## Emergency Protocols

### Critical Security Issue
```
All agents: STOP → Assess → Coordinate → Fix → Document
```

### Production Bug (Vercel)
```
HOTFIX: NEXUS (fix) → SENTINEL (verify) → GUARDIAN (approve) → Deploy
```

---

*Agent Handoff Protocol v2.0.0-epk1 — Coordinate. Communicate. Complete.*
