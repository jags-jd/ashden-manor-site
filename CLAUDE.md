# Ashden Manor Wedding Venue Site — Project Context

> This file is read by Claude Code at the start of every session.
> Update it after every meaningful change. Don't trust memory — trust this file.

**Last updated:** 2026-10-27 (pricing tool merged with the enquiry)
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
- Weddings are for up to 100 guests in all, day and evening guests together (Jan, 2026-10-27). Venue hire includes 50; couples choose their number (client pricing, 2026-10-27)
- Evening guests can join from 8pm
- Indoor ceremony room, Georgian dining room, manicured gardens. The ceremony can be held in the gardens instead, as a paid option
- The private dressing room can be booked the night before, as a paid option
- In-house catering (food is a major strength)
- Private dressing room
- Full-day weddings: ceremony through to evening party
- Pet-friendly
- Positioned as a premium alternative to a hotel wedding
- Established 2026 (per logo)

**Exception (Jan, 2026-10-22):** the footer and menu use made-up placeholder contact details (phone 01632 960 482 from Ofcom's range reserved for fiction, hello@ashdenmanor.co.uk, "Ashden Lane, Ashden, England"). They're not linked, and they must be replaced before launch (Open Question 2).

**Anything not listed here is unknown.** No village or county name, distance from cities, chef names, menu dishes, awards, room counts, accommodation, parking, or testimonials. Where copy would need such a detail, leave it out and log it under Open Questions. Jan decided on 2026-10-22 that there are no visible `[TBC]` placeholders on the page. Never fill a gap with an invented fact.

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
| Motion | GSAP 3 (ScrollTrigger, SplitText), all in `src/lib/motion.ts` | Jan's call, 2026-10-22: a richer, image-led feel inspired by belgradearbor.rs. GSAP is free for commercial use |
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

- `src/assets/brand/logo.png`: crest with AM monogram, wordmark and "EST. 2026". `brandkit.png` is the client's brand sheet.
- The current file is a PNG on a **pure white** background (780×654). Never place it as-is. Use the transparent versions generated from it: `logo-ink.png` on light sections, `logo-linen.png` on dark ones, `monogram-bronze.png` in the header (see Known gotchas). An SVG is still wanted (Open Questions).

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
9. **Prices and enquiry, branded "The MatchMaker"** (Jan, 2026-10-27; the menu and header still say "Prices"): one tool (`#estimate`), five numbered steps on one screen; the last step (`#enquire`, "Happy with your match?") has an "Enquire now" button that opens a popup asking for names and email, so every estimate can become a lead (see below). There is no separate Enquire section (Jan, 2026-10-27).
10. **FAQ:** the four worries plus practical questions, using `<details>`/`<summary>`
11. **Footer:** logo, contact details (made-up placeholders for now), small print

A floating header (subtle dark pill: Menu, AM monogram, and a "See prices" button that jumps to the estimator, Jan's call 2026-10-22; labels in Cinzel small caps; the monogram is hidden below 24rem) that stays in place. Away from the very top it splits into a round Menu button (top left) and a "See prices" text pill (top right), so it rarely covers text (Jan, 2026-10-22). It turns see-through while scrolling and eases back to solid shortly after scrolling stops. Menu opens a full-screen `<dialog>` listing every section with its 01–09 marker. Smooth scroll that respects `prefers-reduced-motion`.

**Design principles (redesign, 2026-10-22, inspired by belgradearbor.rs):** restrained and image-led. Each section is mostly one large photo, one headline and a short paragraph, with lots of breathing room. Numbered markers (01, 02…) guide the eye. Information is broken into digestible pieces (tabs for the spaces, a horizontal timeline for the day). There's always a next step (See prices in the header, Enquire in the menu, a CTA in most sections, a closing invitation in the footer), but nothing pushes. Motion is deliberate, not everywhere.

---

## Feature: price estimator

**Purpose:** give couples a price before they've visited, which the client explicitly asked for. These are the **client's real prices** (received 2026-10-27).

**Steps (numbered, all on one screen; Jan, 2026-10-27):**
- 01 Season, labelled by months only: "June to September" / "April, May or October" / "November to March" (no peak/shoulder/off-peak wording on the page)
- 02 Day: Saturday / Friday or Sunday / Monday–Thursday
- 03 Guests: day guests 50 to 100 (50 are included in venue hire); evening guests, joining from 8pm, fill whatever is left. **Day and evening guests together never pass 100** (`MAX_GUESTS`; Jan, 2026-10-27). Day guests come first: raising them trims evening guests, and a line under the counters says how many evening places are left (`eveningGuestLimit()` in `estimate.ts`)
- 04 Extras: ceremony in the gardens; private dressing room the night before
- 05 Happy with your match? An "Enquire now" button opens the lead popup: names and email (Jan, 2026-10-27; see Feature: enquiry)

**Pricing (all in `src/data/pricing.ts`): venue hire for a full day of exclusive use, including 50 guests**

| | Mon–Thu | Fri or Sun | Saturday |
|---|---|---|---|
| Off-peak (Nov–Mar) | £4,500 | £6,000 | £8,000 |
| Shoulder (Apr, May, Oct) | £5,500 | £7,500 | £10,000 |
| Peak (Jun–Sep) | £6,500 | £9,000 | £12,000 |

- **Extra day guests:** £95 each, beyond 50 and up to 100.
- **Evening guests:** £45 each.
- **Ceremony in the gardens:** £750.
- **Dressing room the night before:** £400.
- **Totals:** exact, with no rounding.
- **Worked example:** peak Saturday, 80 day guests, 20 evening guests and both extras comes to **£16,900**.

**Output:** "Your estimate £X", updating as answers change, with an itemised breakdown that shows only the lines that apply, and a line making clear it's a guide, not a quote. On desktop the result card is sticky beside the steps, so the total is always in view; on phones a sticky bar at the bottom mirrors the total (aria-hidden) while the card sits after step 04.

**Rules:**
- `IS_PLACEHOLDER = false` (real prices), so there's no "Illustrative figures" note. Set it to true again only if figures become placeholders.
- All numbers live in `pricing.ts` only, never hard-coded in components or copy. A content test enforces this for guest numbers and prices.
- Calculation logic lives in a pure function (`estimate(choices)` in `src/lib/estimate.ts`) with unit tests.
- Use `Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' })` (`formatGBP`).
- Must work with keyboard and screen readers. Announce updated totals with `aria-live="polite"`.

---

## Feature: enquiry (step 05 of the price tool)

**Phase 1: no backend. It must look and behave like a real form, but send nothing anywhere.**

The pricing tool *is* the enquiry form (Jan, 2026-10-27): one `<form>` in `Estimate.astro`. The old separate form (`Enquire.astro`, with phone, preferred date, message and so on) was deleted.

**Fields:** your names (required) and email (required, validated). Nothing else (Jan's call). The lead sent is `LeadData`: names, email, every choice from steps 01–04 and the total.

**Popup (Jan, 2026-10-27):** Two buttons open it: "Enquire now" in step 05 and, on desktop only, one right under the total in the sticky card (under the total, not at the bottom, because the full breakdown can be taller than the window). a modal `<dialog id="lead-dialog">` *inside* the tool's `<form>`, so its fields and send button still belong to it. It shows the current total, takes focus to the names field on open, locks page scroll (`html.lead-open`), and closes with the × button, Escape or a backdrop click (never while sending). Focus returns to "Enquire now" on close. Closing without sending keeps what was typed; after a successful send, "Done" closes it and the next opening starts afresh.

**Behaviour:**
- Custom inline error messages on blur (once touched) and on submit; errors linked with `aria-describedby`; focus moves to the first error and a status line says how many
- Enter in a guest box only tidies the number; it never sends
- Submit button shows a loading state (`aria-busy`, "Sending"), then a warm success message with the names and total; focus moves to its heading. "Done" closes the popup; the choices on the page stay as they were
- The error state is triggered with `?enquiry=error` (`role="alert"`, everything typed is kept)
- Without JavaScript the submit button stays disabled, so nothing can be posted
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
- **Avoid wedding clichés:** bespoke, fairytale, dream day, magical, once in a lifetime, nestled, picture-perfect, tie the knot, say "I do", happily ever after, breathtaking, stunning, luxury/luxurious (show it, don't say it).
- **Never invent facts** (see Venue facts). Leave unknown details out and log them in Open Questions (no `[TBC]` on the page).
- Keep all copy in `src/data/content.ts` (or Markdown in `src/content/`) so it can be edited without touching components.

---

## Photography

- All 20 venue photos were delivered on 2026-10-22. Web-use clearance is still unconfirmed (see Open Questions).
- Location: `src/assets/photos/`. Files are **numbered 1–20**, a mix of `.jpg` and `.png` (15, 16, 18 and 19 are ~2MB PNGs; `astro:assets` compresses them), and the names say nothing about what each photo shows.
- **Keep the original filenames.** Don't rename them, so they always match what the client sent.
- **At the start of session 3, before writing copy, view every photo** and record what it shows in `src/data/photos.ts`: file number, a short description, suggested section (hero, spaces, food, gardens, etc.), orientation, and alt text. Components import photos through this map only, never by bare number.
- If a photo's content is unclear (e.g. which room it is), describe what's visible and flag it in Open Questions rather than guessing.
- Pick the hero image for strength and orientation (landscape, works when cropped on mobile), and note the choice in Current Build State so Jan can confirm it.
- Sections are built with the real photos (Jan's call, 2026-10-22). No placeholder blocks are needed. **No stock photos posing as the venue.**
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
- **Don't add dependencies** beyond Astro, fontsource, GSAP and test tooling without asking.
- **Motion is deliberate, not everywhere.** Use the data attributes in `src/lib/motion.ts` rather than one-off animations. Everything must be off under `prefers-reduced-motion`, and the page must be complete without JavaScript. Don't add scroll-jacking or smooth-scroll libraries without asking.

---

## File structure (target)

```
/src
  /assets
    /brand          # logo files
    /photos         # 20 venue photos, numbered 1–20 (delivered)
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
- Every detail left out of the copy is listed in Open Questions (item 9)

---

## Known gotchas

- **Contrast traps in the palette.** Soft Chalk on Sage (~2.7:1) and Antique Bronze on Ink (~4.1:1) fail AA for body text. Use them for large display text or decoration only. Check every text/background pair.
- **Cormorant Garamond is thin.** It gets spindly at small sizes; keep it large and don't use light weights.
- **Cinzel has no true lowercase.** Don't use it for long text.
- **Logo PNG has a light background.** It won't work on dark sections until we have a transparent or SVG version.
- **Logo PNG background is pure #FFFFFF.** Don't place the PNG as-is. Favicons and the OG image are generated by `node scripts/brand-icons.mjs`, which turns the white into transparency and sets the crest on Chalk/Linen. For on-page use, run it through the same approach or sit it on a matching light band. Re-run the script when an SVG arrives.
- **Header width.** Five nav links plus Enquire need ~1100px, so inline links start at 72rem and the Menu button covers everything below. The header was tightened to fit at 320px. Re-check both if you add a nav item.
- **`astro.config.mjs` has no `// @ts-check`.** It reads `process.env` and `@types/node` isn't installed (adding it would need sign-off).
- **Headless Edge screenshots** lay out wider than `--window-size` at phone widths. Load the page in a 375px/320px `<iframe>` instead.
- **On-page crest.** Use `src/assets/brand/logo-ink.png` on light sections and `logo-linen.png` on dark ones, plus `monogram-bronze.png` for the header and preloader. All three are transparent and generated by `scripts/brand-icons.mjs`. Never use `logo.png`, which has a white box.
- **`Copy.astro` and `lib/tbc.ts`** still italicise any `[TBC: …]` in a copy string. Nothing on the page uses them now, but they're there if a placeholder is ever needed again.
- **No `node:` imports in tests.** `astro check` type-checks `tests/` and `@types/node` isn't installed; read files with Vite's `?raw` import instead.
- **Full-page screenshots** must use a real viewport height (e.g. 1440×900 plus `captureBeyondViewport`). A very tall window makes the `100svh` hero that tall.
- **Header stays put** (Jan, 2026-10-22: no hide on scroll) and compacts to corner buttons once scrolled (`is-compact` in `Header.astro`). It floats over the top padding of each section, so `scroll-padding-top` is 0. Labels in compact mode are visually hidden, not removed, so the buttons keep their accessible names.
- **Motion (`src/lib/motion.ts`).** It runs inside `gsap.matchMedia`: nothing happens under reduced motion, and pins and horizontal scroll run only from 56rem up. Pins are created first, in page order. GSAP wraps each pinned section in a `.pin-spacer`, so `main > section` stops matching it once pinned; collect section lists before pinning.
- **Pacing (desktop).** Each stacked section holds at its top (`HOLD_AT_TOP`, 30% of the screen's height in scroll), scrolls its own content if it's taller than the screen, holds at its end (`HOLD_AT_END`, 45%), then the next slides over. Your day scrolls sideways at `PACE` = 1.8 times its width. All three constants are in `motion.ts`. The holds are a margin on the next section, which GSAP moves onto its pin spacer. Never put a second ScrollTrigger on a pinned element: its start is pushed back by the pin's length. Drive it from the pin's `onUpdate` instead.
- **Sections on desktop are at least 100svh**, with content centred (global.css), so each gets the screen to itself.
- **Don't offset GSAP-animated elements with `transform` or `translate`.** GSAP resets both (it writes `translate: none`), which is what pushed the hero photo off screen. Use layout (grid, margins) instead.
- **Phones (below 56rem)** differ on purpose:
  - headlines reveal once rather than being tied to the scroll, so they're never left half-blurred;
  - sections have less padding (`--section-pad` floor 4.5rem);
  - Your day keeps the pinned sideways scroll, as on desktop (Jan, 2026-10-22); the swipeable row is only the no-motion fallback;
  - the hotel comparison shows only an "At a hotel:" label;
  - the hero hides its second button and the crest;
  - the Spaces tabs are a row of pills directly above a square photo, and choosing one keeps the panel in view.
  
  Check 320px for overflow after any copy change. Long single-line buttons are the usual cause.
- **No `once: true` in ScrollTriggers.** After a reload part-way down the page, `once` triggers fire and kill themselves during setup, which crashes ScrollTrigger's refresh ("reading 'end'" of undefined) and leaves motion half-initialised. Use `toggleActions: PLAY_ONCE` (in `motion.ts`) instead. Test changes with a reload at the bottom of the page.
- **Header on scroll** (Jan, 2026-10-22): the full pill shows only at the very top (`scrollY` 80px or less). Anywhere else it splits into the corner buttons, scrolling up or down, and also right after a reload part-way down.
- **Spaces tabs on desktop**: the two columns are bottom-aligned and the photo's height is capped (`100svh - --section-pad - 10rem`), so whenever the tabs are on screen the whole photo is too. That matters because the section is pinned and its content scrolls, so `scrollIntoView` can't help. Re-test at 1280×720 if the layout changes.
- **Price tool and enquiry (merged 2026-10-27).** Everything is in `src/components/Estimate.astro`; there is no `Enquire.astro`, preferred date or URL hand-off any more.
  - Data: `src/data/pricing.ts` holds the constants, `PRICING` and the defaults (peak Saturday, 50 guests, nothing else).
  - Maths: `src/lib/estimate.ts` holds `estimate(choices)`, which clamps guests and returns line items and an exact total, plus `clampCount` and `formatGBP`.
  - Lead: `src/lib/validation.ts` (`validateLead`, error codes; messages in `content.ts` under `estimate.details`) and `src/lib/enquiry.ts` (`submitEnquiry(LeadData)`, `wantsErrorState`).
  - The section is **not pinned** (no `data-stack`), because the desktop result card is `position: sticky` and sticky doesn't work inside a pin.
  - Only the total is in the `aria-live` region. Rows that don't apply are `hidden` (`.row[hidden]`).
  - Phones: a sticky bar mirrors the total, so `html` has `scroll-padding-bottom: 5rem` below 56rem to keep focused controls clear of it (WCAG 2.4.11). The visually hidden radio and checkbox inputs cover the whole pill (`inset: 0; opacity: 0`) so focus scrolls the full pill into view.
  - `#enquire` (step 05) is the target of the footer CTA, the food CTA and the menu's Enquire link; a content test guards this.
  - Verified keyboard-only in headless Edge: no non-GET requests, no request containing typed data, nothing in the console, storage unchanged. Tests: `estimate.test.ts` (nine combinations, guest maths and clamping, extras, the 100-guest combined cap, the £16,900 worked example), `validation.test.ts`, `enquiry.test.ts` (the stub never calls fetch, sendBeacon, console or storage).
- **`hidden` vs `display`.** A component style like `display: grid` overrides the `hidden` attribute. Add `[hidden] { display: none }` for anything you hide with it (form, success panel, tab list, errors).
- **Height changes re-measure the scroll effects.** `motion.ts` watches `main` with a ResizeObserver and calls `ScrollTrigger.refresh()`, so form errors, the success message and FAQ answers don't throw the pinned sections out.
- **Rolling-text buttons can't wrap.** Keep labels short (about 15 characters or fewer) or they overflow phones. That's why the tool's button says "Send enquiry".
- **Contrast audit after scrolling.** Sections that a later one has slid over recede to 25% opacity (the stack effect in `motion.ts`), so an audit run from the bottom of the page flags them. Scroll back to the top before measuring, as `audit.mjs` now does.
- **Buttons follow the nearest background.** A light card inside a dark section (`.theme-linen` inside `.theme-olive`) gets the light-section button; the rules are in global.css.
- **Footer is deliberately simple** (Jan): invitation and CTA, crest, contact, small print. No menu, photo strip or wordmark. Your day has no progress line.
- **Hidden-until-animated content.** With motion on, the hero copy and photo start hidden (`html.motion`) and the preloader shows on the first visit of a session (`html.intro`). Both have CSS failsafes (3.5s and 4s) in case the script fails. Everything else is hidden by GSAP itself, so it stays visible without JavaScript.
- **Bronze text.** Antique Bronze passes only as large display text, on Ink (4.1:1) or Chalk (3.6:1). That covers the Food and Pets headlines, and never labels or table headers. It fails on Linen and Olive, even when large.
- **Rolling text.** The window is 1.5em tall (1.3em on the large menu links): at 1.3em, Safari on iPhone clipped the bottom of the letters. `.roll-track` must keep its natural height (`flex: none`) or the hover slide lands halfway. Labels inside it must not wrap (`white-space: nowrap` is set).
- **Screenshots in dev** show Astro's dev toolbar as a small pill at the bottom centre. It isn't in the build.
- **Performance (keep Lighthouse mobile at 90 or above).**
  - The hero copy must never be hidden or faded: it's the LCP element. It's painted from the first frame and only slides into place.
  - The hero photo is hidden only on desktop, where the preloader curtain covers it anyway.
  - The preloader is desktop only, and motion is set up in `requestIdleCallback`.
  - CSS is inlined.
  - Photos use `quality={62}` (the hero 60). Give `sizes` the real column width.
  - Lighthouse's simulated mobile LCP counts every request that starts before first paint, so avoid extra eager images and fonts. Details are in `docs/quality-pass-2026-10-22.md`.
  - Motion setup runs as a queue of small tasks (one per headline or kind of effect) after the pins. Don't fold it back into one block, and don't add a manual `ScrollTrigger.refresh()` on load (ScrollTrigger already does one). Each cost about 150ms of blocking time on mobile (measured 2026-10-27).
- **Headline reveals use blur and rise only, never opacity**, so an unrevealed headline never fails contrast.
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

**Status:** Redesigned (2026-10-22): image-led layout with GSAP motion. It has a floating header with a full-screen menu, a preloader, stacked section transitions, word-by-word headline reveals, photo unmasking and parallax, tabbed Spaces, a horizontal Your day and a parallax footer. Copy is trimmed to one headline and a short paragraph per section. Checked in headless Edge at 1440×900, 390×844, 375×667 and 320×640, plus with reduced motion. Build, check and tests pass. A pre-redesign copy of `src/` was kept outside the repo, in the session scratchpad.

**In flight:** Vercel project not yet connected (Jan to do: import the GitHub repo, framework preset Astro, no env vars).

**Blocked on:** Nothing for phase 1.

**Session 3 done (2026-10-22):** all 20 photos mapped in `src/data/photos.ts` (section placement, alt text; 3, 4, 10, 11 and 16 currently unused). All copy is in `content.ts`. Every section is a real component (`src/components/*.astro`) with real photos; the estimate and enquiry sections hold their heading and intro only, ready for sessions 4 and 5. `pricing.ts` has `GUEST_COUNT` only so far. Tests now also guard the copy (banned clichés, no typed guest count). Checked at 1440px and 375px.

**Next session goal:** Pre-launch with Jan: answer Open Questions 11 (a lead form that sends nothing; now the only way to enquire) and 2 (made-up contact details), test the price tool on a real iPhone and Android, then push. Lighthouse after the merge (2026-10-27): mobile 91–92/100/100/100, desktop 98/100/100/100.

**Hero photo:** photo 20 (`photos.manorFromAbove`), aerial view of the house and lawns. Jan to confirm. On desktop it's a two-column grid: copy beside the photo in an arch, over a blurred copy of the photo, with type and photo scaled by screen height so it fits from 1280×720 up. Phones show it full-bleed under a dark gradient.

**Working decisions (reversible; Jan to confirm):**
- Hero: dark, with the transparent Linen crest (desktop only; the header monogram covers phones).
- Enquiry error state will be triggered by the URL flag `?enquiry=error`.
- Section themes alternate light/dark (see `src/pages/index.astro`); hero and footer stay light because they carry the logo.
- Menu lists all nine sections with their markers. A slim vertical counter at the left edge (desktop) shows the current section number, kept in the page margin so it never sits over content.
- Pets has no photo, because none of the 20 shows a pet. It's a typographic interlude.
- No newsletter sign-up, although the reference site has one. It would collect personal data, so it needs a backend and consent (Open Questions).
- Until a domain exists, canonical/OG URLs use Vercel's production URL (`VERCEL_PROJECT_PRODUCTION_URL`).

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

1. **Real pricing**: received 2026-10-27 and in the estimator. Still unknown: whether there's a minimum spend.
2. **Location and contact**: address, county, phone, email, directions. The footer currently shows made-up placeholders (see Venue facts). **Replace them before launch.**
3. **Photos**: delivered 2026-10-22 and used as provided (Jan's call). Raised once on 2026-10-22: several look sourced from other venues and social media (e.g. a burned-in "tobelovedevents.com" credit on 1, social-media UI on 10), so web-use clearance and credits still need the client's confirmation. Full-resolution originals would also help: all files are 675–1080px wide and portrait.
4. **Logo**: can the client supply an SVG or transparent PNG?
5. **Form destination**: where should enquiries go in the next phase?
6. **Guest numbers**: answered 2026-10-27. 50 are included, extra day guests are £95 each and evening guests from 8pm £45 each, up to 100 guests in all. Still unknown: what venue hire covers for the 50 included guests (food and drink?).
7. **Domain**: what domain will the site live on?
8. **Placeholder prices on launch**: resolved 2026-10-27. Real prices are in, and the "Illustrative figures" note is gone.
9. **Details left out of the copy** (they were `[TBC]` placeholders until Jan removed them on 2026-10-22; add them back as real copy once known): sample menus and what catering includes; earliest ceremony time and evening finish; house rules for pets; dietary requirements; email, phone and address (footer); village and county (hero).
10. **Newsletter**: the reference site has a sign-up form. Does the client want one? It would need a backend, consent wording and a privacy policy, so it's not for phase 1.
11. **Live form that sends nothing**: Jan removed the preview note (2026-10-22). While the site is public and phase 1 sends nothing, a couple could believe they've enquired. Wire a real handler (Open Question 5) before sharing the site widely.
12. **Evening guest limit**: resolved 2026-10-27. Day and evening guests together come to no more than 100.

---

## Project hygiene

- Keep this file under ~400 lines; move detail to `/docs` if it grows.
- Record architectural decisions in `docs/decisions/`.
- Prefer simpler over cleverer.
