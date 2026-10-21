# Getting Started

> First-session checklist for building the Ashden Manor one-page wedding site.
> Deadline: phase 1 live by **2026-10-24**. Owner: Jan Jagutin.

## Read first

Before anything else:

1. **`CLAUDE.md`**: the whole project. Venue facts, audience, brand rules, the estimator and form specs, and what not to do.
2. **The brand kit** (`src/assets/brand/`): colours, type and usage notes. "Never pure white" and "bronze for accents only" are hard rules.

That's it. This project is small enough that CLAUDE.md is the spec.

## Pre-flight (before writing any code)

- [ ] Create a private GitHub repo: `ashden-manor-site`
- [ ] Clone it locally
- [ ] Add `CLAUDE.md` and this file to the repo root
- [ ] Create `src/assets/brand/` and add `logo.png` and the brand kit image
- [ ] Create `src/assets/photos/` (the 20 photos, numbered 1–20, go here when they arrive)
- [ ] Initial commit: `git add . && git commit -m "chore: initial project context" && git push`
- [ ] Check Node.js 20+ is installed: `node -v`

## Accounts and access

- [ ] **GitHub**: repo created (above)
- [ ] **Vercel**: account or team access, with the repo connected for automatic deploys
- [ ] **Domain**: not needed for phase 1 (the Vercel URL is fine to start); see CLAUDE.md Open Questions

There are no API keys or secrets in phase 1. The form sends nothing, so nothing is blocked on day one.

## 48-hour plan

| When | Goal |
|---|---|
| Day 1 morning | Understanding check → scaffold → tokens, fonts, layout → deploy empty shell |
| Day 1 afternoon | All page sections with copy, using photo placeholders |
| Day 1 evening | Price estimator with tests |
| Day 2 morning | Enquiry form; photos in, if delivered |
| Day 2 afternoon | Accessibility, mobile and Lighthouse pass; fix list |
| Day 2 evening | Final review with Jan → production deploy |

Deploy at the end of every block, so there's always a working version live.

## Session 1: understanding check

Start the first Claude Code session with:

```
Read CLAUDE.md and getting-started.md in full, and look at the logo and brand kit in src/assets/brand/.

Then summarise back to me: what we're building and for whom, the four worries the page must answer, the brand rules, how the estimator works (including that guests are fixed at 100), how the enquiry form behaves, and what you must not do. Don't write any code yet.
```

If Claude gets anything wrong (invents venue facts, offers a guest-count input, plans a form backend), fix CLAUDE.md before going further. The mistake means the file isn't clear enough.

## Session 2: scaffold

```
Good. Scaffold the project per CLAUDE.md:

- Astro with TypeScript (strict), static output for Vercel
- Self-hosted fonts via @fontsource: Cinzel and Cormorant Garamond
- src/styles/tokens.css with every brand colour as a custom property, plus a type scale and spacing scale
- Base layout with meta tags, Open Graph and a favicon from the crest
- index.astro with empty, labelled section stubs in the order listed in CLAUDE.md, and a sticky header with anchor links
- Vitest set up with one example test
- File structure per CLAUDE.md

No copy or features yet. Run build and check, then commit.
```

Then connect the repo in Vercel and confirm the empty shell deploys.

## Session 3: sections and copy

```
Write all page copy into src/data/content.ts following the copy guidelines in CLAUDE.md, then build every section component using it. Use labelled placeholders for photos. Use [TBC: ...] for any fact not listed in CLAUDE.md, and add each one to Open Questions.

Show me the copy for the hero, exclusive use and "why 100" sections before building the rest.
```

Review the copy carefully. It carries most of the page's persuasion.

## Session 4: estimator

```
Build the price estimator per CLAUDE.md. Put pricing data in src/data/pricing.ts and the calculation in a pure function in src/lib/estimate.ts. Write the unit tests first, covering every season and day combination and the rounding. Then build the UI with the "illustrative figures" note and the button that prefills the enquiry form.
```

## Session 5: enquiry form

```
Build the enquiry form per CLAUDE.md: validation, accessible error messages, loading and success states, a triggerable error state, and the submitEnquiry() stub in src/lib/enquiry.ts. Confirm that nothing is sent, logged or stored. Test it with keyboard only.
```

## Session 6: photos (when delivered)

```
The 20 photos are now in src/assets/photos/, numbered 1–20. View every one, then create src/data/photos.ts mapping each number to a description, suggested section, orientation and alt text. Propose a hero image and a placement for each section, and wait for my OK before swapping out the placeholders.
```

## Session 7: polish and launch

```
Do a full quality pass against "Quality bar" in CLAUDE.md: contrast on every text/background pair, keyboard navigation, focus states, reduced motion, mobile layouts at 375px, and Lighthouse scores. List the problems first, then fix them.
```

Before the production deploy, confirm with Jan:

- [ ] Are placeholder prices OK to go live, or should the estimator be hidden?
- [ ] Are all `[TBC]` placeholders acceptable for launch, or do they need real details?
- [ ] Is the hero image approved?

## Ongoing rituals

After every session:

1. Update **Current Build State** in `CLAUDE.md` (status, next goal, in flight, blocked)
2. Add anything surprising to **Known Gotchas**
3. Add new unknowns to **Open Questions**
4. Run `npm run build`, `npm run check` and `npm run test`
5. Commit with a conventional message (`feat:`, `fix:`, `content:`, `chore:`)
6. Push (Vercel deploys automatically)

## When in doubt

- Re-read CLAUDE.md, especially **Venue facts** and **What NOT to do**
- Make a simple, reversible choice and note it, rather than stalling
- Ask Jan about anything client-facing: prices, facts, or the hero image

The single most important principle: **never invent what the client hasn't told us.** A clear `[TBC]` is always better than a convincing guess on a real venue's website.
