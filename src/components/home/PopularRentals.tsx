"use client";
/**
 * "Popular rentals in Bengaluru" — a white panel pulled up over the hero's
 * dark foot: three rental cards on the left, the price-pin map on the right.
 * Real listings from the API when available; curated fallbacks otherwise.
 */
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import { apiClient } from "@/lib/apiClient";
import type { RentalPin } from "./RentalsMap";

const RentalsMap = dynamic(() => import("./RentalsMap"), {
  ssr: false,
  loading: () => <div className="w-full h-full rounded-[16px] skeleton" aria-hidden="true" />,
});

interface Rental {
  id: string | number;
  title: string;
  badge: string;
  location: string;
  metro: string;
  bhk: string;
  bath: string;
  area: string;
  price: string;
  image: string;
  verified: boolean;
  lat: number;
  lng: number;
  color: RentalPin["color"];
}

/* Curated fallbacks matching the mockup — shown until the API answers. */
const FALLBACK_RESIDENTIAL: Rental[] = [
  {
    id: "pr-1",
    title: "3 BHK Apartment in Whitefield",
    badge: "Gated Community",
    location: "Whitefield, Bengaluru",
    metro: "500m from metro",
    bhk: "3 BHK",
    bath: "2 Bath",
    area: "1500 sq ft",
    price: "₹32,000",
    image: "/rentals/whitefield-3bhk.jpg",
    verified: true,
    lat: 12.9698,
    lng: 77.75,
    color: "emerald",
  },
  {
    id: "pr-2",
    title: "2 BHK Apartment in HSR Layout",
    badge: "Semi-furnished",
    location: "HSR Layout, Bengaluru",
    metro: "300m from metro",
    bhk: "2 BHK",
    bath: "2 Bath",
    area: "1100 sq ft",
    price: "₹22,000",
    image: "/rentals/hsr-2bhk.jpg",
    verified: true,
    lat: 12.9116,
    lng: 77.6389,
    color: "blue",
  },
  {
    id: "pr-3",
    title: "1 BHK Studio in Koramangala",
    badge: "Fully furnished",
    location: "Koramangala, Bengaluru",
    metro: "200m from metro",
    bhk: "1 BHK",
    bath: "1 Bath",
    area: "650 sq ft",
    price: "₹18,000",
    image: "/rentals/koramangala-1bhk.jpg",
    verified: true,
    lat: 12.9357,
    lng: 77.6241,
    color: "violet",
  },
  {
    id: "pr-4",
    title: "2 BHK Flat near Indiranagar Metro",
    badge: "Fully furnished",
    location: "Indiranagar, Bengaluru",
    metro: "100m from metro",
    bhk: "2 BHK",
    bath: "2 Bath",
    area: "1200 sq ft",
    price: "₹26,000",
    image: "/rentals/hsr-2bhk.jpg",
    verified: true,
    lat: 12.9719,
    lng: 77.6412,
    color: "blue",
  },
  {
    id: "pr-5",
    title: "1 BHK Room in Koramangala",
    badge: "Food Included",
    location: "Koramangala 4th Block, Bengaluru",
    metro: "800m from metro",
    bhk: "1 BHK",
    bath: "1 Bath",
    area: "450 sq ft",
    price: "₹12,500",
    image: "/rentals/koramangala-1bhk.jpg",
    verified: true,
    lat: 12.9345,
    lng: 77.6254,
    color: "emerald",
  },
  {
    id: "pr-6",
    title: "3 BHK Villa on Sarjapur Road",
    badge: "Luxury Living",
    location: "Sarjapur Road, Bengaluru",
    metro: "1.5km from metro",
    bhk: "3 BHK",
    bath: "3 Bath",
    area: "2200 sq ft",
    price: "₹45,000",
    image: "/rentals/whitefield-3bhk.jpg",
    verified: true,
    lat: 12.9184,
    lng: 77.6705,
    color: "violet",
  },
];

const FALLBACK_COMMERCIAL: Rental[] = [
  {
    id: "pr-c1",
    title: "Premium Office Space in Tech Park",
    badge: "Grade A Building",
    location: "Outer Ring Road, Bengaluru",
    metro: "400m from metro",
    bhk: "Office",
    bath: "Pantry",
    area: "3200 sq ft",
    price: "₹1,80,000",
    image: "/rentals/whitefield-3bhk.jpg",
    verified: true,
    lat: 12.9254,
    lng: 77.6845,
    color: "blue",
  },
  {
    id: "pr-c2",
    title: "Sleek Coworking Desk in Indiranagar",
    badge: "High-speed Wi-Fi",
    location: "Indiranagar, Bengaluru",
    metro: "150m from metro",
    bhk: "Coworking",
    bath: "Shared",
    area: "150 sq ft",
    price: "₹8,500",
    image: "/rentals/hsr-2bhk.jpg",
    verified: true,
    lat: 12.9785,
    lng: 77.6432,
    color: "emerald",
  },
  {
    id: "pr-c3",
    title: "Bustling Retail Shop on Brigade Road",
    badge: "High Footfall",
    location: "Brigade Road, Bengaluru",
    metro: "50m from metro",
    bhk: "Shop",
    bath: "1 Bath",
    area: "850 sq ft",
    price: "₹65,000",
    image: "/rentals/koramangala-1bhk.jpg",
    verified: true,
    lat: 12.9734,
    lng: 77.6085,
    color: "violet",
  },
  {
    id: "pr-c4",
    title: "Modern Office Suite in Koramangala",
    badge: "Fully Fitted",
    location: "Koramangala 3rd Block, Bengaluru",
    metro: "1km from metro",
    bhk: "Office",
    bath: "Private",
    area: "1800 sq ft",
    price: "₹95,000",
    image: "/rentals/hsr-2bhk.jpg",
    verified: true,
    lat: 12.9344,
    lng: 77.6202,
    color: "blue",
  },
  {
    id: "pr-c5",
    title: "Spacious Warehouse in Nelamangala",
    badge: "Industrial Hub",
    location: "Nelamangala, Bengaluru",
    metro: "Road access",
    bhk: "Warehouse",
    bath: "N/A",
    area: "12000 sq ft",
    price: "₹2,50,000",
    image: "/rentals/whitefield-3bhk.jpg",
    verified: true,
    lat: 13.0984,
    lng: 77.3875,
    color: "violet",
  },
  {
    id: "pr-c6",
    title: "Boutique Retail Space in Jayanagar",
    badge: "Prime Location",
    location: "Jayanagar 4th Block, Bengaluru",
    metro: "200m from metro",
    bhk: "Shop",
    bath: "Shared",
    area: "600 sq ft",
    price: "₹45,000",
    image: "/rentals/koramangala-1bhk.jpg",
    verified: true,
    lat: 12.9284,
    lng: 77.5875,
    color: "emerald",
  },
];

const FALLBACK_STAYS: Rental[] = [
  {
    id: "pr-s1",
    title: "Cozy Homestay near MG Road",
    badge: "Garden View",
    location: "MG Road, Bengaluru",
    metro: "200m from metro",
    bhk: "Room",
    bath: "1 Bath",
    area: "400 sq ft",
    price: "₹1,800/day",
    image: "/rentals/koramangala-1bhk.jpg",
    verified: true,
    lat: 12.9744,
    lng: 77.6075,
    color: "emerald",
  },
  {
    id: "pr-s2",
    title: "Luxury Entire Villa near Nandi Hills",
    badge: "Private Pool",
    location: "Nandi Hills Road, Bengaluru",
    metro: "Scenic view",
    bhk: "Entire",
    bath: "3 Bath",
    area: "3500 sq ft",
    price: "₹9,500/day",
    image: "/rentals/whitefield-3bhk.jpg",
    verified: true,
    lat: 13.3854,
    lng: 77.6875,
    color: "violet",
  },
  {
    id: "pr-s3",
    title: "Modern Service Apartment in HSR",
    badge: "Daily Housekeeping",
    location: "HSR Layout, Bengaluru",
    metro: "800m from metro",
    bhk: "Room",
    bath: "1 Bath",
    area: "600 sq ft",
    price: "₹2,200/day",
    image: "/rentals/hsr-2bhk.jpg",
    verified: true,
    lat: 12.9125,
    lng: 77.6355,
    color: "blue",
  },
  {
    id: "pr-s4",
    title: "Rustic Farmhouse Homestay",
    badge: "Nature Retreat",
    location: "Bannerghatta Road, Bengaluru",
    metro: "Nature reserve",
    bhk: "Entire",
    bath: "2 Bath",
    area: "2000 sq ft",
    price: "₹6,000/day",
    image: "/rentals/whitefield-3bhk.jpg",
    verified: true,
    lat: 12.8344,
    lng: 77.5802,
    color: "emerald",
  },
  {
    id: "pr-s5",
    title: "Boutique Suite in Indiranagar",
    badge: "Cafe Nearby",
    location: "Indiranagar, Bengaluru",
    metro: "300m from metro",
    bhk: "Room",
    bath: "1 Bath",
    area: "500 sq ft",
    price: "₹3,000/day",
    image: "/rentals/koramangala-1bhk.jpg",
    verified: true,
    lat: 12.9734,
    lng: 77.6485,
    color: "blue",
  },
  {
    id: "pr-s6",
    title: "Cozy Studio near Hebbal Lake",
    badge: "Lake View",
    location: "Hebbal, Bengaluru",
    metro: "500m from metro",
    bhk: "Room",
    bath: "1 Bath",
    area: "350 sq ft",
    price: "₹1,500/day",
    image: "/rentals/hsr-2bhk.jpg",
    verified: true,
    lat: 13.0384,
    lng: 77.5975,
    color: "violet",
  },
];

const PIN_COLORS: RentalPin["color"][] = ["emerald", "blue", "violet"];

/** Best-effort mapping from an API listing row to the card model. */
function fromApi(row: any, i: number, fallbackList: Rental[]): Rental {
  const fb = fallbackList[i % fallbackList.length];
  
  // Format price if returned as raw number
  let formattedPrice = fb.price;
  if (row.price) {
    formattedPrice = typeof row.price === "number" || !isNaN(Number(row.price))
      ? `₹${Number(row.price).toLocaleString("en-IN")}`
      : String(row.price);
  }

  return {
    id: row.id,
    title: row.title ?? fb.title,
    badge: row.badge ?? "Verified home",
    location: row.location ?? "Bengaluru",
    metro: row.metroDistance ?? "Near metro",
    bhk: row.spec ?? fb.bhk,
    bath: fb.bath,
    area: row.area ?? fb.area,
    price: formattedPrice,
    image: row.image || fb.image,
    verified: Boolean(row.verified),
    lat: row.latitude ? Number(row.latitude) : fb.lat,
    lng: row.longitude ? Number(row.longitude) : fb.lng,
    color: PIN_COLORS[i % PIN_COLORS.length],
  };
}

function HeartButton({ title }: { title: string }) {
  const [saved, setSaved] = useState(false);
  return (
    <button
      type="button"
      aria-label={saved ? `Remove ${title} from favourites` : `Save ${title} to favourites`}
      aria-pressed={saved}
      onClick={(e) => {
        e.preventDefault();
        setSaved((v) => !v);
      }}
      className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 backdrop-blur border border-white/60 shadow-sm hover:scale-110 active:scale-95 transition-transform duration-150"
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill={saved ? "#0e8a6a" : "none"}
        stroke={saved ? "#0e8a6a" : "#374151"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" />
      </svg>
    </button>
  );
}

const SPEC_ICONS = {
  bhk: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M10 21v-6h4v6" />
    </svg>
  ),
  bath: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 12h16v2a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-2zM6 12V5a2 2 0 0 1 4 0M8 19l-1 2m10-2 1 2" />
    </svg>
  ),
  area: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M9 4v16M4 9h16" />
    </svg>
  ),
};

export default function PopularRentals({
  world = "residential",
}: {
  world?: "residential" | "commercial" | "stays";
}) {
  const reduced = useReducedMotion();

  const fallbackList =
    world === "commercial"
      ? FALLBACK_COMMERCIAL
      : world === "stays"
      ? FALLBACK_STAYS
      : FALLBACK_RESIDENTIAL;

  const [rentals, setRentals] = useState<Rental[]>(fallbackList);

  useEffect(() => {
    let catQuery = "";
    if (world === "commercial") {
      catQuery = "category=commercial-office";
    } else if (world === "stays") {
      catQuery = "category=homestay";
    } else {
      catQuery = "category=rent";
    }

    apiClient
      .get(`/listings?${catQuery}`)
      .then((res) => {
        const rows = res.data?.success ? res.data.data : null;
        if (Array.isArray(rows) && rows.length > 0) {
          setRentals(rows.slice(0, 6).map((row, i) => fromApi(row, i, fallbackList)));
        } else {
          setRentals(fallbackList);
        }
      })
      .catch(() => {
        setRentals(fallbackList);
      });
  }, [world, fallbackList]);

  const worldTitle =
    world === "commercial"
      ? "commercial spaces"
      : world === "stays"
      ? "stays & homestays"
      : "residential homes";

  const exploreCategory =
    world === "commercial"
      ? "commercial-office"
      : world === "stays"
      ? "homestay"
      : "rent";

  return (
    <section aria-label="Popular properties in Bengaluru" className="relative max-w-[1560px] mx-auto px-4 md:px-8 lg:px-10 mt-10 md:mt-14 pb-4">
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white rounded-[20px] border border-hairline-soft shadow-[0_18px_50px_-20px_rgba(15,23,42,0.25)] p-5 md:p-7"
      >
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 mb-5">
          <h2 className="text-[19px] md:text-[22px] font-bold tracking-tight text-ink">
            Popular {worldTitle} in <span className="text-rausch">Bengaluru</span>
          </h2>
          <Link
            href={`/explore?category=${exploreCategory}`}
            className="inline-flex items-center gap-1 text-[13.5px] font-semibold text-rausch hover:gap-2 transition-all"
          >
            View all
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </Link>
        </div>

        <div className="grid lg:grid-cols-[1.55fr_1fr] gap-5">
          {/* Rental cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {rentals.map((r) => (
              <Link
                key={r.id}
                href={`/listing/${r.id}`}
                className="group flex flex-col bg-white rounded-[16px] border border-hairline-soft overflow-hidden hover:shadow-airbnb hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative h-[150px] overflow-hidden">
                  <Image
                    src={r.image}
                    alt={r.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover photo-enhance transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                  />
                  <span className="absolute top-3 left-3 z-10 text-[9.5px] font-bold uppercase tracking-wider text-white bg-[#123f3c]/75 backdrop-blur-sm rounded-[6px] px-2 py-1">
                    {r.badge}
                  </span>
                  <HeartButton title={r.title} />
                </div>

                <div className="flex flex-col flex-1 p-3.5">
                  <h3 className="text-[13.5px] font-bold text-ink leading-snug group-hover:text-rausch transition-colors line-clamp-2">
                    {r.title}
                  </h3>
                  <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-muted">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden="true">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span className="truncate">{r.location}</span>
                    <span className="text-muted-soft shrink-0">·</span>
                    <span className="shrink-0">{r.metro}</span>
                  </p>

                  <ul className="mt-2.5 flex items-center gap-3 text-[11px] font-medium text-body">
                    <li className="flex items-center gap-1"><span className="text-muted">{SPEC_ICONS.bhk}</span>{r.bhk}</li>
                    <li className="flex items-center gap-1"><span className="text-muted">{SPEC_ICONS.bath}</span>{r.bath}</li>
                    <li className="flex items-center gap-1"><span className="text-muted">{SPEC_ICONS.area}</span>{r.area}</li>
                  </ul>

                  <div className="mt-auto pt-3 flex items-center justify-between">
                    <p className="text-[15.5px] font-bold text-ink">
                      {r.price}
                      <span className="text-[11px] font-medium text-muted"> {world === "stays" ? "/day" : "/mo"}</span>
                    </p>
                    {r.verified && (
                      <span className="text-[9.5px] font-bold uppercase tracking-wider text-rausch bg-rausch-soft rounded-[6px] px-2 py-1">
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Map */}
          <div className="h-[320px] lg:h-auto min-h-[320px] rounded-[16px] overflow-hidden border border-hairline-soft">
            <RentalsMap
              key={world}
              pins={rentals.map((r) => ({
                id: r.id,
                price: r.price,
                title: r.title,
                lat: r.lat,
                lng: r.lng,
                color: r.color,
                location: r.location,
                badge: r.bhk || r.badge || "Popular",
              }))}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
