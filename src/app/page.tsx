"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ListingCard from "@/components/ListingCard";
import PageLayout from "@/components/PageLayout";
import HeroSearch from "@/components/HeroSearch";
import HowFindWayWorks from "@/components/HowFindWayWorks";
import { apiClient } from "@/lib/apiClient";

const trustPoints = [
  {
    title: "Verified listings",
    sub: "Checked by our team",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Direct deals",
    sub: "Deal direct with owners",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Job-nest mapping",
    sub: "See jobs near your home",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Commute helper",
    sub: "Built-in travel times",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];


const whyCards = [
  {
    title: "Verified listings",
    description: "Every property is verified by our team before going live",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-rausch" aria-hidden="true">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Zero broker fee",
    description: "Connect directly with owners — no middlemen, no extra charges",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-rausch" aria-hidden="true">
        <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Commute match",
    description: "Our AI finds the best housing near your workplace or college",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-rausch" aria-hidden="true">
        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
];

const nextCards = [
  {
    title: "Jobs",
    subtitle: "Find roles near your nest with top companies",
    href: "/jobs#roles",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-rausch" aria-hidden="true">
        <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Upskill",
    subtitle: "Free and paid courses to grow your career",
    href: "/jobs#upskill",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-rausch" aria-hidden="true">
        <path d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
      </svg>
    ),
  },
];

export default function HomePage() {
  const [listings, setListings] = useState<any[]>([]);

  useEffect(() => {
    apiClient.get("/listings")
      .then((res) => {
        if (res.data && res.data.success) {
          setListings(res.data.data.slice(0, 6));
        }
      })
      .catch((err) => {
        console.error("Failed to fetch trending listings:", err);
      });
  }, []);

  return (
    <>
      {/* Hero Section — tabbed Housing.com-style hero with search */}
      <HeroSearch />

      <PageLayout>

      {/* Trust strip — proof points mirroring our core promise */}
      <section aria-label="Why renters trust FindWay" className="mt-10 md:mt-16 mb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-hairline-soft rounded-[14px] overflow-hidden border border-hairline-soft">
          {trustPoints.map((point) => (
            <div key={point.title} className="flex items-start gap-2.5 bg-canvas px-4 py-4 hover:bg-surface-soft hover:scale-[1.01] transition-all duration-300 group cursor-default">
              <span className="text-rausch shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300">{point.icon}</span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink leading-tight group-hover:text-rausch transition-colors duration-300">{point.title}</p>
                <p className="text-xs text-muted mt-0.5">{point.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Listings */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[22px] md:text-[26px] font-bold tracking-tight text-ink">Trending near you</h2>
          <Link href="/explore" className="text-sm text-ink font-medium underline">
            See all
          </Link>
        </div>

        {/* Horizontal scroll on mobile, 3-col grid on desktop or empty state */}
        {listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 bg-canvas border border-hairline border-dashed rounded-[14px] text-center px-4">
            <p className="text-sm font-semibold text-ink">No trending properties yet</p>
            <p className="text-xs text-muted mt-1 max-w-xs">Be the first to list a property and see it featured here.</p>
            <Link href="/post" className="mt-4 bg-rausch hover:bg-rausch/90 text-white font-semibold text-xs px-6 py-2.5 rounded-full shadow-sm transition-all">
              Post a Property
            </Link>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible scrollbar-hide">
            {listings.map((listing) => (
              <div key={listing.id} className="min-w-[260px] md:min-w-0">
                <ListingCard {...listing} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* How FindWay works — story wheel + Our Mission */}
      <HowFindWayWorks />

      {/* Jobs hub teaser */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[22px] md:text-[26px] font-bold tracking-tight text-ink">Grow your career</h2>
          <Link href="/jobs" className="text-sm text-ink font-medium underline">Open Jobs</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nextCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="bg-canvas border border-hairline rounded-[14px] p-5 hover:-translate-y-1 hover:shadow-airbnb hover:border-rausch/30 transition-all duration-300 group"
            >
              <div className="mb-3 group-hover:scale-110 group-hover:text-rausch transition-all duration-300">{card.icon}</div>
              <h3 className="text-base font-semibold text-ink mb-1 group-hover:text-rausch transition-colors duration-300">{card.title}</h3>
              <p className="text-sm text-muted mb-2">{card.subtitle}</p>
              <span className="text-sm text-rausch font-medium flex items-center gap-1">
                Explore <span className="inline-block group-hover:translate-x-1 transition-transform duration-300">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Why FindWay */}
      <section className="mb-10">
        <h2 className="text-[22px] md:text-[26px] font-bold tracking-tight text-ink mb-4">Why FindWay?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {whyCards.map((card) => (
            <div
              key={card.title}
              className="bg-canvas border border-hairline rounded-[14px] p-5 hover:-translate-y-1 hover:shadow-airbnb hover:border-rausch/20 transition-all duration-300 group"
            >
              <div className="mb-2 group-hover:scale-110 transition-transform duration-300">{card.icon}</div>
              <h3 className="text-base font-semibold text-ink mb-1 group-hover:text-rausch transition-colors duration-300">{card.title}</h3>
              <p className="text-sm text-muted">{card.description}</p>
            </div>
          ))}
        </div>
      </section>
    </PageLayout>
    </>
  );
}
