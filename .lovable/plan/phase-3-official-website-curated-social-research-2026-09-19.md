# Phase 3 — Official Website & Curated Social Research

## Goal
Enrich each generated website with facts and media from the business's own official website and supplied social channels — safely, with attribution, and never by scraping behind logins or inventing content. Example: a wedding planner's site should reflect their real services, story, and portfolio links, not a generic wedding template.

## What gets built

### 1. Safe official-website fetcher (server-side)
- New `website-research.functions.ts` server function: given a candidate URL (from the verified Google listing's `website` field, or the user's "Official website" brand link), fetch and analyse it.
- Safety rules: public http(s) only, block private/local IPs and localhost, follow max 3 redirects, cap page size (~1 MB) and fetch time (~8 s), small page budget (homepage + up to 3 same-origin pages such as about/services), respect obvious non-HTML content types.
- Extraction (pure parsing, no headless browser): title/meta description, JSON-LD blocks, headings, visible text excerpt, service/menu-like lists, contact details found on-page, logo candidates, theme colour hints, and up to ~8 content images with their absolute URLs and the page each came from.

### 2. Source-aware blueprint enrichment
- New types: `WebsiteResearch` (facts extracted, images with source pages, confidence, fetchedAt) added optionally to the blueprint — additive, so existing saved sites stay valid.
- `blueprint.factory.ts`: when website research exists and the blueprint has empty services/FAQs (the current verified-listing gap), populate services/FAQs **only** from extracted official-site content, marked with `confidence` and source. Never merge guessed facts.
- Website images join the media hierarchy in `media.ts` between owner assets and Google photos, each linked back to its original page.
- Source records: official website becomes `verified` when it came from the Google listing; otherwise stays `user-provided`.

### 3. Curated YouTube and social handling
- YouTube: keep official embeds only. Direct video links → individual click-to-load embeds (max 3); a valid `@handle`/channel link → the existing channel-uploads embed. Nothing scraped.
- Instagram/Facebook/X/TikTok/Pinterest/LinkedIn: render as verified profile link cards with category-aware headings (e.g. "Real weddings on Instagram" for wedding planners). No fake post feeds — a feed section appears only when authentic public item URLs exist; otherwise it is omitted.
- Category-aware social section titles and placement wired through the existing `designStrategy` section order.

### 4. Generation flow updates
- `generate.tsx`: after Google research, run website research when an official URL is known (verified listing website or user-supplied link); pass results into the blueprint. Research failures degrade to a plain-language notice and the current verified-Maps-only result — never a broken generation.
- Cache keys gain a website-research fingerprint so different source sets never reuse stale output.
- Sources panel and authenticity checks updated to show the official website research status (fetched / unavailable / not provided).

## What stays untouched
Maps workflow, verified Places research, Brand DNA, renderer contract, Draft/Standard/Deep modes and credits, auth/roles, launch leads, existing previews and mock data. All new fields optional; Maps-only generation keeps working exactly as today.

## Validation
- Unit-level checks: URL validator blocks `localhost`/private IPs; extractor handles missing JSON-LD/images; blueprint enrichment never fabricates when extraction is empty.
- Playwright: (a) verified business with a real official website → services/FAQs/images appear with working source links; (b) business with no website → unchanged current behavior; (c) wedding-planner example with Instagram + YouTube links → curated social section and official embeds; desktop + narrow mobile, no console errors, build OK.

## Cost note
Website fetching is plain HTTP (free); no extra Google Places calls beyond today's single lookup. Google Maps usage stays capped and server-side as now.
