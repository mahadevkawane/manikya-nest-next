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
