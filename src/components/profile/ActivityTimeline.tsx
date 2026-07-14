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
  search: "bg-slate-400",
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
