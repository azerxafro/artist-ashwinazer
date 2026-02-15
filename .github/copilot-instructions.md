# Copilot Instructions

## Project Overview

This is an Electronic Press Kit (EPK) website for the music artist Ashwin Azer / Lucid ASH. It's a single-page React app with no routing — the page scrolls through numbered sections: Hero → Bio → Music → Gallery → Contact. All content is hardcoded; there is no backend or CMS. The contact form is non-functional (prevents default submit).

Scaffolded with [Bolt](https://bolt.new) (`bolt-vite-react-ts` template). Deployed on Vercel.

## Commands

- `npm run dev` — Start Vite dev server
- `npm run build` — Production build (`vite build`)
- `npm run lint` — ESLint (flat config, TS + React hooks + React Refresh rules)
- `npm run typecheck` — `tsc --noEmit -p tsconfig.app.json`
- `node scripts/optimize-images.js` — Convert source images in `public/images/` to WebP via Sharp

No test framework is configured.

## Architecture

**Stack:** React 18 + TypeScript + Vite + Tailwind CSS + Framer Motion

**Component structure:** `src/components/` contains one component per EPK section. Each section component is self-contained with its own data, layout, and animations. `App.tsx` composes them in order and adds a global scroll-progress bar and custom cursor.

**Styling approach:**
- Tailwind utility classes exclusively (no CSS modules, no styled-components)
- Global styles and CSS custom properties live in `index.html <style>` (fonts, accent color `--accent: #00f2ff`, scrollbar, animations, grain overlay)
- `src/index.css` only contains Tailwind directives
- `clsx` + `tailwind-merge` are available for conditional class merging

**Animation pattern:** Every section uses Framer Motion with a consistent pattern:
- `whileInView` + `viewport={{ once: true }}` for scroll-triggered entrance
- Staggered children via `transition={{ delay: i * 0.1 }}`
- Spring physics: `{ type: 'spring', damping: 20, stiffness: 250 }`

## Conventions

- **Section numbering:** Each content section renders a large cyan number (`01`, `02`, etc.) with a title, using `font-syne` for headings
- **Color palette:** Dark background `#050505`, white text with opacity variants (`text-white/60`), cyan accent `#00f2ff` (`text-[#00f2ff]`)
- **Section layout:** `max-w-7xl mx-auto` container, `py-32 px-6` padding
- **Icons:** `lucide-react` for all iconography
- **Strict TypeScript:** `strict: true`, `noUnusedLocals`, `noUnusedParameters` in tsconfig

## CI

GitHub Actions runs `gitlint` on commits (push/PR to `main`) and notifies Vercel via repository dispatch.

## Agent System

This repo uses the Agent Trinity System. Agent configs live in `.copilot/agents/`.

**Hierarchy:** Chief → ZEUS (God-Agent) → King Soldier (Copilot CLI) → Warriors (ATLAS, ORION, TITAN)

### Command Syntax

Commands prefixed with `:/` invoke agents immediately:

```
:/ZEUS [task]      → God-Agent (Vercel, Supabase, system-level)
:/ATLAS [task]     → Coder (React/TS/Tailwind/Framer Motion)
:/ORION [task]     → Debugger (strict TS, ESLint, perf)
:/TITAN [task]     → QA (lint → typecheck → build pipeline)
:/SOLDIER [task]   → King Soldier handles directly
:/WARRIORS [task]  → All three warriors coordinated
```

**Flags:** `//turbo` (autonomous), `//auto`, `//review`, `//collab`  
**Force:** `\now`, `\override`, `\skip`, `\force`

### Development Workflow

```
ATLAS (code) → ORION (debug/review) → TITAN (validate) → Deploy
```

TITAN's validation pipeline: `npm run lint && npm run typecheck && npm run build`
