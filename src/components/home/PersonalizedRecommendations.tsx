"use client";
/**
 * PersonalizedRecommendations banner card section.
 * Renders a premium, aesthetic banner styled in the lime-green/mint palette,
 * showing a feature grid on the left and a generated modern cozy armchair image on the right.
 */
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

const FEATURES = [
  {
    title: "Trusted by thousands",
    desc: "4.8/5 average rating",
    icon: (
      <svg className="w-5 h-5 text-rausch" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ),
  },
  {
    title: "Easy payments",
    desc: "Secure & hassle-free",
    icon: (
      <svg className="w-5 h-5 text-rausch" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
  },
  {
    title: "24/7 Support",
    desc: "We're here to help",
    icon: (
      <svg className="w-5 h-5 text-rausch" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
      </svg>
    ),
  },
];

export default function PersonalizedRecommendations() {
  const reduced = useReducedMotion();

  return (
    <section aria-label="Personalized recommendations" className="relative max-w-[1560px] mx-auto px-4 md:px-8 lg:px-10 py-8">
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[#e7f2f0]/90 border border-[#cfe5e1] rounded-[28px] p-6 md:p-10 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-10 shadow-[0_12px_40px_-15px_rgba(15,23,42,0.08)]"
      >
        {/* Left Side Content */}
        <div className="flex-1 min-w-0">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-rausch bg-rausch-soft rounded-[6px] px-2.5 py-1 mb-3.5 inline-block">
            Tailored For You
          </span>
          <h2 className="text-[24px] md:text-[32px] font-extrabold tracking-tight text-ink leading-tight">
            Personalized recommendations
          </h2>
          <p className="text-sm md:text-base text-muted mt-2 mb-8 font-medium">
            Based on your search & preferences
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
            {FEATURES.map((feat, i) => (
              <div
                key={i}
                className="flex flex-col bg-white/80 backdrop-blur-sm border border-white/60 rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-airbnb hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="w-9 h-9 rounded-xl bg-rausch-soft text-rausch flex items-center justify-center mb-3">
                  {feat.icon}
                </div>
                <h4 className="text-[14px] font-bold text-ink leading-tight">
                  {feat.title}
                </h4>
                <p className="text-[11.5px] text-muted mt-1.5 leading-snug font-medium">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Owner CTA — the highlighted "list your property" option */}
          <div className="mt-5 relative overflow-hidden bg-gradient-to-r from-rausch to-rausch-active rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_10px_30px_-10px_rgba(14,138,106,0.5)]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl"
            />
            <div className="relative min-w-0">
              <p className="text-[15px] md:text-[16px] font-extrabold text-white leading-tight">
                Own a place in Bengaluru?
              </p>
              <p className="text-[12.5px] text-white/85 mt-1 font-medium">
                List it free in under 5 minutes — reach thousands of verified
                renters and deal with them directly.
              </p>
            </div>
            <Link
              href="/post"
              className="relative shrink-0 inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-[13.5px] font-bold text-rausch bg-white rounded-[12px] shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-rausch"
            >
              List your property
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Right Side Art */}
        <div className="relative w-full lg:w-[380px] xl:w-[440px] h-[260px] md:h-[280px] lg:h-[300px] shrink-0 rounded-2xl overflow-hidden shadow-airbnb">
          <Image
            src="/metro.png"
            alt="City Metro"
            fill
            className="object-cover"
          />
        </div>
      </motion.div>
    </section>
  );
}
