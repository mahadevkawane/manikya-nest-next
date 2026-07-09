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
