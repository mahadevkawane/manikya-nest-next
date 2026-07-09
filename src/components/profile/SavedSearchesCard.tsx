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
