"use client";
import { useState } from "react";
import Link from "next/link";
import PageLayout from "../../components/PageLayout";

const amenities = [
  { label: "Wi-Fi", icon: "📶" },
  { label: "AC", icon: "❄️" },
  { label: "Meals", icon: "🍽️" },
  { label: "Laundry", icon: "👕" },
  { label: "Security", icon: "🔒" },
  { label: "Parking", icon: "🅿️" },
  { label: "Power backup", icon: "⚡" },
  { label: "Hot water", icon: "🚿" },
];

const nearbyPlaces = [
  { name: "Koramangala Metro", type: "Transit", dist: "800 m", icon: "🚇" },
  { name: "Forum Mall", type: "Shopping", dist: "1.2 km", icon: "🛍️" },
  { name: "St. John's Hospital", type: "Healthcare", dist: "2.1 km", icon: "🏥" },
  { name: "Cubbon Park", type: "Park", dist: "3.5 km", icon: "🌳" },
];

const areaInsights = [
  { label: "Safety", score: "Very safe", level: 90, icon: "🛡️" },
  { label: "Transport", score: "Excellent", level: 85, icon: "🚌" },
  { label: "Schools", score: "Good", level: 70, icon: "🏫" },
];

const reviews = [
  { name: "Priya M.", date: "May 2026", rating: 5, text: "Clean rooms, tasty home-style meals and the owner is very responsive. Metro is a short walk away." },
  { name: "Sandeep R.", date: "Apr 2026", rating: 4, text: "Great location for techies. Wi-Fi could be faster but overall good value for the price." },
];

function StarIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function ContactCard({ saved, onToggleSave }: { saved: boolean; onToggleSave: () => void }) {
  return (
    <div className="bg-canvas border border-hairline rounded-[14px] p-5 shadow-airbnb">
      {/* Price + rating */}
      <div className="flex items-baseline justify-between mb-4">
        <p className="text-ink">
          <span className="text-2xl font-bold">₹8,500</span>
          <span className="text-sm font-normal text-muted">/mo</span>
        </p>
        <div className="flex items-center gap-1 text-sm text-ink">
          <span className="text-ink"><StarIcon size={13} /></span>
          <span className="font-semibold">4.5</span>
          <span className="text-muted">· 128</span>
        </div>
      </div>

      {/* Owner */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-hairline-soft">
        <div className="w-10 h-10 rounded-full bg-rausch/10 flex items-center justify-center text-sm font-semibold text-rausch shrink-0">
          RK
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-ink truncate">Rajesh Kumar</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="text-rausch shrink-0" aria-hidden="true">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-[11px] text-muted">Verified owner · Responds in ~1 hr</p>
        </div>
      </div>

      {/* Primary action */}
      <button
        type="button"
        className="w-full py-2.5 text-sm font-semibold text-white bg-rausch rounded-[8px] hover:bg-rausch-active active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rausch focus-visible:ring-offset-2"
      >
        Contact owner
      </button>

      {/* Secondary actions */}
      <div className="flex gap-2 mt-2">
        <button
          type="button"
          className="flex-1 py-2 text-sm font-medium text-ink border border-hairline rounded-[8px] hover:bg-surface-soft active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
        >
          Chat
        </button>
        <button
          type="button"
          className="flex-1 py-2 text-sm font-medium text-ink border border-hairline rounded-[8px] hover:bg-surface-soft active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
        >
          Call
        </button>
      </div>

      {/* WhatsApp */}
      <a
        href="https://wa.me/919876543210?text=Hi%2C%20I%27m%20interested%20in%20Green%20Meadows%20PG"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-white bg-[#25D366] rounded-[8px] hover:brightness-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-.609zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
        WhatsApp
      </a>

      {/* Secondary utility row */}
      <div className="flex items-center justify-between mt-3 text-[12px]">
        <button
          type="button"
          onClick={onToggleSave}
          aria-pressed={saved}
          className="inline-flex items-center gap-1.5 text-muted hover:text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink rounded-sm px-1"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className={saved ? "text-rausch" : ""} aria-hidden="true">
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {saved ? "Saved" : "Save"}
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-muted hover:text-error transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error rounded-sm px-1"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M3 21v-4m0 0V5a2 2 0 012-2h6l1 2h7l-3 5 3 5h-8l-1-2H5a2 2 0 00-2 2z" />
          </svg>
          Report
        </button>
      </div>
    </div>
  );
}

export default function ListingDetail() {
  const [saved, setSaved] = useState(false);

  return (
    <PageLayout breadcrumbs={[{ label: "Home", href: "/" }, { label: "Find Nest", href: "/find-nest" }, { label: "Green Meadows PG" }]}>
      {/* Photo Gallery */}
      <section className="mb-5">
        <div className="h-[280px] md:h-[360px] bg-surface-soft rounded-[14px] flex items-center justify-center mb-2 relative">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-muted-soft" aria-hidden="true">
            <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2M5 21H3m4-10h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01" />
          </svg>
          <button
            type="button"
            onClick={() => setSaved(!saved)}
            aria-pressed={saved}
            className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-canvas/90 shadow-airbnb hover:scale-105 active:scale-95 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
            aria-label={saved ? "Remove from saved" : "Save listing"}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className={saved ? "text-rausch" : "text-muted"} aria-hidden="true">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[60px] md:h-[80px] bg-surface-soft rounded-[8px] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-soft" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>
          ))}
        </div>
      </section>

      {/* Two-column: content + sticky contact card */}
      <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-8 lg:items-start">
        {/* Main content */}
        <div>
          {/* Header */}
          <section className="mb-5">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <h1 className="text-2xl font-bold text-ink tracking-tight">Green Meadows PG for Men</h1>
                <p className="text-sm text-muted mt-0.5">Koramangala 4th Block, Bengaluru</p>
              </div>
              <span className="text-2xl font-bold text-ink shrink-0 lg:hidden">
                ₹8,500<span className="text-sm font-normal text-muted">/mo</span>
              </span>
            </div>

            {/* Badge row */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rausch bg-rausch/10 px-2 py-0.5 rounded-full">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Verified
              </span>
              <span className="text-[11px] font-medium text-ink bg-surface-soft px-2 py-0.5 rounded-full">No brokerage</span>
              <span className="text-[11px] font-medium text-muted bg-surface-soft px-2 py-0.5 rounded-full">PG · Triple sharing</span>
              <div className="flex items-center gap-0.5 text-xs text-ink">
                <span className="text-ink"><StarIcon size={12} /></span>
                <span className="font-semibold">4.5</span>
                <span className="text-muted">(128 reviews)</span>
              </div>
            </div>
          </section>

          {/* Amenities */}
          <section className="mb-6 pb-6 border-b border-hairline-soft">
            <h2 className="text-lg font-bold text-ink mb-3">Amenities</h2>
            <div className="grid grid-cols-2 gap-2">
              {amenities.map((a) => (
                <div key={a.label} className="flex items-center gap-2 text-sm text-body py-1.5">
                  <span className="text-base">{a.icon}</span>
                  <span>{a.label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* AI Nest Insight Card */}
          <section className="mb-6">
            <div className="bg-rausch/5 border border-rausch/40 rounded-[14px] p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-rausch" aria-hidden="true">
                  <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3zM5 19l1 3 1-3 3-1-3-1-1-3-1 3-3 1 3 1z" />
                </svg>
                <span className="text-sm font-semibold text-rausch">AI nest insight</span>
              </div>
              <p className="text-sm text-body leading-relaxed mb-2">
                This PG is 12 min from 3 companies hiring for your profile. Metro station is 800m away. 4 flatmate matches found in your network.
              </p>
              <Link href="#" className="text-sm text-rausch font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rausch rounded-sm">
                View matches →
              </Link>
            </div>
          </section>

          {/* Area Insights */}
          <section className="mb-6">
            <h2 className="text-lg font-bold text-ink mb-3">Area insights</h2>
            <div className="grid grid-cols-3 gap-2">
              {areaInsights.map((a) => (
                <div key={a.label} className="bg-surface-soft rounded-[14px] p-3 text-center">
                  <div className="text-xl mb-1">{a.icon}</div>
                  <p className="text-xs font-medium text-ink">{a.label}</p>
                  <p className="text-[11px] text-muted mb-1.5">{a.score}</p>
                  <div className="h-1.5 bg-surface-strong rounded-full overflow-hidden">
                    <div className="h-full bg-rausch rounded-full" style={{ width: `${a.level}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Nearby Places */}
          <section className="mb-6">
            <h2 className="text-lg font-bold text-ink mb-3">What&apos;s nearby</h2>
            <div className="bg-canvas border border-hairline rounded-[14px] divide-y divide-hairline-soft">
              {nearbyPlaces.map((p) => (
                <div key={p.name} className="flex items-center gap-3 px-4 py-3">
                  <span className="text-base">{p.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-ink truncate">{p.name}</p>
                    <p className="text-[11px] text-muted">{p.type}</p>
                  </div>
                  <span className="text-xs text-muted shrink-0">{p.dist}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Reviews & Ratings */}
          <section className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-ink">Reviews</h2>
              <div className="flex items-center gap-1 text-sm text-ink">
                <span className="text-ink"><StarIcon size={14} /></span>
                <span className="font-semibold">4.5</span>
                <span className="text-muted">· 128 reviews</span>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {reviews.map((r) => (
                <div key={r.name} className="bg-canvas border border-hairline rounded-[14px] p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-8 h-8 rounded-full bg-surface-strong flex items-center justify-center text-[11px] font-semibold text-muted">
                      {r.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink leading-tight">{r.name}</p>
                      <p className="text-[11px] text-muted">{r.date}</p>
                    </div>
                    <div className="ml-auto flex gap-0.5 text-ink">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <StarIcon key={i} size={11} />
                      ))}
                    </div>
                  </div>
                  <p className="text-[13px] text-body leading-relaxed">{r.text}</p>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="text-sm text-ink font-medium underline underline-offset-2 mt-3 hover:text-rausch transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink rounded-sm"
            >
              Show all 128 reviews
            </button>
          </section>

          {/* Contact card — inline below lg breakpoint */}
          <section className="mb-24 lg:hidden">
            <ContactCard saved={saved} onToggleSave={() => setSaved(!saved)} />
          </section>
        </div>

        {/* Sticky contact card — desktop */}
        <aside className="hidden lg:block">
          <div className="lg:sticky lg:top-24">
            <ContactCard saved={saved} onToggleSave={() => setSaved(!saved)} />
          </div>
        </aside>
      </div>

      {/* Sticky CTA bar (mobile) */}
      <div className="fixed bottom-14 left-0 right-0 bg-canvas border-t border-hairline px-4 py-3 flex items-center justify-between gap-3 z-40 md:hidden">
        <div>
          <p className="text-ink leading-tight">
            <span className="text-lg font-bold">₹8,500</span>
            <span className="text-xs font-normal text-muted">/mo</span>
          </p>
          <p className="text-[11px] text-muted">Zero brokerage</p>
        </div>
        <button
          type="button"
          className="px-6 py-2.5 text-sm font-semibold text-white bg-rausch rounded-[8px] hover:bg-rausch-active active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rausch focus-visible:ring-offset-2"
        >
          Contact owner
        </button>
      </div>
    </PageLayout>
  );
}
