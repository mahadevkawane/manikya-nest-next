"use client";
import { useState } from "react";
import Link from "next/link";

interface ListingCardProps {
  id: number;
  title: string;
  location: string;
  metroDistance?: string;
  price: string;
  rating: number;
  reviewCount: number;
  badge: string;
  amenities: string[];
}

export default function ListingCard({
  id,
  title,
  location,
  metroDistance,
  price,
  rating,
  reviewCount,
  badge,
  amenities,
}: ListingCardProps) {
  const [saved, setSaved] = useState(false);

  return (
    <Link href={`/listing/${id}`} className="block group">
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-colors" style={{ borderWidth: "0.5px" }}>
        {/* Image placeholder */}
        <div className="relative h-40 bg-[#F1EFE8] flex items-center justify-center">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.2">
            <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2M5 21H3m4-10h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01" />
          </svg>
          {/* Save icon */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSaved(!saved);
            }}
            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white transition-colors"
            aria-label="Save listing"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={saved ? "#1D9E75" : "none"}
              stroke={saved ? "#1D9E75" : "#6B7280"}
              strokeWidth="2"
            >
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          {/* Badge */}
          <span className="absolute top-2 left-2 bg-white text-[10px] font-medium text-gray-600 px-2 py-0.5 rounded-md border border-gray-200" style={{ borderWidth: "0.5px" }}>
            {badge}
          </span>
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="text-sm font-medium text-gray-900 mb-1 group-hover:text-[#1D9E75] transition-colors line-clamp-1">
            {title}
          </h3>
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{location}</span>
            {metroDistance && <span className="text-gray-400">· {metroDistance}</span>}
          </div>

          {/* Amenity pills */}
          <div className="flex flex-wrap gap-1 mb-2">
            {amenities.slice(0, 3).map((a) => (
              <span key={a} className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                {a}
              </span>
            ))}
          </div>

          {/* Price & Rating */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[#1D9E75]">{price}</span>
            <div className="flex items-center gap-0.5 text-xs text-gray-500">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#FBBF24" stroke="#FBBF24" strokeWidth="1">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span>{rating}</span>
              <span className="text-gray-400">({reviewCount})</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
