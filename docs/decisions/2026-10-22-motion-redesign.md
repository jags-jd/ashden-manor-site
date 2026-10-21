# 2026-10-22: Image-led redesign with GSAP motion

## Context

Jan asked for a richer feel, taking belgradearbor.rs as the reference. That means a floating header, stronger transitions between sections, and a restrained, image-led layout with very little text per screen. The original brief said "subtle fades at most" and allowed no new dependencies, and Jan changed both.

## Decisions

- **GSAP 3** (core, ScrollTrigger and SplitText) is the only motion library. It's free for commercial use. All motion lives in `src/lib/motion.ts`, and components opt in with data attributes (`data-split`, `data-reveal`, `data-reveal-image`, `data-parallax`, `data-count`, `data-stack`, `data-horizontal`).
- **Progressive enhancement.** The page is complete without JavaScript and with reduced motion: no pins, no horizontal scroll, and content is never hidden. GSAP sets its own starting states, so nothing below the hero is hidden by CSS. The hero and preloader have CSS failsafes.
- **Desktop-only pinning** (from 56rem). Sections hold still while the next slides over ("stacked cards"), and Your day scrolls sideways. Phones get reveals and parallax only, because pinning on touch screens is fragile and slow.
- **Native scrolling.** No smooth-scroll library (Lenis, ScrollSmoother). It would hurt accessibility and anchor links, and it isn't needed for the effect.
- **Floating header with a `<dialog>` menu**, for free focus trapping, Escape handling and inert content behind it. Rolling-text hovers use an `aria-hidden` duplicate, so screen readers hear each label once.
- **Photos.** The delivered photos are portrait and 675–1080px wide, too small to run sharp full-bleed on desktop. So the hero uses a blurred backdrop with the photo sharp in an arch, and other sections use framed photos (Georgian arches) rather than full-bleed backgrounds.
- **Preloader** once per session (`sessionStorage`), capped at about 2s, to limit the cost to LCP.

## Consequences

- About 126KB of JavaScript before compression (about 45KB gzipped), loaded as modules.
- The preloader delays the hero text, which may cost some Lighthouse Performance points on a first visit. Measure in the polish pass, and drop or shorten it if it pushes the score below 90.
- New sections should follow the same pattern: one headline, a short paragraph, one or two photos, and data attributes for motion.
