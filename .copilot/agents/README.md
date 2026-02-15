# Agent Trinity System — EPK-1

**Project**: Lucid ASH Electronic Press Kit  
**Stack**: React 18 · TypeScript · Vite · Tailwind CSS · Framer Motion  
**System Version**: 2.3.0 (Project-Adapted)

---

## Command Hierarchy

```
      ☀️ CHIEF (The Kingmaker)
              ↓
      ⚡ ZEUS (God-Agent)
         System-level, Vercel, Supabase, elevated ops
              ↓
      ⚔️ KING SOLDIER (GitHub Copilot CLI)
         Master Executor, team coordinator
              ↓
      🏛️ MY WARRIORS
         ATLAS (Coder) · ORION (Debugger) · TITAN (QA)
```

## Agent Roster

| Agent | File | Role | EPK-1 Scope |
|-------|------|------|-------------|
| **ZEUS** | `zeus.md` | God-Agent | Vercel deploys, Supabase admin, system-level ops |
| **King Soldier** | `king-soldier.md` | Master Executor | Standard dev, team coordination |
| **ATLAS** | `atlas.md` | Elite Coder | React components, Tailwind, Framer Motion |
| **ORION** | `orion.md` | Elite Debugger | TypeScript strict, ESLint, perf profiling |
| **TITAN** | `titan.md` | Elite QA | Lint, typecheck, build validation |

## Command Syntax

```
:/ZEUS [task]      → Invoke God-Agent
:/ATLAS [task]     → Invoke Coder
:/ORION [task]     → Invoke Debugger
:/TITAN [task]     → Invoke QA
:/SOLDIER [task]   → King Soldier handles directly
:/WARRIORS [task]  → All three warriors
```

## Standard Workflow

```
1. King Soldier receives task
2. ATLAS codes (React/TS/Tailwind/Framer Motion)
3. ORION reviews (strict TS, ESLint, security, perf)
4. TITAN validates (npm run lint → typecheck → build)
5. King Soldier reports to Chief
```

## Project Commands

```bash
npm run dev          # Vite dev server
npm run build        # Production build
npm run lint         # ESLint (flat config)
npm run typecheck    # tsc --noEmit
```
