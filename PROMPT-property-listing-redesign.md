# PROMPT — Redesign the NestNext Property Listing Experience

> Paste this whole file into Claude Code (or v0 / Lovable / Cursor) as the task.
> It is written to produce output that fits the **existing NestNext codebase** —
> Next.js App Router, Tailwind, the custom design tokens, `PageLayout`, and
> `ListingCard`. Edit the bracketed `[CHOICES]` if you want different defaults.

---

## 0. Role & Mission

You are a senior product designer + front-end engineer redesigning the
**property discovery and listing experience** for **NestNext**, an India-focused
"housing + jobs in one place" platform. Today the catalog is residential-only
(PG/Hostel, Rental flat, Co-living, Homestay) plus a Jobs vertical. We are
expanding to a **two-world model: Residential and Commercial**, in the spirit of
NoBroker and MagicBricks but cleaner, more visual, and with NestNext's
calmer Airbnb-like polish.

Deliver a redesign that does three things:

1. **A visual category-discovery surface** — image-led tiles, split into
   Residential vs Commercial, that make "what do you want" obvious at a glance.
2. **A dedicated, tailored page per intent** — clicking a tile (Rent, Buy,
   PG/Hostel, Office, Shop, etc.) routes to a page whose filters, card content,
   and copy are specific to *that* intent, not a generic list.
3. **A best-in-class listing/results layout** — sticky smart search + filters,
   rich result cards, list↔map, trust signals, all responsive and accessible.

Keep NestNext's existing voice: trustworthy, zero-brokerage, verified, "find a
home near work." Do **not** ship a generic real-estate clone — make it feel
designed.

---

## 1. Non-negotiable constraints (match the existing codebase)

- **Framework:** Next.js **App Router** (`app/` directory). This repo pins a
  version with breaking changes — before writing code, read the relevant guide
  in `node_modules/next/dist/docs/` and follow current conventions. Use `Link`
  from `next/link` for navigation, dynamic routes as `app/<x>/[id]/page.tsx`.
- **Styling:** Tailwind with the project's **custom semantic tokens** — use these,
  not raw hex. Known tokens in use:
  - Colors: `rausch` (brand accent) + `rausch/10`, `rausch-active`, `ink`
    (primary text/dark), `body`, `muted`, `muted-soft`, `canvas` (page bg),
    `surface-soft`, `surface-strong`, `hairline`, `hairline-soft`.
  - Radii: tiles/cards use `rounded-[14px]`, larger surfaces `rounded-[20px]` /
    `rounded-[32px]`. Shadow: `shadow-airbnb`. Motion helpers: `hover-lift`,
    `animate-fade-up`, `skeleton`, `scrollbar-hide`.
- **Reuse, don't reinvent:** wrap pages in `app/components/PageLayout.tsx`
  (it provides breadcrumbs + horizontal padding). Reuse and extend
  `app/components/ListingCard.tsx` and `app/components/SearchBar.tsx` rather
  than duplicating them. Keep `BottomNav`, `Navbar`, `Footer` intact.
- **Data shape:** extend the existing `Listing` interface (fields today:
  `id, title, location, metroDistance?, price, rating, reviewCount, badge,
  amenities[], verified?, noBrokerage?, furnishing?, availableFrom?`). All data
  stays as in-file mock arrays for now (no backend) — but structure it so a
  Supabase fetch can drop in later (single typed source, no hardcoding inside JSX).
- **Accessibility is part of "done":** semantic landmarks, `aria-pressed` on
  toggles, visible `focus-visible:ring-*`, `aria-label` on icon buttons, alt text
  on every image, AA contrast. (The current code already does this — keep the bar.)
- **Responsive, mobile-first:** the primary user is on a phone. Design mobile
  first, then enhance at `md:` / `lg:`. Respect the existing `BottomNav` on mobile.

---

## 2. Information architecture (routes)

Create a clear hierarchy. Use these routes (adjust names to match conventions):

```
/explore                      ← NEW: visual category-discovery hub (the "what do you want" screen)
  ├─ World toggle: Residential | Commercial
  └─ Image tiles per intent

/c/[category]                 ← NEW: dedicated intent page (tailored listing page)
     e.g. /c/rent  /c/buy  /c/pg  /c/coliving  /c/commercial-office  /c/commercial-shop
  └─ Intent-specific filters + results (list/map) + intent-specific detail strip

/listing/[id]                 ← existing detail page (enrich it to reflect category context)
/find-nest                    ← keep as the generic/all search, OR fold into /explore (recommend: make it the residential default)
```

**Intent taxonomy (the tiles):**

- **Residential:** `Rent` (flats/houses), `Buy` (resale + new projects),
  `PG/Hostel`, `Co-living`, `Homestay`, `Flatmate finder`.
- **Commercial:** `Office space`, `Shop / Showroom`, `Co-working`,
  `Warehouse / Godown`, `Land / Plot`, `Lease / Pre-leased`.

Each tile carries: an image, a label, a one-line subtitle, and a live count
(e.g. "1,240 homes"). Clicking routes to `/c/[category]`.

---

## 3. Screen-by-screen design spec

### 3A. `/explore` — Visual category-discovery hub

Reference the *structure* of NoBroker's home intent grid and MagicBricks'
"Residential / Commercial" segmented control, but execute with NestNext polish.

Layout, top → bottom:

1. **Hero search band** (`bg-surface-soft`, rounded bottom like the current
   home hero). Inside: a **smart `SearchBar`** with an attached intent dropdown
   ("Rent · Buy · PG · Commercial…"), a city/locality input with recent
   searches, and a primary `rausch` Search button. On mobile it collapses to a
   single tappable pill that expands to a full-screen search sheet.
2. **World segmented control:** a centered 2-segment toggle
   **Residential | Commercial** (`aria-pressed`, animated active pill on `ink`
   background). Switching it swaps the tile set with a subtle `animate-fade-up`.
3. **Category tile grid:** responsive grid —
   `grid-cols-2 md:grid-cols-3 lg:grid-cols-4`, `gap-4`. Each tile:
   - `rounded-[14px]`, `overflow-hidden`, `hover-lift hover:shadow-airbnb`.
   - Full-bleed image (use `next/image`; until real photos exist, use a tasteful
     gradient + the existing house SVG as a `skeleton` placeholder).
   - Gradient scrim bottom → label (white, semibold) + subtitle + count chip.
   - Whole tile is a `Link` to `/c/[category]` with a visible focus ring.
4. **Trust strip:** reuse the home page's 4-up proof points (Verified, Zero
   brokerage, Rated 4.6★, Housing+Jobs).
5. **"Popular in [city]" rail:** horizontal-scroll `ListingCard` rail
   (`scrollbar-hide`) mixing residential + commercial highlights.
6. **Secondary discovery:** "Browse by budget", "Browse by locality",
   "New projects" chip rows that deep-link into `/c/[category]?...`.

### 3B. `/c/[category]` — Tailored intent listing page

This is the heart of the redesign. It generalizes today's `find-nest` but
becomes **intent-aware**: the filters, card emphasis, and copy change per
category. Keep the strong bones already in `find-nest` (sticky filter bar,
applied-filter chips, list+map split, empty state) and elevate them.

Top → bottom:

1. **Breadcrumbs** via `PageLayout`: Home › Explore › [Category].
2. **Context header:** big title ("Flats for rent in Koramangala"), result count,
   and a short intent line. Include a **save-this-search** action.
3. **Sticky smart filter bar** (`sticky top-20`, `backdrop-blur`, like current):
   - First chip group is **intent-specific** — examples:
     - *Rent:* BHK (1/2/3+), Furnishing, Tenant type, Move-in date, Pet-friendly.
     - *Buy:* Budget (₹L–Cr), BHK, New/Resale, Possession status, RERA-approved.
     - *PG/Hostel:* Gender, Sharing (single/double/triple), Meals, Curfew, Deposit.
     - *Co-living:* Furnished, Community, All-inclusive, Lock-in.
     - *Commercial-Office:* Carpet area (sq ft), Furnished/Bare shell, Seats,
       Parking, Floor.
     - *Commercial-Shop:* Frontage, Footfall zone, Floor, Washroom.
   - Persistent controls: **Budget range slider** (formatted ₹, like current),
     **Sort** (Relevance / Price / Rating / Newest / Area), and the
     **List ↔ Map** toggle.
   - Add a **"More filters" button → slide-over panel** (right drawer on desktop,
     bottom sheet on mobile) holding the long tail of filters with an
     "Apply (N)" footer. Selected filters surface as removable chips below the bar.
4. **Results region — list + map split** (`md:grid-cols-[1fr_minmax(0,440px)]`),
   reusing the current split pattern:
   - **List column:** intent-aware result rows / `ListingCard`s. Emphasize the
     fields that matter for the intent (e.g. carpet area + floor for offices,
     sharing + meals for PG, price/sqft + possession for Buy). Each card keeps:
     image carousel, save heart, category badge, verified + no-brokerage chips,
     rating, price, and a one-tap **"Contact owner / Schedule visit"** CTA.
   - **Map column:** sticky map (placeholder now) with price pins; hovering a
     card highlights its pin and vice-versa.
   - Keep the existing **empty state** ("No homes match…") and **clear-all**.
5. **Inline cross-sell (NestNext's edge):** after ~6 results, insert a
   "Jobs near these homes" or "Plan your commute" promo card linking to the
   Jobs / Commute verticals — this is the differentiator vs NoBroker.
6. **Pagination / infinite scroll** with a skeleton loading state
   (reuse the `skeleton` shimmer already in `ListingCard`).

### 3C. `/listing/[id]` — enrich the existing detail page

Make the detail page reflect the category it came from:

- **Gallery** (photo grid → lightbox), title, locality + map snippet, price block
  with category-appropriate breakdown (rent + deposit + maintenance; or
  price + price/sqft + possession; or PG rent + sharing + meals).
- **Key facts row** tailored to category (BHK/area/floor/furnishing OR
  sharing/gender/meals OR carpet area/seats/parking).
- **Trust block:** Verified badge, owner profile, "Zero brokerage", reviews.
- **Sticky action bar** (mobile bottom, desktop right rail):
  Contact / Schedule visit / Save / Share.
- **"Around this place":** commute time, nearby metro, and — NestNext signature —
  **jobs & workplaces nearby**.
- **Similar listings** rail of `ListingCard`s in the same category.

---

## 4. Component plan (build these, keep them small & typed)

| Component | Responsibility |
|---|---|
| `WorldToggle` | Residential/Commercial segmented control, controlled via state or URL param. |
| `CategoryTile` | Image tile (image, label, subtitle, count) → links to `/c/[category]`. |
| `CategoryGrid` | Renders the right tile set for the active world. |
| `SmartSearchBar` | Extends existing `SearchBar`: intent dropdown + locality + CTA; mobile sheet. |
| `FilterBar` | Sticky scrollable chip row; renders intent-specific chip sets from config. |
| `FiltersDrawer` | Slide-over / bottom-sheet for advanced filters with "Apply (N)". |
| `AppliedFilters` | Removable chips + clear-all (generalize current implementation). |
| `ResultsList` | Intent-aware list rows + grid of `ListingCard`s. |
| `MapPanel` | Sticky map placeholder with price pins + card↔pin hover sync. |
| `ListingCard` | **Extend existing** — add image carousel, area/intent fields, CTA. |
| `CrossSellCard` | "Jobs/Commute near these homes" inline promo. |

Drive intent differences from a **single config object**, e.g.:

```ts
// app/lib/categories.ts
export const CATEGORIES = {
  rent:  { world: "residential", label: "Rent", filters: ["bhk","furnishing","tenant","moveIn"], ... },
  buy:   { world: "residential", label: "Buy",  filters: ["budget","bhk","status","rera"], ... },
  pg:    { world: "residential", label: "PG/Hostel", filters: ["gender","sharing","meals"], ... },
  "commercial-office": { world: "commercial", label: "Office space", filters: ["area","furnish","seats"], ... },
  // ...
}
```

So adding a category = one config entry, not a new page. Page `/c/[category]`
reads the slug, looks up config, and renders generically.

---

## 5. Visual & motion direction

- **Calm, photo-forward, lots of whitespace.** Airbnb restraint, not
  MagicBricks clutter. One clear accent: `rausch`. Everything else `ink`/`muted`
  on `canvas`/`surface-soft`.
- **Tiles & cards:** `rounded-[14px]`, soft `shadow-airbnb` only on hover,
  `hover-lift` micro-interaction, image scrim for legible labels.
- **Micro-interactions:** `animate-fade-up` on world switch and result load;
  `skeleton` shimmer while images/results load; heart-save scale bounce
  (already in `ListingCard`); active pill slide on toggles.
- **Iconography:** keep the existing inline-SVG stroke style (1.2–2.4 stroke,
  `currentColor`). No icon-font dependency.
- **Empty / error / loading states** designed for every async surface — never a
  blank screen.

---

## 6. What to reference from NoBroker & MagicBricks (and what to avoid)

- **Borrow:** the Residential/Commercial segmented split; intent-first entry
  ("I want to Rent / Buy / PG"); rich filter chips + advanced drawer; map+list
  split; "owner/verified/no-brokerage" trust badges; budget slider; save-search.
- **Avoid:** banner clutter, aggressive popups/lead-gen walls, dense low-contrast
  text, and burying listings under ads. NestNext stays clean and trustworthy.

---

## 7. Deliverables & acceptance

1. `/explore` hub with working **Residential/Commercial** toggle and image tiles.
2. Dynamic **`/c/[category]`** page driven by a category config, with
   intent-specific filters, list+map, advanced filter drawer, applied-filter
   chips, sort, budget slider, empty state, and skeleton loading.
3. Extended `ListingCard` (carousel + intent fields + CTA) and an enriched
   `/listing/[id]` detail page reflecting its category.
4. At least one **cross-sell** tie-in to Jobs/Commute (NestNext differentiator).
5. Everything responsive (mobile-first), accessible (keyboard + screen reader +
   AA contrast), and using the existing tokens/components — no raw hex, no
   duplicated layout.
6. Mock data extends the current `Listing` type and lives in a single typed
   source ready for a later Supabase swap.

**Definition of done:** a user lands on `/explore`, toggles to Commercial, taps
"Office space", lands on a page whose filters and cards are clearly about
offices (carpet area, seats, floor), filters down with chips + drawer, switches
to map, opens a listing, and sees jobs nearby — all on a phone, with no layout
breakage and no accessibility regressions.

---

### How to use this prompt incrementally (recommended)

Don't build it all at once. Sequence:
1. `app/lib/categories.ts` config + types.
2. `/explore` hub (WorldToggle + CategoryGrid + tiles).
3. `/c/[category]` generic page reading the config (start by porting `find-nest`).
4. FiltersDrawer + extended `ListingCard`.
5. Enriched `/listing/[id]` + cross-sell.
Review after each step.
