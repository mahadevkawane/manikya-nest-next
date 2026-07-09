"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, useHydrated } from "@/lib/useSession";
import { apiClient } from "@/lib/apiClient";
import PageLayout from "@/components/PageLayout";

interface PendingListing {
  id: string;
  title: string;
  category: string;
  world: string;
  price: string;
  priceValue?: number;
  location: string;
  image: string;
  status: string;
  noBrokerage?: boolean;
  spec?: string;
  area?: string;
  furnishing?: string;
  availableFrom?: string;
  metroDistance?: string;
  amenities?: string[];
  ownerName?: string;
  ownerPhone?: string;
  ownerEmail?: string;
  createdAt?: string;
}

export default function AdminDashboard() {
  const session = useSession();
  const hydrated = useHydrated();
  const router = useRouter();

  const [listings, setListings] = useState<PendingListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"oldest" | "newest" | "price_desc" | "price_asc">("oldest");

  // Enforce admin-only access control
  useEffect(() => {
    if (hydrated) {
      if (!session || !session.roles.includes("admin")) {
        router.push("/");
      }
    }
  }, [session, hydrated, router]);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get<{ success: boolean; data: PendingListing[] }>("/listings/pending");
      if (res.data && res.data.success) {
        setListings(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch pending listings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session && session.roles.includes("admin")) {
      fetchPending();
    }
  }, [session]);

  const handleReview = async (id: string, action: "approve" | "reject") => {
    try {
      setProcessingId(id);
      const res = await apiClient.patch(`/listings/${id}/review`, { action });
      if (res.data && res.data.success) {
        // Remove processed listing from the UI queue
        setListings((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert(`Failed to ${action} listing.`);
      }
    } catch (err) {
      console.error(`Error during listing review (${action}):`, err);
      alert("Error processing review request.");
    } finally {
      setProcessingId(null);
    }
  };

  // Client-side priority sorting
  const sortedListings = [...listings].sort((a, b) => {
    if (sortBy === "oldest") {
      return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
    }
    if (sortBy === "newest") {
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    }
    if (sortBy === "price_desc") {
      return (b.priceValue || 0) - (a.priceValue || 0);
    }
    if (sortBy === "price_asc") {
      return (a.priceValue || 0) - (b.priceValue || 0);
    }
    return 0;
  });

  if (!hydrated || !session || !session.roles.includes("admin")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas">
        <div className="animate-pulse flex space-x-2">
          <div className="w-3 h-3 bg-muted rounded-full"></div>
          <div className="w-3 h-3 bg-muted rounded-full"></div>
          <div className="w-3 h-3 bg-muted rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto py-10 px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-hairline pb-6 mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-ink tracking-tight">Admin Approval Panel</h1>
            <p className="text-sm text-muted mt-1">Review, prioritize, and publish pending property listings to the live feed.</p>
          </div>
          <div className="flex items-center gap-3 self-start md:self-auto">
            {/* Priority Sorting Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted whitespace-nowrap">Sort Priority:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-canvas border border-hairline rounded-[8px] px-3 py-1.5 text-xs font-bold text-ink outline-none focus:border-rausch transition-colors cursor-pointer"
              >
                <option value="oldest">Date: Oldest First (Default)</option>
                <option value="newest">Date: Newest First</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="price_asc">Price: Low to High</option>
              </select>
            </div>
            <div className="bg-rausch/10 text-rausch px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap">
              {listings.length} pending review
            </div>
          </div>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-rausch border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm text-muted">Loading pending reviews queue...</p>
          </div>
        ) : listings.length === 0 ? (
          <div className="bg-canvas border border-hairline rounded-[24px] p-12 text-center shadow-3d-soft">
            <span className="inline-flex w-16 h-16 rounded-full bg-emerald/10 text-emerald items-center justify-center mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <h3 className="text-xl font-bold text-ink">All caught up!</h3>
            <p className="text-sm text-muted mt-1 max-w-sm mx-auto">There are no property listings currently awaiting administrator review.</p>
          </div>
        ) : (
          /* Compact Queue List Rows */
          <div className="space-y-4">
            {sortedListings.map((item) => (
              <div 
                key={item.id} 
                className="bg-canvas border border-hairline rounded-[16px] overflow-hidden shadow-3d-soft p-4 flex flex-col md:flex-row md:items-center gap-4 hover:shadow-airbnb hover:-translate-y-0.5 transition-all duration-300"
              >
                {/* Compact Photo */}
                <div className="relative w-full md:w-36 h-28 bg-surface-soft shrink-0 rounded-[12px] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {item.category}
                  </div>
                </div>

                {/* Grid of Details (3 equal columns on desktop) */}
                <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Column 1: Title, Price, Location */}
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[9px] font-bold bg-surface border border-hairline px-1.5 py-0.5 rounded text-muted uppercase tracking-wide">
                        {item.world}
                      </span>
                      {item.noBrokerage && (
                        <span className="bg-rausch/10 text-rausch text-[9px] font-bold px-1.5 py-0.5 rounded">
                          Zero Brokerage
                        </span>
                      )}
                    </div>
                    <p className="text-base font-bold text-ink truncate mt-1.5" title={item.title}>
                      {item.title}
                    </p>
                    <p className="text-lg font-extrabold text-ink">{item.price}</p>
                    <p className="text-[11px] text-muted truncate mt-0.5 flex items-center gap-0.5">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a8 8 0 00-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 00-8-8z"/><circle cx="12" cy="10" r="3"/></svg>
                      {item.location}
                    </p>
                  </div>

                  {/* Column 2: Specs, Area, transit, Amenities */}
                  <div className="text-xs space-y-1">
                    <div>
                      <span className="text-muted">Spec:</span> <span className="font-semibold text-ink">{item.spec || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-muted">Area:</span> <span className="font-semibold text-ink">{item.area || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-muted">Furnish:</span> <span className="font-semibold text-ink">{item.furnishing || "N/A"}</span>
                    </div>
                    {item.metroDistance && (
                      <div className="text-[11px] text-muted truncate flex items-center gap-0.5 pt-0.5">
                        <span>🚇</span> <span>{item.metroDistance}</span>
                      </div>
                    )}
                  </div>

                  {/* Column 3: Lister Contact Context */}
                  <div className="bg-rausch/5 border border-rausch/10 rounded-[10px] p-3 text-[11px] space-y-0.5">
                    <p className="font-bold text-rausch uppercase tracking-wider text-[8px] mb-1">Lister Context</p>
                    <div className="truncate">
                      <span className="text-muted">By:</span> <span className="font-bold text-ink">{item.ownerName || "Unknown"}</span>
                    </div>
                    {item.ownerPhone && (
                      <div>
                        <span className="text-muted">Phone:</span> <span className="font-semibold text-ink">+91 {item.ownerPhone}</span>
                      </div>
                    )}
                    {item.createdAt && (
                      <div className="text-[10px] text-muted border-t border-rausch/10 pt-1 mt-1">
                        Posted: {new Date(item.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Row Actions (Right aligned) */}
                <div className="flex md:flex-col gap-2 shrink-0 w-full md:w-36">
                  <button
                    onClick={() => handleReview(item.id, "approve")}
                    disabled={processingId !== null}
                    className="flex-1 h-9 bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold rounded-[8px] transition-colors focus:outline-none disabled:opacity-50"
                  >
                    {processingId === item.id ? "Processing..." : "Accept & Publish"}
                  </button>
                  <button
                    onClick={() => handleReview(item.id, "reject")}
                    disabled={processingId !== null}
                    className="flex-1 h-9 bg-surface border border-hairline hover:bg-surface-soft text-rausch text-xs font-bold rounded-[8px] transition-colors focus:outline-none disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
