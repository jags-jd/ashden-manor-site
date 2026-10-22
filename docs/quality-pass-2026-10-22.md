# Quality pass, 2026-10-22

This pass checked the production build (`astro preview`) against the "Quality bar" in CLAUDE.md. The checks used headless Edge driven over the DevTools protocol, plus Lighthouse 12.8.2 (run through `npx`, not added to the project).

## Results after fixes

| Check | Result |
|---|---|
| Lighthouse, mobile | Performance **91**, Accessibility **100**, Best Practices **100**, SEO **100** (three runs, all the same) |
| Lighthouse, desktop | Performance **98**, Accessibility **100**, Best Practices **100**, SEO **100** |
| Text contrast | 190 text elements at 1280×800 and at 375×667 with motion settled: **0** below AA. No text sits directly on a photo. |
| Keyboard | 34 stops in a sensible order, from the skip link to "Back to the top". Each focused element ends up on screen, uncovered, with a visible outline of 3:1 or more. |
| Target size (WCAG 2.2, 24×24) | 0 failures |
| Reduced motion | No pins, no horizontal scroll, no preloader, nothing hidden, clipped or animating, and `scroll-behavior: auto` |
| 375px | No horizontal overflow. The layout was reviewed in screenshots. |
| Structure | One h1, no heading jumps, every image has alt text, every field is labelled, no duplicate ids or broken anchors |
| Console | No errors or warnings |

## Problems found and fixed

1. **Mobile performance 82.** Lighthouse's LCP was 3.8s, because the hero copy stayed hidden until the preloader and intro had played. Fixes:
   - The hero copy is now painted from the first frame and only slides into place.
   - On phones the hero photo shows immediately, with no unmasking.
   - The preloader runs on desktop only.
   - Motion is set up in `requestIdleCallback`.
   - CSS is inlined (`build.inlineStylesheets: 'always'`).
   - Photo quality is 62 (hero 60), a 900w size was added, the Spaces `sizes` were corrected, and the hero crest is lazy-loaded (it's hidden on phones).

   The LCP actually observed is now 0.2s, the same as first paint. The 3.3s Lighthouse reports is its simulated slow-4G figure.
2. **Headlines below the fold sat at 8% opacity** before they revealed (a contrast failure). They now reveal by blur and rise only, at full opacity.
3. **The skip link's focus ring was Linen over Chalk (1.2:1).** It's now drawn inside the Ink box (12.1:1).
4. **Estimator radios scrolled the wrong place into view** on focus. The `.option` pill is now `position: relative`.
5. **Focus inside a pinned (stacked) section could stay off screen.** `motion.ts` now scrolls to bring it into view.
6. **The "flexible" checkbox was 22×22.** It's now 24×24.
7. **The Your day list was a Tab stop when it didn't scroll.** It's now focusable only while it's a scrolling row.

## Not changed (by design or to check later)

- The rolling-text labels contain a duplicated, `aria-hidden` copy of the label, which is how the effect works. Screen readers hear each label once.
- With smooth scrolling on, long jumps between focus stops take about a second. That's expected.
- Test on real devices before launch: iPhone Safari (font rendering, the pinned sideways scroll) and an Android mid-range phone (scroll smoothness).
