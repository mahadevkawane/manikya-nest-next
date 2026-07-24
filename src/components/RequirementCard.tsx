"use client";
import { useState } from "react";
import { Requirement, getRole } from "@/lib/requirements";

export default function RequirementCard({ req, onRespond }: { req: Requirement; onRespond: (req: Requirement) => void }) {
  const roleDef = getRole(req.role)!;
  const isAgent = req.role === "agent";
  const isBuyer = req.role === "buyer";
  const [saved, setSaved] = useState(false);

  return (
    <div className="bg-canvas border border-hairline rounded-[16px] p-4 hover-lift hover:shadow-airbnb flex flex-col h-full">
      <div className="flex items-start justify-between gap-2">
        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${isBuyer ? "bg-violet-50 text-violet-700" : "bg-emerald-50 text-emerald-700"}`}>
          {roleDef.label}
        </span>
        <button
          type="button"
          onClick={() => setSaved((s) => !s)}
          aria-label={saved ? "Remove from saved" : "Save requirement"}
          aria-pressed={saved}
          className={`p-1 -m-1 transition-colors ${saved ? "text-ink" : "text-muted-soft hover:text-ink"}`}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div>

      <p className="text-[15px] font-bold text-ink mt-2.5 line-clamp-1">
        {roleDef.intentVerb}{req.bhk ? ` · ${req.bhk}` : ""}
      </p>

      <p className="flex items-center gap-1.5 text-[13px] text-muted mt-1 line-clamp-1">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden="true">
          <path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
        </svg>
        {req.areas.length ? req.areas.join(", ") : req.city} · {req.city}
      </p>

      <p className={`text-[15px] font-bold mt-2 ${isBuyer ? "text-violet-600" : "text-emerald-600"}`}>{req.budgetLabel}</p>

      {req.notes && <p className="text-[13px] text-body mt-2 line-clamp-2">{req.notes}</p>}

      {req.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {req.tags.slice(0, 4).map((t) => (
            <span key={t} className="text-[12px] text-muted bg-surface-soft px-2 py-0.5 rounded-full">{t}</span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-hairline">
        <span className="text-[12px] text-muted">
          {req.postedAt}{!isAgent && req.responseCount > 0 ? ` · ${req.responseCount} responded` : ""}
        </span>
        <button
          type="button"
          onClick={() => onRespond(req)}
          className="inline-flex items-center gap-1.5 text-[13px] font-bold text-ink hover:gap-2.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 rounded-[4px]"
        >
          {isAgent ? "Contact agent" : "Respond"}
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </button>
      </div>
    </div>
  );
}
