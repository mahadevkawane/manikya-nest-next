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

export default function ListingDetail() {
  const [saved, setSaved] = useState(false);

  return (
    <PageLayout breadcrumbs={[{ label: "Home", href: "/" }, { label: "Find Nest", href: "/find-nest" }, { label: "Green Meadows PG" }]}>
      {/* Photo Gallery */}
      <section className="mb-4">
        <div className="h-[280px] bg-[#F1EFE8] rounded-xl flex items-center justify-center mb-2 relative">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1">
            <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2M5 21H3m4-10h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01" />
          </svg>
          <button
            onClick={() => setSaved(!saved)}
            className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-white/90"
            aria-label="Save listing"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={saved ? "#1D9E75" : "none"} stroke={saved ? "#1D9E75" : "#6B7280"} strokeWidth="2">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[50px] md:h-[60px] bg-[#F1EFE8] rounded-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#BFBFBF" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>
          ))}
        </div>
      </section>

      {/* Detail Body */}
      <section className="mb-4">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h1 className="text-lg font-medium text-gray-900">Green Meadows PG for Men</h1>
            <p className="text-xs text-gray-500">Koramangala 4th Block, Bengaluru</p>
          </div>
          <span className="text-xl font-semibold text-[#1D9E75]">₹8,500<span className="text-xs font-normal text-gray-400">/mo</span></span>
        </div>

        {/* Badge row */}
        <div className="flex items-center gap-2 mb-3 mt-2">
          <span className="text-[10px] font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded">PG</span>
          <span className="text-[10px] font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded">Triple sharing</span>
          <div className="flex items-center gap-0.5 text-xs text-gray-600">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#FBBF24" stroke="#FBBF24" strokeWidth="1">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="font-medium">4.5</span>
            <span className="text-gray-400">(128 reviews)</span>
          </div>
        </div>

        <hr className="border-gray-200 mb-3" style={{ borderTopWidth: "0.5px" }} />

        {/* Amenities grid */}
        <h2 className="text-sm font-medium text-gray-900 mb-2">Amenities</h2>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {amenities.map((a) => (
            <div key={a.label} className="flex items-center gap-2 text-xs text-gray-600 py-1.5">
              <span className="text-base">{a.icon}</span>
              <span>{a.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* AI Nest Insight Card */}
      <section className="mb-4">
        <div className="bg-[#1D9E75]/5 border border-[#1D9E75]/40 rounded-lg p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2">
              <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3zM5 19l1 3 1-3 3-1-3-1-1-3-1 3-3 1 3 1z" />
            </svg>
            <span className="text-sm font-medium text-[#1D9E75]">AI nest insight</span>
          </div>
          <p className="text-xs text-gray-700 leading-relaxed mb-2">
            This PG is 12 min from 3 companies hiring for your profile. Metro station is 800m away. 4 flatmate matches found in your network.
          </p>
          <Link href="#" className="text-xs text-[#1D9E75] font-medium hover:underline">
            View matches →
          </Link>
        </div>
      </section>

      {/* Owner Contact */}
      <section className="mb-24 md:mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4" style={{ borderWidth: "0.5px" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-[#1D9E75]/10 flex items-center justify-center text-sm font-semibold text-[#1D9E75]">
              RK
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium text-gray-900">Rajesh Kumar</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#1D9E75" stroke="#1D9E75" strokeWidth="0">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-[11px] text-gray-400">Verified owner · Responds in ~1 hr</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 py-2 text-sm font-medium text-[#1D9E75] border border-[#1D9E75] rounded-lg hover:bg-[#1D9E75]/5 transition-colors">
              Chat
            </button>
            <button className="flex-1 py-2 text-sm font-medium text-white bg-[#1D9E75] rounded-lg hover:bg-[#178c68] transition-colors">
              Call
            </button>
          </div>
        </div>
      </section>

      {/* Sticky CTA bar (mobile) */}
      <div
        className="fixed bottom-14 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between z-40 md:hidden"
        style={{ borderTopWidth: "0.5px" }}
      >
        <span className="text-lg font-semibold text-[#1D9E75]">₹8,500<span className="text-xs font-normal text-gray-400">/mo</span></span>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-xs font-medium text-[#1D9E75] border border-[#1D9E75] rounded-lg">
            Chat with owner
          </button>
          <button className="px-4 py-2 text-xs font-medium text-white bg-[#1D9E75] rounded-lg">
            Schedule visit
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
