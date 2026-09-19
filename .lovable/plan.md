# WebsiteKaro Authentic Brand Generation

## Goal
Turn the existing Google Maps → generation → preview → launch flow into a source-grounded pipeline where each website uses the exact business identity, authentic public content, and a business-specific visual direction. Preserve existing users, records, pricing, authentication, dashboards, previews, launch leads, SEO, and Maps-only fallback behavior.

## Delivery phases

### 1. Verified business research foundation
- Add a bounded server-side Google Places research function using the linked Google Maps Platform connection.
- Resolve shared/short Maps links and business text into a Place ID, then request only the selected place’s required fields.
- Use Google’s exact `displayName` as the authoritative website name without shortening, translating, or decorating it.
- Collect verified address, coordinates, phone, website, hours, categories, rating, review count, Google Maps URL, up to five returned reviews, and a capped photo set with required attribution.
- Preserve the current deterministic draft when a listing cannot be resolved, but label the result unverified and never present generated facts as verified.
- Replace fabricated contact details, ratings, counts, trust claims, staff identities, prices, awards, and testimonials in generated websites with verified/user-provided data or omit those fields and sections.
- Give guest research a signed, bounded session and server-side generation allowance so Google usage is not exposed through an open proxy; retain the current three-per-seven-days experience.

### 2. Source-aware intelligence and Brand DNA
- Extend the blueprint additively with:
  - verified identity and place reference;
  - Brand DNA: personality, tone, palette direction, typography direction, image/content style, audience, story, services, differentiators, social themes, layout preference;
  - source-aware content/media records containing source URL, source type, confidence, attribution, original page, and verification time;
  - real-business-signal flags rather than a public numeric score;
  - a generation strategy describing selected hero, section order, density, image treatment, CTA placement, and card/navigation style.
- Treat user-provided links as claims until corroborated; distinguish `verified`, `user-provided`, `inferred`, `stock`, and `generated` material.
- Make all new fields optional and migrate readers defensively so existing generated websites and mock records continue rendering.

### 3. Official website and social research
- Analyse an official website only after matching it to the Maps listing or explicit user input.
- Use a safe public-web fetcher with URL validation, private-network blocking, redirect/content-size/time limits, robots handling, and a small same-origin page budget.
- Extract structured facts, metadata, JSON-LD, services, story, contact/location information, tone, colour/font signals, logo candidates, and a curated set of images with their original source pages.
- Use official-site content to inform a new composition, never clone the source layout or claim unsupported facts.
- Keep official-site images source-aware and clickable to a valid original page; omit links that cannot be verified.
- Curate supplied direct YouTube video links into 1–3 official embeds and relevance-rank public channel-feed videos when a valid public channel can be resolved.
- Use only official supported social embeds. Profile-only Instagram/Facebook/X/TikTok links remain verified profile links unless their provider exposes public embeddable post data; never scrape around login, CAPTCHA, private profiles, or platform controls.
- Select 3–6 social items only when authentic public item URLs and attribution are available; otherwise omit the feed rather than fabricate it.

### 4. Grounded content generation and quality passes
- Replace the current copy-only prompt with a structured research packet containing only verified, user-provided, or explicitly marked inferred facts.
- Generate business-specific copy, Brand DNA, section selection, social headings, and visual strategy while prohibiting unsupported claims.
- Preserve the exact verified business name in header, hero, About, Contact, footer, metadata, and structured data with natural repetition.
- Add a generic-content detector for interchangeable hero language, filler sections, unsupported superlatives, absent business signals, duplicate layouts, and stock imagery used despite authentic media.
- Add a uniqueness refinement pass that can adjust copy, hero, section order, density, image treatment, and CTA placement without inventing information.
- Update the visible generation sequence to the requested 14 research/design/validation stages while keeping Draft, Standard, Deep, caching, credit reporting, and graceful fallback behavior.
- Include source fingerprints and research version in cache keys so different source sets never reuse stale copy.

### 5. Business-specific website renderer
- Make the exact business name the dominant hero identity for split, full-bleed, editorial, product-led, and optional video heroes.
- Render from the generated strategy rather than one fixed layout per industry: deterministic per-business variants for hero, section order, typography scale, image crops, surfaces, card treatment, navigation, and CTA position.
- Dynamically omit sections lacking trustworthy content; do not show sample reviews, fake team members, invented FAQs, dead links, or placeholder legal links on customer previews.
- Use the media hierarchy: owner assets → official website → Google Business → official social → labelled licensed stock → labelled AI-generated fallback.
- Add category-aware curated social headings and place social/video sections where they support the business story.
- Display Google reviews verbatim with reviewer, rating, date, Google label, attribution, and a working Google destination; use the verified place page when no individual review URL exists.
- Link every official channel to the supplied/verified profile and every sourced website image to its verified source page where practical.
- Keep all images lazy-loaded below the first view, videos click-to-load, mobile navigation stable, long business names wrapping safely, and floating actions clear of mobile safe areas.

### 6. Persistence, editing, admin visibility, and analytics
- Add secure Cloud tables for generated websites, research snapshots, source records, and generation events; include grants, row-level security, owner isolation, and staff-only cross-business access.
- Persist a generated blueprint before opening the standalone preview; keep browser storage only as a compatibility fallback.
- Reconnect registered owners to only their own saved business and preserve the existing launch-lead records.
- Add staff visibility for source status, research freshness, generation/refinement status, verification failures, launch conversion, and source usage without exposing internal confidence/provenance data publicly.
- Keep public site reads limited to explicitly published records; preview access remains scoped to its owner or staff.

### 7. SEO and authenticity safeguards
- Generate title, description, Open Graph copy, H1, and LocalBusiness schema from the exact verified name and verified facts.
- Use an authentic primary business image for sharing when available; omit image metadata rather than substitute misleading imagery.
- Emit rating/review schema only for verified Google data and omit unsupported address, hours, service, award, or testimonial claims.
- Update the preview’s sources and authenticity panels to reflect actual used sources and satisfied checks, not the presence of a pasted URL.
- Surface plain-language partial-research notices while keeping a usable preview; never expose stack traces or provider errors.

## Technical boundaries
- Google Places calls stay server-side through the connector, with strict field masks, capped photos/results, deduplication, caching, and no arbitrary upstream proxy.
- Connector/API credentials and email credentials never enter browser code.
- Website fetching accepts public HTTP(S) pages only and blocks private/local destinations and unsafe content types.
- AI receives extracted text and attributed media metadata, not unrestricted browsing access.
- Existing `BusinessBlueprint` consumers, MCP tools, mock businesses, owner/admin routes, launch form, and local previews remain compatible while persistence is introduced.
- Social capability degrades honestly: unsupported profile feeds are linked, not scraped or simulated.

## Validation
- Add focused tests for exact-name preservation, URL/place resolution, source confidence, media priority, no fabricated reviews/facts, cache separation, owner isolation, duplicate generation/lead prevention, and safe website fetching.
- End-to-end test at least three distinct categories and compare visual structure, not only colours/text.
- Cover Maps only; Maps + Instagram; Maps + direct YouTube videos/channel; Maps + official website; multiple sources; verified reviews; no reviews; limited presence; failed research; existing stored blueprint.
- Verify desktop, tablet, and narrow mobile previews, standalone/new-window preview, launch form, Google/source links, embeds, image attribution, no horizontal overflow, no broken media, no console/runtime errors, and a clean build.

## Rollout order
1. Verified Maps identity and removal of fabricated public facts.
2. Source-aware blueprint, website research, persistence, and admin research visibility.
3. Brand DNA, unique renderer, curated media/social sections, generic-content and uniqueness passes.
4. SEO hardening, analytics, migration checks, and the complete regression matrix.

Each phase remains deployable and keeps the existing Maps-only generation path usable.
