/**
 * Page motion, built on GSAP (ScrollTrigger and SplitText).
 *
 * Everything here is an enhancement: the page is complete without it, and nothing runs when
 * the visitor prefers reduced motion. Components opt in with data attributes:
 *
 *   data-split            headline revealed word by word, from a blur, as it scrolls in
 *   data-reveal           fades up once on entering
 *   data-reveal-group     its children fade up in sequence
 *   data-reveal-image     photo unmasked from below, image settling from a slight zoom
 *   data-parallax="1"     photo drifts inside its frame while scrolling (Photo.astro sizes the image)
 *   data-count="100"      number counts up once on entering
 *   data-stack            desktop: the section holds still while the next one slides over it
 *   data-horizontal       desktop: pinned, with its [data-track] scrolling sideways
 *
 * Plus the hero intro and preloader, and the fixed section counter.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

const MOTION = '(prefers-reduced-motion: no-preference)';
const DESKTOP = '(min-width: 56rem)';
/** sessionStorage key: the preloader shows once per visit (also read in Base.astro). */
export const INTRO_KEY = 'am-intro-seen';

let introPlayed = false;

/**
 * "Play when first reached, then stay": used instead of ScrollTrigger's `once`. A `once` trigger
 * kills itself as soon as it fires, and after a reload part-way down the page many fire during
 * setup, which breaks ScrollTrigger's refresh mid-loop ("reading 'end'" of undefined).
 */
const PLAY_ONCE = 'play none none none';

const all = <T extends Element = HTMLElement>(selector: string, root: ParentNode = document) => [
  ...root.querySelectorAll<T>(selector),
];

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initMotion() {
  const mm = gsap.matchMedia();

  mm.add({ motion: MOTION, desktop: `${MOTION} and ${DESKTOP}` }, (context) => {
    const { motion, desktop } = context.conditions as { motion: boolean; desktop: boolean };
    if (!motion) return;

    const cleanups: Array<() => void> = [];
    // Collected before pinning: GSAP wraps each pinned section in a spacer, so `main > section` stops matching it.
    const blocks = all('main > section, body > footer');

    // Pins first, in page order, so every later trigger is measured with them in place.
    if (desktop) sectionTransitions(blocks, cleanups);
    // Phones keep the sideways scroll of Your day (Jan's call), just not the stacked sections.
    else blocks.filter((block) => block.hasAttribute('data-horizontal')).forEach((block) => horizontal(block, cleanups));

    intro(cleanups);
    headings(desktop, cleanups);
    reveals();
    images();
    parallax();
    counters(cleanups);
    if (desktop) sectionProgress(blocks.filter((block) => block.matches('section')), cleanups);

    return () => cleanups.forEach((fn) => fn());
  });

  // Fonts and lazy images settle the layout late; re-measure once everything has loaded.
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

/* ---------------------------------------------------------------------------
 * Hero intro (and the preloader on a first visit)
 * ------------------------------------------------------------------------- */

function intro(cleanups: Array<() => void>) {
  const root = document.documentElement;
  const preloader = document.querySelector<HTMLElement>('[data-preloader]');
  const heading = document.querySelector<HTMLElement>('[data-hero-heading]');
  const photo = document.querySelector<HTMLElement>('[data-hero-photo]');
  const backdrop = document.querySelector<HTMLElement>('[data-hero-backdrop]');
  const items = all('[data-hero-item]');
  const hidden = [heading, photo, ...items].filter((el): el is HTMLElement => el !== null);

  if (introPlayed) {
    gsap.set(hidden, { visibility: 'visible' });
    return;
  }
  introPlayed = true;

  const split = heading ? SplitText.create(heading, { type: 'words', mask: 'words', wordsClass: 'split-word' }) : null;
  if (split) cleanups.push(() => split.revert());

  const hero = gsap.timeline({ paused: true, defaults: { ease: 'power4.out' } });
  hero.set(hidden, { visibility: 'visible' });
  if (photo) {
    hero.fromTo(photo, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'power4.inOut' }, 0);
    const img = photo.querySelector('img');
    if (img) hero.fromTo(img, { scale: 1.3 }, { scale: 1, duration: 2.2, ease: 'power3.out' }, 0);
  }
  if (backdrop) hero.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 1.8, ease: 'power2.out' }, 0);
  if (split) hero.from(split.words, { yPercent: 110, duration: 1.3, stagger: 0.06 }, 0.35);
  hero.from(items, { y: 24, opacity: 0, duration: 1.1, stagger: 0.08 }, 0.7);

  const showPreloader = root.classList.contains('intro') && preloader;
  if (!showPreloader) {
    hero.play();
    return;
  }

  const count = preloader.querySelector<HTMLElement>('[data-preloader-count]');
  const progress = { value: 0 };
  const render = () => {
    if (count) count.textContent = String(Math.round(progress.value));
  };

  // Count most of the way while fonts and the hero photo load, then finish. Never longer than ~2s.
  gsap.to(progress, { value: 80, duration: 0.9, ease: 'power1.out', onUpdate: render });
  const heroImage = photo?.querySelector('img');
  const ready = Promise.all([
    document.fonts.ready,
    heroImage && !heroImage.complete ? heroImage.decode().catch(() => undefined) : Promise.resolve(),
  ]);
  const timeout = new Promise((resolve) => window.setTimeout(resolve, 1600));

  Promise.race([ready, timeout]).then(() => {
    gsap
      .timeline()
      .to(progress, { value: 100, duration: 0.35, ease: 'power1.inOut', onUpdate: render, overwrite: true })
      .to(preloader.children, { y: -16, opacity: 0, duration: 0.4, stagger: 0.05, ease: 'power2.in' })
      .to(preloader, {
        clipPath: 'inset(0% 0% 100% 0%)',
        duration: 1,
        ease: 'power4.inOut',
        onComplete: () => {
          root.classList.remove('intro');
          try {
            sessionStorage.setItem(INTRO_KEY, '1');
          } catch {
            // Private mode or blocked storage: the intro simply shows again next time.
          }
        },
      })
      .add(() => {
        hero.play();
      }, '-=0.55');
  });
}

/* ---------------------------------------------------------------------------
 * Headlines: word by word, out of a soft blur, tied to the scroll
 * ------------------------------------------------------------------------- */

/**
 * Desktop: tied to the scroll, and fully sharp by the time the headline is a little below the
 * middle of the screen. Phones: a short reveal that plays once, so a headline is never left
 * half-blurred on a small screen.
 */
function headings(desktop: boolean, cleanups: Array<() => void>) {
  for (const el of all('[data-split]')) {
    const split = SplitText.create(el, { type: 'words', wordsClass: 'split-word' });
    cleanups.push(() => split.revert());
    const from = { opacity: 0.08, filter: 'blur(10px)', yPercent: 25 };
    const to = { opacity: 1, filter: 'blur(0px)', yPercent: 0 };
    if (desktop) {
      gsap.fromTo(split.words, from, {
        ...to,
        stagger: 0.12,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 90%', end: 'top 60%', scrub: 0.6 },
      });
    } else {
      gsap.fromTo(split.words, from, {
        ...to,
        duration: 0.9,
        stagger: 0.06,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: PLAY_ONCE },
      });
    }
  }
}

/* ---------------------------------------------------------------------------
 * Fades, image reveals, parallax, counters
 * ------------------------------------------------------------------------- */

function reveals() {
  const fadeUp = (targets: Element[]) =>
    gsap.to(targets, { y: 0, opacity: 1, duration: 1.1, stagger: 0.1, ease: 'power3.out', overwrite: true });

  gsap.set('[data-reveal]', { y: 32, opacity: 0 });
  ScrollTrigger.batch('[data-reveal]', { start: 'top 90%', onEnter: fadeUp });

  for (const group of all('[data-reveal-group]')) {
    const children = [...group.children];
    gsap.set(children, { y: 32, opacity: 0 });
    ScrollTrigger.create({ trigger: group, start: 'top 85%', onEnter: () => fadeUp(children) });
  }
}

/** Unmask a photo frame from below while its image settles from a slight zoom. */
function unmask(frame: Element, scrollTrigger: ScrollTrigger.Vars) {
  const img = frame.querySelector('img');
  const tl = gsap.timeline({ scrollTrigger });
  tl.fromTo(frame, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'power4.inOut' });
  if (img) tl.fromTo(img, { scale: 1.25 }, { scale: 1, duration: 1.9, ease: 'power3.out' }, 0);
}

function images() {
  for (const frame of all('[data-reveal-image]')) {
    // Horizontal steps are revealed by sectionTransitions; hidden tab panels by switchPanel.
    if (frame.closest('.is-horizontal') || frame.closest('[data-panel][hidden]')) continue;
    unmask(frame, { trigger: frame, start: 'top 88%', toggleActions: PLAY_ONCE });
  }
}

function parallax() {
  for (const frame of all('[data-parallax]')) {
    const img = frame.querySelector('img');
    if (!img) continue;
    // Photo.astro makes the image 120% of its frame, so ±8% of the image's height never shows an edge.
    const shift = Math.min(5.5 * (Number(frame.dataset.parallax) || 1), 8);
    gsap.fromTo(
      img,
      { yPercent: -shift },
      { yPercent: shift, ease: 'none', scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true } },
    );
  }
}

function counters(cleanups: Array<() => void>) {
  for (const el of all('[data-count]')) {
    const target = Number(el.dataset.count);
    if (!Number.isFinite(target)) continue;
    const state = { value: 0 };
    el.textContent = '0';
    cleanups.push(() => {
      el.textContent = String(target);
    });
    gsap.to(state, {
      value: target,
      duration: 2.2,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = String(Math.round(state.value));
      },
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: PLAY_ONCE },
    });
  }
}

/* ---------------------------------------------------------------------------
 * Desktop section transitions: stacked cards and the horizontal day
 * ------------------------------------------------------------------------- */

function sectionTransitions(blocks: HTMLElement[], cleanups: Array<() => void>) {
  // Later sections paint above earlier ones, so they can slide over a pinned section.
  blocks.forEach((block, i) => {
    block.style.zIndex = String(i + 1);
  });
  cleanups.push(() => blocks.forEach((block) => block.style.removeProperty('z-index')));

  blocks.forEach((block, i) => {
    if (block.hasAttribute('data-horizontal')) horizontal(block, cleanups);
    else if (block.hasAttribute('data-stack') && blocks[i + 1]) stack(block, blocks[i + 1], cleanups);
  });
}

/**
 * Stacked sections, paced so there's time to take each one in:
 *   1. the section arrives (sliding over the previous one) and holds at the top of the screen;
 *   2. if it's taller than the screen, its content scrolls up while it stays pinned;
 *   3. it holds again at its end, then the next section slides up over it as it recedes.
 * The pauses are a transparent gap (margin) before the next section: the pinned section shows
 * through it. Holds are fractions of the screen height; the hero's are shorter so the first
 * scroll never feels stuck.
 */
const HOLD_AT_TOP = 0.3;
const HOLD_AT_END = 0.45;
const HERO_HOLD = 0.25;

function stack(section: HTMLElement, next: HTMLElement, cleanups: Array<() => void>) {
  const isHero = section.id === 'top';
  const holdTop = () => (isHero ? 0 : HOLD_AT_TOP * window.innerHeight);
  const holdEnd = () => (isHero ? HERO_HOLD : HOLD_AT_END) * window.innerHeight;
  const overflow = () => Math.max(section.offsetHeight - window.innerHeight, 0);

  // Re-applied before every refresh, so the pauses follow the screen height.
  const setGap = () => {
    next.style.marginTop = `${holdTop() + holdEnd()}px`;
  };
  setGap();
  ScrollTrigger.addEventListener('refreshInit', setGap);
  cleanups.push(() => {
    ScrollTrigger.removeEventListener('refreshInit', setGap);
    next.style.removeProperty('margin-top');
  });

  // Tall sections: after the first pause, the content moves up to its end while the section stays
  // put. Driven from the pin's own progress: a separate trigger on a pinned element would be offset
  // by the whole pin's length.
  const setY = gsap.quickSetter([...section.children], 'y', 'px');

  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: () => `+=${section.offsetHeight + holdTop() + holdEnd()}`,
    pin: true,
    pinSpacing: false,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      const scrolled = self.scroll() - self.start - holdTop();
      setY(-gsap.utils.clamp(0, overflow(), scrolled));
    },
  });

  // Recede as the next section covers it.
  gsap.fromTo(
    section.children,
    { scale: 1, opacity: 1 },
    {
      scale: 0.94,
      opacity: 0.25,
      ease: 'none',
      immediateRender: false,
      scrollTrigger: { trigger: next, start: 'top bottom', end: 'top top', scrub: true },
    },
  );
}

/** Pin the section and scroll its track sideways for as long as the track is wide. */
function horizontal(section: HTMLElement, cleanups: Array<() => void>) {
  const track = section.querySelector<HTMLElement>('[data-track]');
  if (!track) return;

  section.classList.add('is-horizontal');
  cleanups.push(() => section.classList.remove('is-horizontal'));

  const distance = () => Math.max(track.scrollWidth - document.documentElement.clientWidth, 0);
  // Scroll further than the track is wide, so the steps pass slowly enough to read.
  const PACE = 1.8;

  const slide = gsap.to(track, {
    x: () => -distance(),
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => `+=${distance() * PACE}`,
      pin: true,
      scrub: 1.2,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  // Each step reveals as it slides in from the right.
  for (const step of all('[data-step]', section)) {
    const frame = step.querySelector('[data-reveal-image]');
    if (frame) unmask(frame, { trigger: step, containerAnimation: slide, start: 'left 90%', toggleActions: PLAY_ONCE });
    const text = step.querySelector('.step-text');
    if (text) {
      gsap.from(text, {
        y: 32,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: step, containerAnimation: slide, start: 'left 80%', toggleActions: PLAY_ONCE },
      });
    }
  }
}

/* ---------------------------------------------------------------------------
 * Fixed section counter (desktop)
 * ------------------------------------------------------------------------- */

function sectionProgress(sections: HTMLElement[], cleanups: Array<() => void>) {
  const box = document.querySelector<HTMLElement>('[data-section-progress]');
  const number = box?.querySelector<HTMLElement>('[data-section-progress-number]');
  const fill = box?.querySelector<HTMLElement>('[data-section-progress-fill]');
  if (!box || !number || !fill) return;

  // Numbered from the first section after the hero, matching sectionNumber() in content.ts.
  sections.forEach((section, i) => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 55%',
      end: 'bottom 55%',
      onToggle: (self) => {
        if (!self.isActive) return;
        number.textContent = String(i).padStart(2, '0');
        box.classList.toggle('is-visible', i > 0);
      },
    });
  });

  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => gsap.set(fill, { scaleY: self.progress }),
  });

  // Out of the way over the footer, where it would sit on the small print.
  const footer = document.querySelector('body > footer');
  if (footer) {
    ScrollTrigger.create({
      trigger: footer,
      start: 'top 85%',
      onEnter: () => box.classList.remove('is-visible'),
      onLeaveBack: () => box.classList.add('is-visible'),
    });
  }

  cleanups.push(() => box.classList.remove('is-visible'));
}

/* ---------------------------------------------------------------------------
 * Tabs (Spaces.astro): wipe the newly chosen panel in
 * ------------------------------------------------------------------------- */

export function switchPanel(from: HTMLElement | undefined, to: HTMLElement) {
  if (from) from.hidden = true;
  to.hidden = false;
  if (reducedMotion()) return;

  const frame = to.querySelector('.photo');
  const img = frame?.querySelector('img');
  const text = to.querySelector('.panel-text');
  const tl = gsap.timeline();
  if (frame) tl.fromTo(frame, { clipPath: 'inset(0% 0% 0% 100%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'power4.inOut' }, 0);
  if (img) tl.fromTo(img, { scale: 1.2 }, { scale: 1, duration: 1.4, ease: 'power3.out' }, 0);
  if (text) tl.fromTo(text, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, 0.25);
}
