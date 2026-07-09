# Profile Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `/profile` into a premium dual-identity dashboard — a morphing hero with a Personal/Business segmented switch, a hybrid 2-column layout, and four new presentational blocks — reusing all existing session plumbing and Airbnb tokens.

**Architecture:** Pure frontend (`manikya-nest-next`, Next.js App Router, client components). A single theme helper maps `session.activeView` → accent classes. A new `ProfileSwitch` replaces the header's inline toggle. `app/profile/page.tsx` is restructured into hero → top band → 2-column grid; existing Personal segments and `BusinessDashboard` render inside the grid. Four new blocks are presentational, driven by session-derived or already-fetched data.

**Tech Stack:** Next.js (modified fork — see Global Constraints), React client components, Tailwind v4 with `@theme` tokens in `globals.css`, TypeScript.

## Global Constraints

- **Frontend only.** No backend routes, no Prisma, no new API calls beyond those already in `page.tsx` / `BusinessDashboard.tsx` (`/wishlist`, `/visits/mine`, `/listings/mine/stats`). Copy verbatim.
- **Modified Next.js:** before using any Next API you're unsure of, read the relevant guide in `node_modules/next/dist/docs/` (`AGENTS.md` rule).
- **Design tokens only:** use existing Tailwind token classes (`rausch`, `tab-rent`, `violet`, `indigo`, `ink`, `muted`, `hairline`, `canvas`, `surface-soft`, `shadow-airbnb`, `shadow-3d-soft`, `hover-lift`). No new raw hex in components; if a new token is truly needed, add it to `@theme` in `globals.css`.
- **No new dependencies.** No test framework exists; verification is typecheck + lint + manual visual check.
- **Theme mapping:** Personal → `rausch`/`tab-rent` (warm). Business → `violet`/`indigo`.
- **Accessibility:** keyboard-operable switch, focus-visible rings matching existing buttons, color never the sole signal, accessible label on the progress ring.
- **No horizontal page scroll** at any width. 2-column split is `lg:`+ only; stacks below.
- **Preserve** the hero's `-mx-4 md:-mx-6 lg:-mx-10` full-bleed pattern and the session skeleton (no hydration layout shift).

**Per-task verification baseline** (run at the end of every task before commit):
- `npx tsc --noEmit` → no errors.
- `npm run lint` → no new errors/warnings in touched files.
- Manual: `npm run dev`, open `/profile`, confirm the task's visible result and no console errors.

---

### Task 1: Theme helper for the two modes

**Files:**
- Create: `src/components/profile/theme.ts`

**Interfaces:**
- Produces: `profileTheme(view: "personal" | "business" | undefined): ProfileTheme` where
  ```ts
  interface ProfileTheme {
    isBusiness: boolean;
    accentText: string;      // e.g. "text-rausch" | "text-violet"
    accentBgSoft: string;    // e.g. "bg-rausch/10" | "bg-violet/10"
    ringGradient: string;    // e.g. "from-rausch to-tab-rent" | "from-violet to-indigo"
    heroGradient: string;    // e.g. "from-rausch/15 via-rausch/5 to-transparent" | "from-violet/15 via-indigo/5 to-transparent"
    pillGradient: string;    // e.g. "from-rausch to-tab-rent" | "from-violet to-indigo"
  }
  ```
  All later tasks import `profileTheme` and read these string fields directly into `className`.

- [ ] **Step 1: Create the helper**

```ts
// src/components/profile/theme.ts
// Single source of truth for the two profile identities. Every profile
// component reads its accent classes from here so Personal (warm rausch) and
// Business (violet/indigo) stay perfectly consistent.

export interface ProfileTheme {
  isBusiness: boolean;
  accentText: string;
  accentBgSoft: string;
  ringGradient: string;
  heroGradient: string;
  pillGradient: string;
}

export function profileTheme(view: "personal" | "business" | undefined): ProfileTheme {
  const isBusiness = view === "business";
  return isBusiness
    ? {
        isBusiness,
        accentText: "text-violet",
        accentBgSoft: "bg-violet/10",
        ringGradient: "from-violet to-indigo",
        heroGradient: "from-violet/15 via-indigo/5 to-transparent",
        pillGradient: "from-violet to-indigo",
      }
    : {
        isBusiness,
        accentText: "text-rausch",
        accentBgSoft: "bg-rausch/10",
        ringGradient: "from-rausch to-tab-rent",
        heroGradient: "from-rausch/15 via-rausch/5 to-transparent",
        pillGradient: "from-rausch to-tab-rent",
      };
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: PASS (no errors). No visual change yet.

- [ ] **Step 3: Commit**

```bash
git add src/components/profile/theme.ts
git commit -m "feat(profile): add profileTheme helper for personal/business identities"
```

---

### Task 2: ProfileSwitch — segmented pill + activate-business entry

**Files:**
- Create: `src/components/profile/ProfileSwitch.tsx`

**Interfaces:**
- Consumes: `profileTheme` (Task 1); `Role` from `@/lib/auth`.
- Produces: default export `ProfileSwitch` with props
  ```ts
  {
    activeView: "personal" | "business" | undefined;
    hasBusinessRole: boolean;
    onSwitch: (mode: "personal" | "business") => void;
    onActivate: (role: Role) => void;   // enable a business role, then switch
  }
  ```
  When `hasBusinessRole` is true it renders the two-segment pill; otherwise it renders an "Activate Business" button that expands the three role options and calls `onActivate`.

- [ ] **Step 1: Create the component**

```tsx
// src/components/profile/ProfileSwitch.tsx
"use client";
import { useState } from "react";
import type { Role } from "@/lib/auth";
import { profileTheme } from "./theme";

const BUSINESS_ROLES: { role: Role; title: string; desc: string }[] = [
  { role: "owner", title: "Property Owner / Landlord", desc: "List PGs, rooms, flats or commercial spaces." },
  { role: "agent", title: "Real Estate Agent", desc: "Manage client leads, matches and site visits." },
  { role: "builder", title: "Property Builder", desc: "List multi-tower projects and track inventory." },
];

export default function ProfileSwitch({
  activeView,
  hasBusinessRole,
  onSwitch,
  onActivate,
}: {
  activeView: "personal" | "business" | undefined;
  hasBusinessRole: boolean;
  onSwitch: (mode: "personal" | "business") => void;
  onActivate: (role: Role) => void;
}) {
  const [showRoles, setShowRoles] = useState(false);
  const isBusiness = activeView === "business";
  const theme = profileTheme(activeView);

  if (hasBusinessRole) {
    return (
      <div
        role="tablist"
        aria-label="Switch profile mode"
        className="relative inline-flex w-full sm:w-auto items-center bg-surface-soft border border-hairline rounded-full p-1 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]"
      >
        {/* Sliding thumb */}
        <span
          aria-hidden="true"
          className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-gradient-to-r ${theme.pillGradient} shadow-airbnb transition-all duration-300 ease-out ${
            isBusiness ? "left-[calc(50%+0px)]" : "left-1"
          }`}
        />
        {(["personal", "business"] as const).map((mode) => {
          const active = (mode === "business") === isBusiness;
          return (
            <button
              key={mode}
              role="tab"
              aria-selected={active}
              onClick={() => onSwitch(mode)}
              className={`relative z-10 flex-1 sm:flex-none sm:min-w-[132px] inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 ${
                active ? "text-white" : "text-muted hover:text-ink"
              }`}
            >
              {mode === "personal" ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" /></svg>
              )}
              <span className="capitalize">{mode}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // No business role yet — activation entry.
  if (!showRoles) {
    return (
      <button
        onClick={() => setShowRoles(true)}
        className={`inline-flex items-center gap-1.5 text-[13px] font-semibold text-white bg-gradient-to-r ${theme.pillGradient} rounded-full px-4 py-2.5 shadow-airbnb hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2`}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
        Activate Business Profile
      </button>
    );
  }

  return (
    <div className="w-full bg-canvas border border-hairline rounded-[16px] p-4 shadow-3d-soft animate-fade-up">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold text-ink">How do you want to act?</h4>
        <button onClick={() => setShowRoles(false)} className="text-[11px] font-semibold text-muted hover:text-ink">Cancel</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {BUSINESS_ROLES.map((opt) => (
          <button
            key={opt.role}
            onClick={() => { onActivate(opt.role); setShowRoles(false); }}
            className="text-left p-3 rounded-xl border border-hairline hover:border-violet hover:bg-violet/5 transition-all space-y-1 focus:outline-none bg-canvas"
          >
            <span className="font-bold text-xs text-ink block">{opt.title}</span>
            <span className="text-[11px] text-muted block leading-snug">{opt.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify** — `npx tsc --noEmit` PASS; `npm run lint` clean. (Not mounted yet; wired in Task 3.)

- [ ] **Step 3: Commit**

```bash
git add src/components/profile/ProfileSwitch.tsx
git commit -m "feat(profile): add ProfileSwitch segmented pill + activation entry"
```

---

### Task 3: Rework ProfileHeader to host the switch and morph by mode

**Files:**
- Modify: `src/components/profile/ProfileHeader.tsx`

**Interfaces:**
- Consumes: `ProfileSwitch` (Task 2), `profileTheme` (Task 1), `initialsOf` from `@/lib/roleTheme`, `Role` + `Session` from `@/lib/auth`.
- Produces: `ProfileHeader` with props
  ```ts
  {
    session: Session;
    verified: boolean;
    hasBusinessRole: boolean;
    onEdit: () => void;
    onShare?: () => void;
    onSwitch: (mode: "personal" | "business") => void;
    onActivate: (role: Role) => void;
  }
  ```

- [ ] **Step 1: Replace the header body**

Replace the entire file with:

```tsx
"use client";
import type { Role, Session } from "@/lib/auth";
import { initialsOf } from "@/lib/roleTheme";
import { profileTheme } from "./theme";
import ProfileSwitch from "./ProfileSwitch";

/**
 * Identity card hero — full-bleed soft brand band that morphs its theme with
 * the active mode. Hosts the Personal/Business segmented switch.
 */
export default function ProfileHeader({
  session,
  verified,
  hasBusinessRole,
  onEdit,
  onShare,
  onSwitch,
  onActivate,
}: {
  session: Session;
  verified: boolean;
  hasBusinessRole: boolean;
  onEdit: () => void;
  onShare?: () => void;
  onSwitch: (mode: "personal" | "business") => void;
  onActivate: (role: Role) => void;
}) {
  const theme = profileTheme(session.activeView);
  const isBusiness = theme.isBusiness;

  return (
    <section
      aria-label="Profile"
      className={`relative overflow-hidden -mx-4 md:-mx-6 lg:-mx-10 px-4 md:px-6 lg:px-10 pt-8 pb-7 mb-6 rounded-b-[32px] bg-gradient-to-br transition-all duration-500 animate-fade-up ${theme.heroGradient}`}
    >
      <div className="relative flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="relative shrink-0">
              <div className={`p-[3px] rounded-full bg-gradient-to-br transition-all duration-500 ${theme.ringGradient}`}>
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-canvas flex items-center justify-center overflow-hidden">
                  {session.avatarUrl ? (
                    <img src={session.avatarUrl} alt={session.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className={`text-xl md:text-2xl font-bold transition-colors duration-500 ${theme.accentText}`}>
                      {initialsOf(session.name)}
                    </span>
                  )}
                </div>
              </div>
              <span
                className={`absolute -bottom-1 -right-1 w-6 h-6 md:w-7 md:h-7 rounded-full text-white flex items-center justify-center shadow-md border-2 border-canvas ${
                  isBusiness ? `bg-gradient-to-br ${theme.ringGradient}` : "bg-ink"
                }`}
                title={isBusiness ? "Business workspace active" : "Personal workspace active"}
              >
                {isBusiness ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" aria-hidden="true"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" /></svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" aria-hidden="true"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                )}
              </span>
            </div>

            <div className="min-w-0">
              <h1 className="text-lg md:text-xl font-bold text-ink truncate">{session.name}</h1>
              <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                <span className={`inline-flex items-center gap-1 text-[11px] font-semibold text-white bg-gradient-to-r ${theme.pillGradient} px-2.5 py-0.5 rounded-full uppercase tracking-wider`}>
                  {isBusiness ? "Business Profile" : "Personal Profile"}
                </span>
                {verified ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-green-700 bg-green-100 px-2.5 py-0.5 rounded-full">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true"><path d="M5 13l4 4L19 7" /></svg>
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true"><path d="M12 8v4m0 4h.01M12 3l9 4v5c0 5-4 8-9 9-5-1-9-4-9-9V7z" /></svg>
                    KYC pending
                  </span>
                )}
              </div>
              {session.city && (
                <p className="flex items-center gap-1 text-[13px] text-muted mt-1.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><circle cx="12" cy="11" r="3" /></svg>
                  {session.city}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {isBusiness && onShare && (
              <button
                onClick={onShare}
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink bg-canvas border border-hairline rounded-full px-4 py-2.5 shadow-airbnb hover:bg-surface-soft transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" /></svg>
                <span className="hidden sm:inline">Share</span>
              </button>
            )}
            <button
              onClick={onEdit}
              aria-label="Edit profile"
              className="shrink-0 inline-flex items-center gap-1.5 text-[13px] font-medium text-ink bg-canvas border border-hairline rounded-full px-3.5 py-2.5 shadow-airbnb hover:bg-surface-soft transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              <span className="hidden sm:inline">Edit</span>
            </button>
          </div>
        </div>

        {/* The morphing A+C switch lives inside the hero */}
        <div className="w-full sm:w-auto">
          <ProfileSwitch
            activeView={session.activeView}
            hasBusinessRole={hasBusinessRole}
            onSwitch={onSwitch}
            onActivate={onActivate}
          />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify** — `npx tsc --noEmit` will FAIL where `page.tsx` still passes the old props (`onSwitchMode`). That is expected and fixed in Task 4. Confirm the ONLY errors are in `src/app/profile/page.tsx`. Do not run lint yet.

- [ ] **Step 3: Commit**

```bash
git add src/components/profile/ProfileHeader.tsx
git commit -m "feat(profile): morphing identity hero hosting ProfileSwitch"
```

---

### Task 4: CompletionMeter block

**Files:**
- Create: `src/components/profile/CompletionMeter.tsx`

**Interfaces:**
- Consumes: `Session` from `@/lib/auth`, `profileTheme` (Task 1).
- Produces: default export `CompletionMeter` with props `{ session: Session; verified: boolean; onEdit: () => void }`. Computes a percentage from present fields and renders an SVG ring + checklist.

- [ ] **Step 1: Create the component**

```tsx
// src/components/profile/CompletionMeter.tsx
"use client";
import type { Session } from "@/lib/auth";
import { profileTheme } from "./theme";

interface ChecklistItem { label: string; done: boolean }

export default function CompletionMeter({
  session,
  verified,
  onEdit,
}: {
  session: Session;
  verified: boolean;
  onEdit: () => void;
}) {
  const theme = profileTheme(session.activeView);
  const items: ChecklistItem[] = [
    { label: "Add profile photo", done: Boolean(session.avatarUrl) },
    { label: "Add your city", done: Boolean(session.city) },
    { label: "Add phone number", done: Boolean(session.phone) },
    { label: "Verify identity (KYC)", done: verified },
    { label: "Choose a role", done: session.roles.length > 0 },
  ];
  const done = items.filter((i) => i.done).length;
  const pct = Math.round((done / items.length) * 100);

  // SVG ring geometry
  const r = 34;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);

  return (
    <div className="bg-canvas border border-hairline rounded-[16px] p-5 shadow-3d-soft flex items-center gap-5">
      <div className="relative shrink-0" role="img" aria-label={`Profile ${pct}% complete`}>
        <svg width="84" height="84" viewBox="0 0 84 84" className="-rotate-90">
          <circle cx="42" cy="42" r={r} fill="none" stroke="var(--color-surface-strong)" strokeWidth="8" />
          <circle
            cx="42" cy="42" r={r} fill="none"
            stroke={theme.isBusiness ? "var(--color-violet)" : "var(--color-rausch)"}
            strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset .6s ease" }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-lg font-extrabold text-ink">{pct}%</span>
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-bold text-ink">Complete your profile</h3>
        <p className="text-xs text-muted mt-0.5 mb-2.5">A complete profile earns more trust and better matches.</p>
        <ul className="space-y-1">
          {items.filter((i) => !i.done).slice(0, 2).map((i) => (
            <li key={i.label}>
              <button onClick={onEdit} className={`inline-flex items-center gap-1.5 text-[12px] font-medium ${theme.accentText} hover:underline`}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
                {i.label}
              </button>
            </li>
          ))}
          {done === items.length && (
            <li className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-green-700">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M5 13l4 4L19 7" /></svg>
              All set — your profile is complete!
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify** — `npx tsc --noEmit` (errors only in `page.tsx` from Task 3 are acceptable until Task 8). Confirm no NEW error mentions `CompletionMeter.tsx`.

- [ ] **Step 3: Commit**

```bash
git add src/components/profile/CompletionMeter.tsx
git commit -m "feat(profile): add CompletionMeter progress ring block"
```

---

### Task 5: VerificationCard block

**Files:**
- Create: `src/components/profile/VerificationCard.tsx`

**Interfaces:**
- Consumes: `Session` from `@/lib/auth`.
- Produces: default export `VerificationCard` with props `{ session: Session; verified: boolean }`. Presentational trust rows + a trust score derived from which items are done.

- [ ] **Step 1: Create the component**

```tsx
// src/components/profile/VerificationCard.tsx
"use client";
import type { Session } from "@/lib/auth";
import { SectionLabel } from "./ui";

interface Row { label: string; done: boolean; hint: string }

export default function VerificationCard({
  session,
  verified,
}: {
  session: Session;
  verified: boolean;
}) {
  const rows: Row[] = [
    { label: "Phone", done: Boolean(session.phone), hint: session.phone ? "Verified" : "Add number" },
    { label: "Email", done: Boolean(session.email), hint: session.email ? "Verified" : "Add email" },
    { label: "Identity (KYC)", done: verified, hint: verified ? "Verified" : "Pending" },
  ];
  const score = Math.round((rows.filter((r) => r.done).length / rows.length) * 100);

  return (
    <div>
      <SectionLabel>Trust &amp; verification</SectionLabel>
      <div className="bg-canvas border border-hairline rounded-[14px] p-4 shadow-3d-soft space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-ink">Trust score</span>
          <span className="text-sm font-extrabold text-ink">{score}%</span>
        </div>
        <div className="h-2 rounded-full bg-surface-strong overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500" style={{ width: `${score}%` }} />
        </div>
        <ul className="pt-1 space-y-2">
          {rows.map((r) => (
            <li key={r.label} className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[13px] text-body">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center ${r.done ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                  {r.done ? (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true"><path d="M5 13l4 4L19 7" /></svg>
                  ) : (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true"><path d="M12 8v5m0 3h.01" /></svg>
                  )}
                </span>
                {r.label}
              </span>
              <span className={`text-[11px] font-semibold ${r.done ? "text-green-700" : "text-amber-700"}`}>{r.hint}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify** — `npx tsc --noEmit` (only pre-existing `page.tsx` errors). No new errors in `VerificationCard.tsx`.

- [ ] **Step 3: Commit**

```bash
git add src/components/profile/VerificationCard.tsx
git commit -m "feat(profile): add VerificationCard trust block"
```

---

### Task 6: ActivityTimeline block

**Files:**
- Create: `src/components/profile/ActivityTimeline.tsx`

**Interfaces:**
- Consumes: `SectionLabel`, `EmptyState` from `./ui`.
- Produces: default export `ActivityTimeline` with props
  ```ts
  { items: ActivityItem[] }
  // where
  interface ActivityItem { id: string; kind: "saved" | "visit" | "search"; text: string; time: string }
  ```
  `page.tsx` (Task 8) builds `items` from already-fetched saved nests / visits.

- [ ] **Step 1: Create the component**

```tsx
// src/components/profile/ActivityTimeline.tsx
"use client";
import { SectionLabel, EmptyState } from "./ui";

export interface ActivityItem {
  id: string;
  kind: "saved" | "visit" | "search";
  text: string;
  time: string;
}

const DOT: Record<ActivityItem["kind"], string> = {
  saved: "bg-rausch",
  visit: "bg-indigo",
  search: "bg-tab-flatmate",
};

export default function ActivityTimeline({ items }: { items: ActivityItem[] }) {
  return (
    <div>
      <SectionLabel>Recent activity</SectionLabel>
      <div className="bg-canvas border border-hairline rounded-[14px] p-4 shadow-3d-soft">
        {items.length === 0 ? (
          <EmptyState
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 8v4l3 3M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            title="No activity yet"
            hint="Your saved nests, visits and searches will appear here as you explore."
            accentText="text-rausch"
            accentBgSoft="bg-rausch/10"
          />
        ) : (
          <ul className="relative pl-5">
            <span className="absolute left-[6px] top-1 bottom-1 w-px bg-hairline" aria-hidden="true" />
            {items.map((it) => (
              <li key={it.id} className="relative pb-4 last:pb-0">
                <span className={`absolute -left-[13px] top-1 w-2.5 h-2.5 rounded-full ${DOT[it.kind]} ring-2 ring-canvas`} aria-hidden="true" />
                <p className="text-[13px] text-body leading-snug">{it.text}</p>
                <p className="text-[11px] text-muted mt-0.5">{it.time}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify** — `npx tsc --noEmit` (only pre-existing `page.tsx` errors). No new errors in `ActivityTimeline.tsx`.

- [ ] **Step 3: Commit**

```bash
git add src/components/profile/ActivityTimeline.tsx
git commit -m "feat(profile): add ActivityTimeline block"
```

---

### Task 7: SavedSearchesCard block

**Files:**
- Create: `src/components/profile/SavedSearchesCard.tsx`

**Interfaces:**
- Consumes: `SectionLabel`, `EmptyState` from `./ui`.
- Produces: default export `SavedSearchesCard` with props `{ variant: "personal" | "business" }`. Manages local alert-toggle state; starts with an empty state (no persisted saved searches exist yet).

- [ ] **Step 1: Create the component**

```tsx
// src/components/profile/SavedSearchesCard.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { SectionLabel, EmptyState } from "./ui";

interface SavedSearch { id: string; query: string; newMatches: number; alerts: boolean }

export default function SavedSearchesCard({ variant }: { variant: "personal" | "business" }) {
  // No persisted saved searches yet — starts empty. Local state is ready for
  // when a source is wired later without changing this component's shape.
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const label = variant === "business" ? "Lead alerts" : "Saved searches";
  const cta = variant === "business" ? "Set up lead alerts" : "Save a search";
  const href = variant === "business" ? "/explore" : "/explore";

  const toggle = (id: string) =>
    setSearches((prev) => prev.map((s) => (s.id === id ? { ...s, alerts: !s.alerts } : s)));

  return (
    <div>
      <SectionLabel>{label}</SectionLabel>
      <div className="bg-canvas border border-hairline rounded-[14px] p-4 shadow-3d-soft">
        {searches.length === 0 ? (
          <EmptyState
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>}
            title={variant === "business" ? "No lead alerts yet" : "No saved searches yet"}
            hint={variant === "business" ? "Get notified when a seeker matches your listings." : "Save a search to get alerts when new matches appear."}
            cta={cta}
            ctaHref={href}
            accentText="text-rausch"
            accentBgSoft="bg-rausch/10"
          />
        ) : (
          <ul className="space-y-2.5">
            {searches.map((s) => (
              <li key={s.id} className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <Link href={href} className="text-[13px] font-semibold text-ink truncate hover:text-rausch block">{s.query}</Link>
                  {s.newMatches > 0 && (
                    <span className="text-[11px] font-semibold text-rausch">{s.newMatches} new match{s.newMatches > 1 ? "es" : ""}</span>
                  )}
                </div>
                <button
                  role="switch"
                  aria-checked={s.alerts}
                  aria-label={`Alerts for ${s.query}`}
                  onClick={() => toggle(s.id)}
                  className={`relative w-9 h-5 rounded-full transition-colors ${s.alerts ? "bg-rausch" : "bg-surface-strong"}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${s.alerts ? "left-[18px]" : "left-0.5"}`} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify** — `npx tsc --noEmit` (only pre-existing `page.tsx` errors). No new errors in `SavedSearchesCard.tsx`.

- [ ] **Step 3: Commit**

```bash
git add src/components/profile/SavedSearchesCard.tsx
git commit -m "feat(profile): add SavedSearchesCard block"
```

---

### Task 8: Restructure the profile page into the hybrid layout

**Files:**
- Modify: `src/app/profile/page.tsx`
- Modify: `src/components/profile/StatGrid.tsx` (theme-aware accent)

**Interfaces:**
- Consumes: all components from Tasks 1–7; `switchProfileMode`, `enableRole`, `signOut`, `type Role` from `@/lib/auth`.
- Produces: the final page. Removes the old inline promo/upgrade banners and the old segment header's dependence on the removed `onSwitchMode` prop.

- [ ] **Step 1: Make StatGrid theme-aware**

In `src/components/profile/StatGrid.tsx`, change the value line so the accent follows the active mode. Replace the component body's map with:

```tsx
import type { Stat } from "./profileData";

export default function StatGrid({ stats, accentText = "text-rausch" }: { stats: Stat[]; accentText?: string }) {
  return (
    <section aria-label="Your activity" className="grid grid-cols-3 gap-3 animate-fade-up">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-canvas border border-hairline rounded-[14px] p-3 md:p-4 text-center hover-lift hover:shadow-airbnb"
        >
          <p className={`text-2xl font-bold ${accentText}`}>{stat.value}</p>
          <p className="text-xs text-body font-medium mt-0.5">{stat.label}</p>
          <p className="text-[11px] text-muted mt-0.5 hidden sm:block">{stat.sub}</p>
        </div>
      ))}
    </section>
  );
}
```

- [ ] **Step 2: Rewrite the profile page**

Replace `src/app/profile/page.tsx` with:

```tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import { signOut, switchProfileMode, enableRole, type Role } from "@/lib/auth";
import { useHydrated, useSession } from "@/lib/useSession";
import BusinessDashboard from "@/components/profile/BusinessDashboard";
import AccountBlock from "@/components/profile/AccountBlock";
import ApplicationsBlock from "@/components/profile/ApplicationsBlock";
import CandidateBlock from "@/components/profile/CandidateBlock";
import EditProfileModal from "@/components/profile/EditProfileModal";
import ShareProfileModal from "@/components/profile/ShareProfileModal";
import MenuBlock, { type MenuItem } from "@/components/profile/MenuBlock";
import NotificationsBlock from "@/components/profile/NotificationsBlock";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ResumeBlock from "@/components/profile/ResumeBlock";
import StatGrid from "@/components/profile/StatGrid";
import CompletionMeter from "@/components/profile/CompletionMeter";
import VerificationCard from "@/components/profile/VerificationCard";
import ActivityTimeline, { type ActivityItem } from "@/components/profile/ActivityTimeline";
import SavedSearchesCard from "@/components/profile/SavedSearchesCard";
import { SectionSkeleton } from "@/components/profile/ui";
import { profileTheme } from "@/components/profile/theme";
import { PROPERTY_STATS, CAREER_STATS, type SavedNest } from "@/components/profile/profileData";
import { apiClient } from "@/lib/apiClient";
import SavedNestsGrid from "@/components/profile/SavedNestsGrid";
import RequirementsBlock from "@/components/profile/RequirementsBlock";

const NEST_MENU: MenuItem[] = [
  { label: "Saved listings", href: "/explore", icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>) },
  { label: "Scheduled visits", href: "/explore", icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" /></svg>) },
  { label: "Flatmate matches", href: "/c/flatmate", icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>) },
];

const NEXT_MENU: MenuItem[] = [
  { label: "Saved jobs", href: "/jobs", icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21z" /></svg>) },
  { label: "My courses", href: "/jobs#upskill", icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>) },
];

export default function UserProfile() {
  const router = useRouter();
  const session = useSession();
  const hydrated = useHydrated();
  const [editOpen, setEditOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [activeSegment, setActiveSegment] = useState<"property" | "career">("property");
  const [savedNests, setSavedNests] = useState<SavedNest[]>([]);
  const [visitCount, setVisitCount] = useState(0);

  const sessionId = session?.id;
  useEffect(() => {
    if (!sessionId) return;
    apiClient.get("/wishlist").then((res) => {
      if (res.data?.success) {
        setSavedNests(res.data.data.map((l: { id: string; title: string; location: string; price: string; image: string; badge: string; rating: number }) => ({ id: l.id, title: l.title, location: l.location, price: l.price, image: l.image, badge: l.badge, rating: l.rating })));
      }
    }).catch(() => {});
    apiClient.get("/visits/mine").then((res) => {
      if (res.data?.success) {
        setVisitCount(res.data.data.filter((v: { status: string }) => v.status !== "cancelled").length);
      }
    }).catch(() => {});
  }, [sessionId]);

  const hadSession = useRef(false);
  useEffect(() => {
    if (session) { hadSession.current = true; return; }
    if (hydrated && !hadSession.current) router.replace("/login");
  }, [session, hydrated, router]);

  const handleLogout = () => { signOut(); router.push("/"); };

  if (!session) {
    return (
      <PageLayout>
        <div className="pt-8 pb-6" aria-busy="true" aria-label="Loading profile">
          <div className="flex items-center gap-4 mb-6">
            <div className="skeleton w-16 h-16 md:w-20 md:h-20 rounded-full shrink-0" />
            <div className="space-y-2"><div className="skeleton h-5 w-40 rounded-full" /><div className="skeleton h-3.5 w-24 rounded-full" /></div>
          </div>
          <div className="grid grid-cols-3 gap-3">{[0, 1, 2].map((i) => (<div key={i} className="skeleton h-[88px] rounded-[14px]" />))}</div>
          <SectionSkeleton />
          <SectionSkeleton rows={2} />
        </div>
      </PageLayout>
    );
  }

  const verified = false;
  const hasBusinessRole = session.roles?.includes("owner") || session.roles?.includes("agent") || session.roles?.includes("builder");
  const isBusiness = session.activeView === "business";
  const theme = profileTheme(session.activeView);

  const activeStatsDef = activeSegment === "property" ? PROPERTY_STATS : CAREER_STATS;
  const statValues: Record<string, number> = { "Saved nests": savedNests.length, "Visits scheduled": visitCount };
  const stats = activeStatsDef.map((s) => ({ ...s, value: statValues[s.label] ?? 0 }));

  // Build the activity feed from data already fetched.
  const activity: ActivityItem[] = [
    ...savedNests.slice(0, 3).map((n) => ({ id: `saved-${n.id}`, kind: "saved" as const, text: `Saved “${n.title}” in ${n.location}`, time: "Recently" })),
    ...(visitCount > 0 ? [{ id: "visits", kind: "visit" as const, text: `You have ${visitCount} scheduled visit${visitCount > 1 ? "s" : ""}`, time: "Upcoming" }] : []),
  ];

  const handleSwitch = (mode: "personal" | "business") => switchProfileMode(mode);
  const handleActivate = (role: Role) => { enableRole(role); switchProfileMode("business"); };

  return (
    <PageLayout>
      <ProfileHeader
        session={session}
        verified={verified}
        hasBusinessRole={hasBusinessRole}
        onEdit={() => setEditOpen(true)}
        onShare={() => setShareOpen(true)}
        onSwitch={handleSwitch}
        onActivate={handleActivate}
      />

      <div className="max-w-[1080px] mx-auto">
        {/* Top band: stats + completion */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 mb-6">
          <StatGrid stats={stats} accentText={theme.accentText} />
          <div className="lg:w-[380px]"><CompletionMeter session={session} verified={verified} onEdit={() => setEditOpen(true)} /></div>
        </div>

        {isBusiness ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
            <div className="min-w-0"><BusinessDashboard session={session} /></div>
            <aside className="space-y-2">
              <VerificationCard session={session} verified={verified} />
              <SavedSearchesCard variant="business" />
              <NotificationsBlock />
              <AccountBlock />
            </aside>
          </div>
        ) : (
          <>
            {/* Segment selector */}
            <div className="flex border-b border-hairline mb-6 gap-6">
              <button onClick={() => setActiveSegment("property")} className={`pb-3 text-sm font-semibold transition-all relative flex items-center gap-2 ${activeSegment === "property" ? "text-ink font-bold" : "text-muted hover:text-ink"}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
                <span>My Property Hub</span>
                {activeSegment === "property" && <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-rausch rounded-full" />}
              </button>
              <button onClick={() => setActiveSegment("career")} className={`pb-3 text-sm font-semibold transition-all relative flex items-center gap-2 ${activeSegment === "career" ? "text-ink font-bold" : "text-muted hover:text-ink"}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1"><path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <span>My Jobs &amp; Career</span>
                {activeSegment === "career" && <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-rausch rounded-full" />}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
              <div className="min-w-0 space-y-6">
                {activeSegment === "property" ? (
                  <>
                    <SavedNestsGrid nests={savedNests} />
                    <RequirementsBlock userName={session.name} />
                    <ActivityTimeline items={activity} />
                    <MenuBlock title="My Nest" items={NEST_MENU} />
                  </>
                ) : (
                  <>
                    <ResumeBlock initialUploaded={false} />
                    <CandidateBlock />
                    <ApplicationsBlock />
                    <MenuBlock title="My Next" items={NEXT_MENU} />
                  </>
                )}
              </div>
              <aside className="space-y-2">
                <VerificationCard session={session} verified={verified} />
                <SavedSearchesCard variant="personal" />
                <NotificationsBlock />
                <AccountBlock />
              </aside>
            </div>
          </>
        )}

        <button onClick={handleLogout} className="w-full py-2.5 mt-8 mb-8 text-sm font-medium text-error border border-error/40 rounded-[8px] hover:bg-error/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error focus-visible:ring-offset-2">
          Log out
        </button>
      </div>

      {editOpen && <EditProfileModal session={session} onClose={() => setEditOpen(false)} />}
      {shareOpen && <ShareProfileModal session={session} onClose={() => setShareOpen(false)} />}
    </PageLayout>
  );
}
```

- [ ] **Step 3: Full verification**

Run: `npx tsc --noEmit`
Expected: PASS (zero errors — the Task 3 header errors are now resolved).

Run: `npm run lint`
Expected: no new errors/warnings in touched files.

- [ ] **Step 4: Manual visual check**

Run: `npm run dev`, open `/profile` logged in. Confirm:
- Hero morphs warm (Personal) and, after switching, violet (Business); the segmented pill thumb slides.
- A role-less account shows "Activate Business Profile" → three role options → activating switches to Business.
- Top band shows stats + completion ring; ring % changes as fields fill.
- Desktop shows 2 columns (main + side aside); mobile stacks with no horizontal scroll.
- Empty states render for Activity / Saved searches; populated saved nests render.
- No console errors; no layout shift on load.

- [ ] **Step 5: Commit**

```bash
git add src/app/profile/page.tsx src/components/profile/StatGrid.tsx
git commit -m "feat(profile): hybrid 2-column dashboard with new premium blocks"
```

---

## Self-Review

- **Spec coverage:** hero+switch (T2,T3) ✓ · hybrid layout (T8) ✓ · completion meter (T4) ✓ · verification (T5) ✓ · activity timeline (T6) ✓ · saved searches (T7) ✓ · theme per mode (T1, used throughout) ✓ · both views styled (T8 renders blocks in both branches) ✓ · frontend-only, no new endpoints ✓ · a11y switch/ring (T2,T4) ✓ · responsive stacking (T8) ✓.
- **Placeholders:** none — every step has full code.
- **Type consistency:** `profileTheme` fields (`accentText`, `heroGradient`, `ringGradient`, `pillGradient`, `isBusiness`, `accentBgSoft`) used identically across T1/T2/T3/T4/T8. `ProfileHeader` props (`onSwitch`, `onActivate`, `hasBusinessRole`, `verified`) match what `page.tsx` passes in T8. `ActivityItem` shape defined in T6 matches the objects built in T8. `SavedSearchesCard` `variant` prop matches both call sites.
- **Note:** Tasks 3–7 intentionally leave `page.tsx` in a non-compiling state until Task 8; each task's verify step scopes the acceptable errors to `page.tsx` only.
