"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import ListingCard from "@/components/ListingCard";
import { apiClient } from "@/lib/apiClient";

/** Params the search API understands; anything else in the URL is ignored. */
const API_PARAMS = ["q", "category", "locality", "bhk", "gender", "minPrice", "maxPrice", "sort"];

const CATEGORIES = [
  { value: "", label: "All Categories" },
  { value: "rent", label: "Rent" },
  { value: "buy", label: "Buy" },
  { value: "pg", label: "PG / Hostel" },
  { value: "coliving", label: "Co-living" },
  { value: "commercial-office", label: "Commercial" },
];

const BHK_OPTIONS: Record<string, { value: string; label: string }[]> = {
  default: [
    { value: "", label: "Any Type" },
    { value: "1", label: "1 BHK" },
    { value: "2", label: "2 BHK" },
    { value: "3", label: "3 BHK" },
  ],
  rent: [
    { value: "", label: "Any BHK" },
    { value: "1", label: "1 BHK" },
    { value: "2", label: "2 BHK" },
    { value: "3", label: "3 BHK" },
  ],
  buy: [
    { value: "", label: "Any BHK/Type" },
    { value: "1", label: "1 BHK" },
    { value: "2", label: "2 BHK" },
    { value: "3", label: "3 BHK" },
    { value: "4", label: "4 BHK" },
    { value: "villa", label: "Villa" },
    { value: "plot", label: "Plot" },
  ],
  pg: [
    { value: "", label: "Any Sharing" },
    { value: "single", label: "Single Sharing" },
    { value: "double", label: "Double Sharing" },
    { value: "triple", label: "Triple Sharing" },
  ],
  coliving: [
    { value: "", label: "Any Room" },
    { value: "private", label: "Private Room" },
    { value: "shared", label: "Shared Room" },
    { value: "studio", label: "Studio Flat" },
  ],
  "commercial-office": [
    { value: "", label: "Any Space" },
    { value: "office", label: "Office Space" },
    { value: "coworking", label: "Coworking" },
    { value: "shop", label: "Retail Shop" },
    { value: "warehouse", label: "Warehouse" },
  ],
};

const GENDERS = [
  { value: "", label: "Any Gender" },
  { value: "boys", label: "For Boys" },
  { value: "girls", label: "For Girls" },
  { value: "anyone", label: "Co-ed" },
];

const BUDGETS_BY_CATEGORY: Record<string, { value: string; label: string }[]> = {
  default: [
    { value: "", label: "Any Budget" },
    { value: "15000", label: "Under ₹15,000" },
    { value: "25000", label: "Under ₹25,000" },
    { value: "50000", label: "Under ₹50,000" },
  ],
  rent: [
    { value: "", label: "Any Budget" },
    { value: "15000", label: "Under ₹15,000" },
    { value: "25000", label: "Under ₹25,000" },
    { value: "50000", label: "Under ₹50,000" },
    { value: "120000", label: "Under ₹1.20 L" },
  ],
  buy: [
    { value: "", label: "Any Budget" },
    { value: "5000000", label: "Under ₹50 L" },
    { value: "10000000", label: "Under ₹1 Cr" },
    { value: "20000000", label: "Under ₹2 Cr" },
    { value: "50000000", label: "Under ₹5 Cr" },
  ],
  pg: [
    { value: "", label: "Any Budget" },
    { value: "5000", label: "Under ₹5,000" },
    { value: "8000", label: "Under ₹8,000" },
    { value: "12000", label: "Under ₹12,000" },
    { value: "18000", label: "Under ₹18,000" },
  ],
  coliving: [
    { value: "", label: "Any Budget" },
    { value: "10000", label: "Under ₹10,000" },
    { value: "15000", label: "Under ₹15,000" },
    { value: "22000", label: "Under ₹22,000" },
    { value: "30000", label: "Under ₹30,000" },
  ],
  "commercial-office": [
    { value: "", label: "Any Budget" },
    { value: "25000", label: "Under ₹25,000" },
    { value: "50000", label: "Under ₹50,000" },
    { value: "150000", label: "Under ₹1.50 L" },
    { value: "500000", label: "Under ₹5.00 L" },
  ],
};

const SORT_OPTIONS = [
  { value: "", label: "Sort: Default" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Rating: High to Low" },
];

const GENDER_LABEL: Record<string, string> = {
  boys: "For boys",
  girls: "For girls",
  anyone: "Co-ed",
};

const CATEGORY_LABEL: Record<string, string> = {
  pg: "PG / Hostel",
  rent: "Rental",
  buy: "For sale",
  coliving: "Co-living",
  "commercial-office": "Office",
  "commercial-shop": "Shop",
  coworking: "Co-working",
  warehouse: "Warehouse",
  land: "Land / Plot",
  lease: "Lease",
  hotel: "Hotel",
  resort: "Resort",
  homestay: "Homestay",
  "service-apartment": "Service apartment",
};

const inr = (v: string) => `₹${Number(v).toLocaleString("en-IN")}`;

function SearchResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const bhk = searchParams.get("bhk") || "";
  const gender = searchParams.get("gender") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const sort = searchParams.get("sort") || "";

  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update query params in the URL to trigger auto-fetch
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Reset specific dependent options on category switch
    if (key === "category") {
      params.delete("bhk");
      params.delete("maxPrice");
    }
    router.replace(`/search?${params.toString()}`);
  };

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Build the query string to pass to the API
    const params = new URLSearchParams();
    for (const key of API_PARAMS) {
      const val = searchParams.get(key);
      if (val && val.trim()) params.set(key, val.trim());
    }

    // Determine the route: if we have a free text search 'q', hit '/search', else hit '/listings'
    const endpoint = searchParams.has("q") ? "/search" : "/listings";

    apiClient
      .get(`${endpoint}?${params.toString()}`)
      .then((res) => {
        if (res.data && res.data.success) {
          setListings(res.data.data);
        } else {
          setError(res.data.error || "Failed to search listings.");
        }
      })
      .catch((err) => {
        console.error("Error searching listings:", err);
        setError(
          err?.response?.data?.error || "Unable to connect to search service."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchParams]);

  // Human-readable summary of the active filters.
  const activeFilters: string[] = [];
  if (category) activeFilters.push(CATEGORY_LABEL[category] ?? category);
  if (bhk) activeFilters.push(`${bhk} BHK`);
  if (gender) activeFilters.push(GENDER_LABEL[gender] ?? gender);
  if (maxPrice) activeFilters.push(`under ${inr(maxPrice)}`);

  const activeBhkOptions = BHK_OPTIONS[category] || BHK_OPTIONS.default;
  const activeBudgetOptions = BUDGETS_BY_CATEGORY[category] || BUDGETS_BY_CATEGORY.default;

  return (
    <PageLayout breadcrumbs={[{ label: "Home", href: "/" }, { label: "Search Results" }]}>
      {/* Dynamic Filter Controls Panel — stacks on very narrow phones, two-up
          from ~400px, and one row on desktop */}
      <div className="bg-white border border-neutral-200/80 p-3 sm:p-4 rounded-2xl shadow-sm mb-6 md:mb-8 grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
        {/* Category Select */}
        <div className="flex flex-col">
          <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => updateFilter("category", e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-ink outline-none focus:border-rausch cursor-pointer"
          >
            {CATEGORIES.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* BHK / Property Type Select */}
        <div className="flex flex-col">
          <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">Property Type</label>
          <select
            value={bhk}
            onChange={(e) => updateFilter("bhk", e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-ink outline-none focus:border-rausch cursor-pointer"
          >
            {activeBhkOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Gender Select (relevant for PG & Co-living) */}
        <div className="flex flex-col">
          <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">Gender</label>
          <select
            value={gender}
            onChange={(e) => updateFilter("gender", e.target.value)}
            disabled={category !== "pg" && category !== "coliving"}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-ink outline-none focus:border-rausch cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {GENDERS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Budget Select */}
        <div className="flex flex-col">
          <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">Max Budget</label>
          <select
            value={maxPrice}
            onChange={(e) => updateFilter("maxPrice", e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-ink outline-none focus:border-rausch cursor-pointer"
          >
            {activeBudgetOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Sort Select */}
        <div className="flex flex-col col-span-1 min-[400px]:col-span-2 sm:col-span-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">Sort By</label>
          <select
            value={sort}
            onChange={(e) => updateFilter("sort", e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-ink outline-none focus:border-rausch cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="border-b border-hairline-soft pb-4 mb-6">
        <h1 className="text-xl md:text-2xl font-extrabold text-ink leading-tight">
          Smart Search Results
        </h1>
        <p className="text-sm text-muted mt-1">
          {query ? (
            <>
              Showing results for{" "}
              <span className="font-semibold text-ink">&ldquo;{query}&rdquo;</span>
            </>
          ) : (
            "Showing properties matching your filters"
          )}
        </p>

        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {activeFilters.map((f) => (
              <span
                key={f}
                className="px-2.5 py-1 text-xs font-medium rounded-full border border-hairline-soft bg-surface-soft text-ink"
              >
                {f}
              </span>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6" aria-hidden="true">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="rounded-[14px]">
              <div className="h-44 rounded-[14px] skeleton" />
              <div className="pt-3 space-y-2">
                <div className="h-4 w-2/3 rounded-full skeleton" />
                <div className="h-3 w-1/2 rounded-full skeleton" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12 border border-hairline-soft rounded-[14px] bg-surface-soft animate-fade-up">
          <p className="text-base font-semibold text-error mb-1">Search Error</p>
          <p className="text-sm text-muted mb-4">{error}</p>
        </div>
      ) : listings.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 px-6 border border-hairline-soft rounded-[14px] bg-surface-soft animate-fade-up">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="text-muted-soft mb-3" aria-hidden="true">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-base font-semibold text-ink mb-1">No matching listings found</p>
          <p className="text-sm text-muted">Try using different filters or keywords above.</p>
        </div>
      ) : (
        <div className="animate-fade-up">
          <p className="text-xs text-muted mb-4">
            Found <span className="font-semibold text-ink">{listings.length}</span> matching spaces
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing.id} {...listing} showCta image={listing.image} />
            ))}
          </div>
        </div>
      )}
    </PageLayout>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading search results...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
