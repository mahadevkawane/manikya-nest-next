# How FindWay Works — story wheel + Our Mission (home page)

**Date:** 2026-07-14
**Status:** Approved by user

## Goal

Replicate the Captain Fresh homepage animation (reference: user screen recording
`14.07.2026_11.24.44_REC.mp4`) on the FindWay home page, directly below the
"Trending near you" section, adapted to FindWay's four pillars:
**Home → Job → Skill → Community**, followed by an **Our Mission** block.

## Section 1 — Story wheel

- Centered headline: "One City. One App. Your Whole Journey, Sorted."
- Soft red gradient card (rausch-tinted) containing an SVG wheel.
- Wheel builds wedge by wedge on a looping timeline once scrolled into view:
  Home → Job → Skill → Community, each a quarter wedge in an alternating
  red shade with a curved label, plus an icon callout (circle + connector
  line) that fades in with its wedge.
- After all four wedges: white inner circle fades in with the `findway.`
  wordmark; small white arrows sit between wedges suggesting the cycle.
- Timeline is CSS keyframes on a shared cycle (~12s, infinite). No new
  libraries; IntersectionObserver starts/holds the animation.

## Section 2 — Our Mission

- Two-column layout (stacks on mobile).
- Left: four staggered rounded gradient cards (Home, Job, Skill, Community),
  white icon in a translucent circle, connected by thin hairlines; cards
  reveal one by one on scroll.
- Right: coral "Our Mission" display heading, bold subheading
  "Connect Every New Beginning in the City — Home, Work, and Beyond",
  and mission paragraph (fragmented relocation → one platform, verified
  listings, zero brokerage, community).

## Implementation

- New client component `src/components/HowFindWayWorks.tsx` rendering both
  sections; inserted in `src/app/page.tsx` between "Trending near you" and
  "Grow your career".
- Colors from existing tokens (`rausch` #ff385c family); fully responsive;
  callouts hidden/repositioned on small screens.
- Animations respect `prefers-reduced-motion` (render final state, no loop).

## Out of scope

- No route changes, no backend, no new dependencies.
- Founder's Feature section from the video is not included.
