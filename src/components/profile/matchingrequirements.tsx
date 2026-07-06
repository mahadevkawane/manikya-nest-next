"use client";
import { useEffect, useState } from "react";
import { Requirement, fetchRequirementsApi, updateRequirementApi, matchScore } from "@/lib/requirements";

// Structure matching BusinessDashboard's properties
interface OwnerListing {
  id: string;
  title: string;
  type: string;
  locality: string;
  price: string;
  status: string;
}

interface MatchResult {
  requirement: Requirement;
  score: number;
  matchedListing: OwnerListing;
}

export default function MatchingRequirements({
  ownerName,
  listings,
}: {
  ownerName: string;
  listings: OwnerListing[];
}) {
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [successId, setSuccessId] = useState<number | null>(null);

  useEffect(() => {
    fetchRequirementsApi().then((allReqs) => {
      // 1. Fetch all active posted requirements, excluding the owner's own requirements
      const reqs = allReqs.filter((r) => r.name !== ownerName);

      // Helper to extract numbers from price strings like "₹12,000/mo" or "₹45,000/mo"
      const parsePrice = (priceStr: string): number => {
        return Number(priceStr.replace(/[^\d]/g, "")) || 0;
      };

      // Helper to map property type to category slug
      const mapTypeToCategory = (type: string, title: string): string => {
        const t = type.toLowerCase();
        const ttl = title.toLowerCase();
        if (t.includes("co-living") || t.includes("coliving")) return "coliving";
        if (t.includes("pg") || t.includes("hostel")) return "pg";
        if (t.includes("office") || ttl.includes("office")) return "commercial-office";
        if (t.includes("shop") || ttl.includes("shop")) return "commercial-shop";
        return "rent";
      };

      // Helper to parse BHK from listing title (e.g. "1BHK Rental Flat" -> "1 BHK")
      const parseBHK = (title: string): string | undefined => {
        const m = title.match(/(\d)\s*BHK/i);
        return m ? `${m[1]} BHK` : undefined;
      };

      // 2. Loop through each seeker requirement and find their highest match score against the owner's active properties
      const matchResults: MatchResult[] = [];

      reqs.forEach((req) => {
        let bestScore = 0;
        let bestListing: OwnerListing | null = null;

        listings.forEach((lst) => {
          const category = mapTypeToCategory(lst.type, lst.title);
          const price = parsePrice(lst.price);
          const bhk = parseBHK(lst.title);

          // Derive area from locality (e.g. "HSR Layout, Bengaluru" -> "HSR Layout")
          const area = lst.locality.split(",")[0].trim();

          const score = matchScore(req, {
            category,
            budgetMin: price,
            budgetMax: price,
            areas: [area],
            bhk,
          });

          if (score > bestScore) {
            bestScore = score;
            bestListing = lst;
          }
        });

        // Only include if there's any match score > 0
        if (bestScore > 0 && bestListing) {
          matchResults.push({
            requirement: req,
            score: bestScore,
            matchedListing: bestListing,
          });
        }
      });

      // 3. Sort by score descending
      matchResults.sort((a, b) => b.score - a.score);
      setMatches(matchResults);
    });
  }, [ownerName, listings]);

  const handleRespond = (reqId: number) => {
    const match = matches.find((m) => m.requirement.id === reqId);
    if (match) {
      const updated = { ...match.requirement, responseCount: match.requirement.responseCount + 1 };
      updateRequirementApi(updated).then((ok) => {
        if (ok) {
          // Update local matches state
          setMatches((prev) =>
            prev.map((m) =>
              m.requirement.id === reqId ? { ...m, requirement: updated } : m
            )
          );
        }
      });
    }

    setSuccessId(reqId);
    setTimeout(() => {
      setSuccessId(null);
    }, 4000);
  };

  if (matches.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-hairline rounded-[18px] bg-surface-soft p-8 animate-fade-up">
        <div className="w-12 h-12 rounded-full bg-indigo/10 text-indigo flex items-center justify-center mx-auto mb-4">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
          </svg>
        </div>
        <h3 className="text-base font-bold text-ink mb-1">No matching requirements</h3>
        <p className="text-sm text-muted max-w-[320px] mx-auto">
          We will show active seeker requirements matching your listings here as soon as they are posted.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-up">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-ink flex items-center gap-2">
          <span>Matching Seeker Leads</span>
          <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-semibold">
            {matches.length} matches found
          </span>
        </h3>
        <p className="text-xs text-muted">Based on budget, areas, and configuration</p>
      </div>

      <div className="space-y-3">
        {matches.map(({ requirement, score, matchedListing }) => {
          const isSuccess = successId === requirement.id;
          return (
            <div
              key={requirement.id}
              className="bg-canvas border border-hairline rounded-[16px] p-5 shadow-3d-soft hover:shadow-airbnb hover-lift transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                    {score}% Match
                  </span>
                  <span className="text-[10px] font-medium text-muted bg-surface-soft border border-hairline-soft px-2 py-0.5 rounded-md">
                    Matches: {matchedListing.title}
                  </span>
                  <span className="text-[10px] font-bold text-white bg-ink px-2 py-0.5 rounded-full capitalize">
                    {requirement.role}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-ink text-sm sm:text-base">
                      {requirement.name}
                    </h4>
                    <span className="text-xs text-muted">&middot; {requirement.postedAt}</span>
                  </div>
                  <p className="text-xs text-muted mt-0.5">
                    Looking in: <strong className="text-ink font-semibold">{requirement.areas.join(", ")}</strong> &middot; Budget: <strong className="text-ink font-semibold">{requirement.budgetLabel}</strong>
                  </p>
                  {requirement.notes && (
                    <p className="text-xs text-muted italic mt-1.5 border-l border-hairline pl-2">
                      &ldquo;{requirement.notes}&rdquo;
                    </p>
                  )}
                </div>

                {requirement.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {requirement.tags.map((t) => (
                      <span key={t} className="text-[9px] text-muted bg-surface-soft border border-hairline-soft px-1.5 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-hairline-soft">
                {isSuccess ? (
                  <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded-[8px] animate-pulse">
                    Enquiry Sent &middot; WhatsApp Opened
                  </span>
                ) : (
                  <a
                    href="https://wa.me/919000000000"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => handleRespond(requirement.id)}
                    className="px-3.5 py-2 text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 rounded-[8px] transition-all flex items-center gap-1.5"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.012 2c-5.506 0-9.988 4.482-9.988 9.988 0 1.761.459 3.479 1.332 5.003L2 22l5.176-1.359c1.478.807 3.136 1.233 4.832 1.233 5.506 0 9.992-4.486 9.992-9.988 0-2.66-1.035-5.159-2.915-7.039C17.18 3.03 14.675 2 12.012 2zM8.337 7.747c.218-.009.432-.014.613-.014.18 0 .423.067.644.549.221.482.753 1.834.819 1.97.067.135.111.293.022.473-.089.18-.135.293-.27.451-.135.158-.283.351-.405.473-.122.122-.252.256-.108.503.144.247.64 1.053 1.371 1.704.941.84 1.737 1.1 1.983 1.226.247.126.391.104.536-.063.144-.167.622-.725.789-.973.167-.247.333-.207.563-.122.23.085 1.458.687 1.71 1.218v.002c.078.163.078.694-.144 1.32-.222.626-1.306 1.22-1.802 1.258-.496.038-.988.167-3.13-.676-2.58-1.017-4.22-3.626-4.346-3.793-.126-.167-.991-1.316-.991-2.512.001-1.196.626-1.784.847-2.022z" />
                    </svg>
                    Respond &middot; WhatsApp
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
