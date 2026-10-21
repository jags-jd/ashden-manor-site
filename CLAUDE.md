# Ashden Manor Wedding Venue Site — Project Context

> This file is read by Claude Code at the start of every session.
> Update it after every meaningful change. Don't trust memory — trust this file.

**Last updated:** 2026-10-22
**Owner:** Jan Jagutin
**Client:** Ashden Manor
**Deadline:** Phase 1 live by **2026-10-24** (48 hours from kickoff)

---

## What we're building

A single-page website for **Ashden Manor**, a converted Georgian manor in the English countryside offering intimate, elegant, exclusive-use weddings.

The page must:
- Present the venue in a way that feels **elegant and warm, not stuffy**
- Explain clearly what **exclusive use** means
- Answer the four worries couples have (see below)
- Give couples **an estimated price up front** via an interactive estimator
- Capture interest through an **enquiry form** that looks and behaves like a real one

This is **phase 1 of the real site**, not a prototype. Build it to production quality, but within the scope below.

---

## Venue facts (the only facts we have — do not invent others)

- Exclusive use: the whole manor, gardens and dining room; no other guests checking in
- Every wedding is for 100 guests through the day (fixed; couples don't choose a number)
- Indoor ceremony room, Georgian dining room, manicured gardens
- In-house catering (food is a major strength)
- Private dressing room
- Full-day weddings: ceremony through to evening party
- Pet-friendly
- Positioned as a premium alternative to a hotel wedding
- Established 2026 (per logo)

**Anything not listed here is unknown.** No village or county name, distance from cities, chef names, menu dishes, awards, room counts, accommodation, parking, or testimonials. Where copy needs such a detail, use a visible placeholder like `[TBC: location]` and log it under Open Questions.

---

## Audience

Recently engaged couples, roughly 28–40, style-conscious and thoughtful about their guests. They care about how the day will feel, guest care, food, photographs, privacy, and a venue that feels like *them* rather than a generic hotel wedding.

### The four worries the page must answer

| Worry | Angle to take (from the client) |
|---|---|
| Is 100 guests enough? | 100 makes for a far better day: every guest matters, nobody gets lost |
| Will it feel too formal? | Elegant and warm, not stuffy; a home rather than a function suite |
| Is exclusive use worth it? | The whole place is yours: no strangers, no other weddings, no check-ins |
| How is this different from a nice hotel? | Privacy, personality, food, and a day that feels like yours |

Each worry should be addressed somewhere on the page, ideally both in the main narrative and in an FAQ.

---

## Tech stack — decided, don't suggest alternatives

| Layer | Choice | Why |
|---|---|---|
| Framework | Astro + TypeScript | Static, fast, ideal for a one-page site with small interactive islands |
| Hosting | Vercel | Client's chosen host; static output |
| Styling | Astro scoped styles + global CSS custom properties for brand tokens | No framework needed for one page; tokens keep the brand consistent |
| Interactivity | Vanilla TypeScript in Astro `<script>` tags | Estimator and form don't justify React/Vue |
| Fonts | Self-hosted via `@fontsource` (Cinzel, Cormorant Garamond) | Performance, no third-party requests |
| Images | `astro:assets` (`<Image />` / `<Picture />`) | Automatic resizing, modern formats, lazy loading |

Don't add a UI framework, CMS, CSS framework or backend in phase 1. If something seems to need one, stop and ask Jan.

---

## Brand rules

### Colours (defined as CSS custom properties in `src/styles/tokens.css`)

| Token | Name | Hex |
|---|---|---|
| `--ink` | Ink | #1E1E1C |
| `--sage` | Sage | #8C9685 |
| `--deep-olive` | Deep Olive | #3B4034 |
| `--bronze` | Antique Bronze | #907B60 |
| `--linen` | Warm Linen | #E9D9C7 |
| `--chalk` | Soft Chalk | #F5F1EA |
| `--stone` | Stone | #C1B6AE |

**Approved combinations:** Ink on Warm Linen · Soft Chalk on Deep Olive · Antique Bronze on Ink

**Usage rules from the brand kit:**
- Dark backgrounds with cream text
- Bronze for accents only (rules, small ornaments, hover states, large display text)
- **Never pure white** (`#FFFFFF`) anywhere: backgrounds, text, borders, form fields. Use Soft Chalk or Warm Linen.
- Don't use pure black either; use Ink.

### Typography

- **Headings:** Cinzel. All-caps letterforms with generous letter-spacing, used for headings, labels and short display lines only.
- **Body:** Cormorant Garamond. Italic works well for taglines and pull quotes.
- Cormorant is delicate: body text minimum 19–20px, line-height ~1.6, never below 16px anywhere (including form labels and the estimator).

### Logo

- `src/assets/brand/logo.png`: crest with AM monogram, wordmark and "EST. 2026"
- The current file is a PNG on a light background. It won't sit cleanly on dark sections until we get a transparent or SVG version (see Open Questions). Until then, place it on Warm Linen or Soft Chalk only.

---

## Page structure (single page, anchor-linked sections)

1. **Hero:** full-bleed photo, logo, short headline, one line of supporting copy, CTA to the estimator and enquiry
2. **Exclusive use:** what "the whole manor is yours" actually means, in concrete terms
3. **The spaces:** ceremony room, Georgian dining room, gardens, private dressing room
4. **The food:** in-house catering as a centrepiece, not an afterthought
5. **Why 100 is the right number:** reframe intimacy as the advantage
6. **Your day, start to finish:** ceremony → dining → evening party
7. **Pets welcome:** short and warm
8. **Not a hotel wedding:** a side-by-side, done with taste and without slagging off hotels
9. **Price estimator:** see below
10. **Enquiry form:** see below
11. **FAQ:** the four worries plus practical questions, using `<details>`/`<summary>`
12. **Footer:** logo, contact placeholders, `[TBC]` address, small print

A sticky, minimal header with anchor links and an "Enquire" button. Smooth scroll that respects `prefers-reduced-motion`.

---

## Feature: price estimator

**Purpose:** give couples a number before they've visited, which the client explicitly asked for.

**Inputs:**
- Season: Peak (May–Sep) / Shoulder (Apr, Oct) / Off-peak (Nov–Mar)
- Day: Saturday / Friday or Sunday / Monday–Thursday

**Guest count is fixed at 100.** There is no guest input. Every wedding is priced for 100 guests, and the estimator should say so plainly (e.g. "Priced for 100 guests").

**Output:** "Estimated from £X", with a simple breakdown (venue hire + catering for 100) and a line making clear it's a guide, not a quote. A button carries the selections into the enquiry form (prefilled).

**Placeholder pricing (all in `src/data/pricing.ts`):**

| | Saturday | Fri / Sun | Mon–Thu |
|---|---|---|---|
| Peak | £9,500 | £8,000 | £6,000 |
| Shoulder | £8,000 | £6,750 | £5,000 |
| Off-peak | £6,500 | £5,500 | £4,000 |

Plus catering at **£95 per guest × 100 guests = £9,500**. Round the total to the nearest £250.

`pricing.ts` also exports `GUEST_COUNT = 100`. Use this constant everywhere the number appears (estimator, copy, form) rather than typing 100.

**Rules:**
- **These figures are placeholders, not the client's prices.** `pricing.ts` exports `IS_PLACEHOLDER = true`. While it is true, the estimator shows a visible "Illustrative figures" note.
- All numbers live in `pricing.ts` only, never hard-coded in components or copy.
- Calculation logic lives in a pure function (`src/lib/estimate.ts`) with unit tests.
- Use `Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' })`.
- Must work with keyboard and screen readers. Announce updated totals with `aria-live="polite"`.

---

## Feature: enquiry form

**Phase 1: no backend. It must look and behave like a real form, but send nothing anywhere.**

**Fields:**
- Your names (required)
- Email (required, validated)
- Phone (optional)
- Preferred date (optional) + "We're flexible on dates" checkbox
- Season / day preference (prefilled from the estimator if used)
- Message (optional)
- How did you hear about us? (optional select)

**Behaviour:**
- Native HTML validation plus custom inline error messages on blur and submit; errors linked with `aria-describedby`; focus moves to the first error
- Submit button shows a loading state, then a warm, on-brand success message
- An error state exists and can be triggered (for testing and future use)
- All submission goes through one function, `submitEnquiry(data)` in `src/lib/enquiry.ts`. In phase 1 it simulates a short delay and resolves successfully. **This is the single seam where a real handler plugs in later.**
- **Do not** send data to any endpoint, third-party service or analytics, and don't log form contents to the console. Don't store it in localStorage.

---

## Copy guidelines

Claude writes all page copy from the brief above.

- **Voice:** elegant and warm. Confident, quietly witty at most, never gushing. Think of a gracious host, not a brochure.
- **British English:** colour, programme, organise, favourite.
- **Concrete over abstract.** "Nobody else checks in that weekend" beats "unparalleled exclusivity."
- **Talk to the couple** ("you", "your guests").
- **Short paragraphs.** Headlines under ~8 words.
- **Avoid wedding clichés:** bespoke, fairytale, dream day, magical, once in a lifetime, nestled, picture-perfect, tie the knot, say "I do", happily ever after, breathtaking, stunning, unforgettable, luxury/luxurious (show it, don't say it).
- **Never invent facts** (see Venue facts). Use `[TBC: ...]` placeholders.
- Keep all copy in `src/data/content.ts` (or Markdown in `src/content/`) so it can be edited without touching components.

---

## Photography

- 20 venue photos exist but haven't been delivered yet.
- Location: `src/assets/photos/`. Files are **numbered 1–20** (e.g. `1.jpg` … `20.jpg`), and the names say nothing about what each photo shows.
- **Keep the original filenames.** Don't rename them, so they always match what the client sent.
- When the photos arrive, **view every photo** and record what it shows in `src/data/photos.ts`: file number, a short description, suggested section (hero, spaces, food, gardens, etc.), orientation, and alt text. Components import photos through this map only, never by bare number.
- If a photo's content is unclear (e.g. which room it is), describe what's visible and flag it in Open Questions rather than guessing.
- Pick the hero image for strength and orientation (landscape, works when cropped on mobile), and note the choice in Current Build State so Jan can confirm it.
- Until they arrive, use tasteful neutral placeholders (Stone/Linen blocks with a small label such as "Photo: dining room"). **No stock photos posing as the venue.**
- Every image needs meaningful alt text; purely decorative images get `alt=""`.
- The hero image uses eager loading; all others are lazy.

---

## What NOT to do

- **Don't add pages.** One page only (a small 404 is fine).
- **Don't build a backend** or send form data anywhere.
- **Don't add analytics, cookies, chat widgets or tracking** without Jan's sign-off.
- **Don't use pure white or pure black.**
- **Don't invent venue facts, prices, testimonials or awards.**
- **Don't hard-code prices** outside `pricing.ts`.
- **Don't add dependencies** beyond Astro, fontsource and test tooling without asking.
- **Don't over-animate.** Subtle fades at most, all disabled under `prefers-reduced-motion`.

---

## File structure (target)

```
/src
  /assets
    /brand          # logo files
    /photos         # 20 venue photos, numbered 1–20 (pending)
  /components       # Hero.astro, Spaces.astro, Estimator.astro, EnquiryForm.astro, Faq.astro, ...
  /data
    content.ts      # all page copy
    pricing.ts      # placeholder pricing + IS_PLACEHOLDER flag
    photos.ts       # map of photo numbers → description, section, alt text
  /lib
    estimate.ts     # pure estimate calculation
    enquiry.ts      # submitEnquiry() — stub in phase 1
    validation.ts   # form validation helpers
  /layouts
    Base.astro      # <head>, meta, fonts, global styles
  /pages
    index.astro
    404.astro
  /styles
    tokens.css      # brand colours, type scale, spacing
    global.css
/tests
  estimate.test.ts
  validation.test.ts
/docs
  /decisions        # ADRs: docs/decisions/YYYY-MM-DD-short-name.md
```

---

## Key commands

```bash
npm install
npm run dev        # local dev server
npm run build      # production build
npm run preview    # preview the build locally
npm run test       # Vitest unit tests
npm run check      # astro check (types)
```

Deploy: push to `main` → Vercel production. Branches → Vercel previews.

---

## Quality bar (definition of done for phase 1)

- Fully responsive, designed mobile-first (most couples will browse on phones)
- WCAG 2.2 AA: contrast, keyboard navigation, visible focus states, labelled form fields
- Lighthouse 90+ on Performance, Accessibility, Best Practices and SEO
- Proper `<title>`, meta description, Open Graph tags and favicon (from the crest)
- No console errors; `npm run build`, `npm run check` and tests all pass
- Every `[TBC]` placeholder listed in Open Questions

---

## Known gotchas

- **Contrast traps in the palette.** Soft Chalk on Sage (~2.7:1) and Antique Bronze on Ink (~4.1:1) fail AA for body text. Use them for large display text or decoration only. Check every text/background pair.
- **Cormorant Garamond is thin.** It gets spindly at small sizes; keep it large and don't use light weights.
- **Cinzel has no true lowercase.** Don't use it for long text.
- **Logo PNG has a light background.** It won't work on dark sections until we have a transparent or SVG version.
- **Placeholder prices are public-facing risk.** Never ship to the live domain with `IS_PLACEHOLDER = true` without Jan confirming that's acceptable.

---

## Working with Claude Code on this project

**At the start of every session:** read this file in full.

**Given the 48-hour deadline:**
- Build in order: tokens and layout → page sections with copy → estimator → enquiry form → polish and accessibility pass → deploy
- Prefer simple and finished over clever and half-done
- When something is unclear, make a sensible, reversible choice, note it in Current Build State, and keep moving. Ask Jan only for genuine blockers.

**Before committing:** run build, check and tests. Use conventional commits (`feat:`, `fix:`, `chore:`, `content:`).

**After each session:** update Current Build State and Known Gotchas.

---

## Current build state

**Status:** Pre-build. Project not yet scaffolded.

**Next session goal:** Scaffold the Astro project, add brand tokens and fonts, build the base layout with section stubs, deploy an empty shell to Vercel.

**In flight:** Nothing.

**Blocked on:** Nothing for phase 1. Photos, real pricing and contact details can follow as placeholders.

---

## Phasing

**Phase 1 (due 2026-10-24):** the full one-page site, copy, placeholder estimator, front-end-only enquiry form, deployed on Vercel.

**Later (not now):**
- Real pricing from the client
- Form submission backend (e.g. Vercel function + email service) with spam protection
- Real photography swapped in
- SVG / transparent logo
- Analytics with consent
- Privacy policy page (required once the form sends data)

---

## Open questions

1. **Real pricing**: rates, seasons, minimum spend, what catering includes
2. **Location and contact**: address, county, phone, email, directions
3. **Photos**: when will the 20 photos be delivered, and are they cleared for web use?
4. **Logo**: can the client supply an SVG or transparent PNG?
5. **Form destination**: where should enquiries go in the next phase?
6. **Guest numbers**: fixed at 100. Does that include evening-only guests, and is the price the same if a couple brings fewer?
7. **Domain**: what domain will the site live on?
8. **Placeholder prices on launch**: is the client happy to go live with illustrative figures, or should the estimator be hidden until real prices arrive?

---

## Project hygiene

- Keep this file under ~400 lines; move detail to `/docs` if it grows.
- Record architectural decisions in `docs/decisions/`.
- Prefer simpler over cleverer.
