"use client";
import { useState } from "react";
/**
 * FindWay homepage. The home section (hero + search + category band, popular
 * rentals with the price-pin map, and the trust feature strip) follows the
 * emerald mockup; the storytelling sections below are unchanged.
 */
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import HowFindWayWorks from "@/components/HowFindWayWorks";
import ReviewsSection from "@/components/ReviewsSection";
import HomeHero from "@/components/home/HomeHero";
import PopularRentals from "@/components/home/PopularRentals";
import PersonalizedRecommendations from "@/components/home/PersonalizedRecommendations";
import { motion } from "framer-motion";

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
    title: "Commute match",
    description: "Our AI finds the best housing near your workplace or college",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-rausch" aria-hidden="true">
        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    title: "Community groups",
    description: "Connect with flatmates, find local events, and build your circle",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-rausch" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zm14 10v-2a4 4 0 00-3-3.87m-4-5.63a4 4 0 110 8" />
      </svg>
    ),
  },
];

export default function HomePage() {
  const [world, setWorld] = useState<"residential" | "commercial" | "stays">("residential");

  return (
    <div className="theme-home bg-[#f8f3e8] w-full min-h-screen">
      {/* Home section — hero, search, category band */}
      <HomeHero activeWorld={world} onWorldChange={setWorld} />

      {/* Popular rentals + map panel */}
      <PopularRentals world={world} />

      {/* Personalized Recommendations Banner */}
      <PersonalizedRecommendations />

      <PageLayout>
        <HowFindWayWorks />
      </PageLayout>

      {/* Rummy Deck Reviews Section */}
      <ReviewsSection />

      <PageLayout>
        {/* Jobs hub teaser */}
        <motion.section
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-[22px] md:text-[28px] font-extrabold tracking-tight text-ink">Grow your career</h2>
              <p className="text-sm text-muted mt-1">Discover opportunities and level up your skills</p>
            </div>
            <Link href="/jobs" className="text-sm font-semibold text-rausch hover:underline flex items-center gap-1 transition-all">
              Open Jobs <span className="text-xs">→</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {nextCards.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="relative bg-canvas border-2 border-hairline rounded-[18px] p-6 hover:-translate-y-1.5 hover:shadow-airbnb hover:border-rausch transition-all duration-300 ease-out group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-muted/10 text-muted rounded-[12px] group-hover:bg-rausch/10 group-hover:text-rausch transition-all duration-300">
                      {card.icon}
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted group-hover:text-rausch transition-colors">
                      {card.title === "Jobs" ? "New Openings" : "Learn"}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-ink mb-1.5 group-hover:text-rausch transition-colors duration-300">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed mb-4">
                    {card.subtitle}
                  </p>
                </div>
                <div className="pt-2 border-t border-hairline group-hover:border-rausch/20 transition-colors duration-300">
                  <span className="text-xs font-semibold text-rausch flex items-center gap-1">
                    Explore {card.title} <span className="inline-block group-hover:translate-x-1.5 transition-transform duration-300">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </motion.section>

        {/* Why FindWay */}
        <motion.section
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <div className="mb-6">
            <h2 className="text-[22px] md:text-[28px] font-extrabold tracking-tight text-ink">Why FindWay?</h2>
            <p className="text-sm text-muted mt-1">What makes us the best platform for your journey</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyCards.map((card) => (
              <div
                key={card.title}
                className="bg-canvas border-2 border-hairline rounded-[18px] p-6 hover:-translate-y-1.5 hover:shadow-airbnb hover:border-rausch/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-muted/10 text-rausch rounded-[12px] mb-4 group-hover:bg-rausch group-hover:text-white transition-all duration-300">
                  {card.icon}
                </div>
                <h3 className="text-base font-bold text-ink mb-1.5 group-hover:text-rausch transition-colors duration-300">{card.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>
        </motion.section>
      </PageLayout>
    </div>
  );
}
