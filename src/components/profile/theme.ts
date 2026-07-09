// Single source of truth for the two profile identities. Every profile
// component reads its accent classes from here so Personal (warm rausch) and
// Business (violet/indigo) stay perfectly consistent.

export interface ProfileTheme {
  isBusiness: boolean;
  accentText: string;
  accentBgSoft: string;
  ringGradient: string;
  heroGradient: string;
  pillGradient: string;
}

export function profileTheme(view: "personal" | "business" | undefined): ProfileTheme {
  const isBusiness = view === "business";
  return isBusiness
    ? {
        isBusiness,
        accentText: "text-violet",
        accentBgSoft: "bg-violet/10",
        ringGradient: "from-violet to-indigo",
        heroGradient: "from-violet/15 via-indigo/5 to-transparent",
        pillGradient: "from-violet to-indigo",
      }
    : {
        isBusiness,
        accentText: "text-rausch",
        accentBgSoft: "bg-rausch/10",
        ringGradient: "from-rausch to-tab-rent",
        heroGradient: "from-rausch/15 via-rausch/5 to-transparent",
        pillGradient: "from-rausch to-tab-rent",
      };
}
