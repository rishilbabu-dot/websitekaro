# Credit-aware generation architecture

## Correction first
I checked the code: today the generator is **fully deterministic mock logic** (`blueprint.factory.ts`, `generation.service.ts`). `blueprint-research.service.ts` is an empty stub — there is no AI Gateway call anywhere, and no `LOVABLE_API_KEY` usage. So generating a website right now costs **zero** credits. My earlier answer was wrong.

Credits are only consumed by our chat messages and build work — not by your app's generate flow.

This plan wires real AI in a way that keeps cost predictable from day one.

## What we build

### 1. Cost-tiered generation
Three modes behind one service call:
- **Draft (free)** — current deterministic factory, no model call. Default for previews and demos.
- **Standard** — one AI call that returns the full blueprint as structured JSON.
- **Deep** — Standard plus a second pass for long-form copy (about, FAQs, service descriptions).

The UI exposes this as a quality selector; Draft stays the default so nobody burns credits by accident.

### 2. Blueprint cache
Cache key = normalised business name + city + industry + mode. A repeat generation of the same business returns the cached blueprint with a "cached" badge and no model call. In-memory for now; swaps to a database table the moment Cloud is enabled.

### 3. Usage ledger + guardrails
Every AI generation records mode, model, token usage and a derived cost estimate. On top of the ledger:
- Per-session and per-day generation caps
- A hard stop that falls back to Draft when the cap is hit, with a clear message instead of a silent failure
- Explicit handling of gateway `429` (rate limited) and `402` (credits exhausted) shown in the UI

### 4. Admin visibility
A "Usage & Costs" panel in the Super Admin dashboard: generations today, cache hit rate, estimated credits spent, and a breakdown by mode. Reads the same ledger.

### 5. Images stay off by default
Image generation is the most expensive step. Generated sites keep using the curated stock library; AI imagery becomes an explicit per-site opt-in toggle, never automatic.

## Technical notes
- New server function `generateBlueprint` in `src/features/ai/blueprint.functions.ts` — the only place that reads `LOVABLE_API_KEY`, called via `useServerFn`.
- Model call uses the AI Gateway with structured output validated by a Zod schema mirroring `BusinessBlueprint`; a validation failure falls back to the deterministic factory rather than erroring out.
- `resolveSiteBlueprint` keeps its current signature; mode/cache/ledger live behind it so existing routes and the MCP tools are unchanged.
- Ledger and cache start as in-memory modules with a storage interface, so moving them to Lovable Cloud later is a single adapter swap.
- No UI redesign — the quality selector and the admin usage panel are the only visible additions.
