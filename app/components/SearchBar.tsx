"use client";
import { useState } from "react";

const budgetOptions = ["Any budget", "Under ₹5k", "₹5k – ₹10k", "₹10k – ₹20k", "₹20k+"];

interface SearchBarProps {
  onSearch?: (location: string, budget: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("Any budget");

  const handleSearch = () => {
    if (onSearch) onSearch(location, budget);
  };

  return (
    <div
      className="w-full bg-white border border-gray-300 rounded-xl flex flex-col md:flex-row items-stretch overflow-hidden"
      style={{ borderWidth: "0.5px" }}
    >
      {/* Location input */}
      <div className="flex items-center gap-2 px-4 py-3 flex-1">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8">
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="City, locality, college or company…"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="flex-1 text-sm text-gray-800 placeholder-gray-400 outline-none bg-transparent"
        />
      </div>

      {/* Divider */}
      <div className="hidden md:block w-[0.5px] bg-gray-300 my-2" />
      <div className="md:hidden h-[0.5px] bg-gray-300 mx-4" />

      {/* Budget dropdown */}
      <div className="flex items-center px-4 py-3 md:min-w-[160px]">
        <select
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="w-full text-sm text-gray-700 outline-none bg-transparent cursor-pointer"
        >
          {budgetOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Divider */}
      <div className="hidden md:block w-[0.5px] bg-gray-300 my-2" />
      <div className="md:hidden h-[0.5px] bg-gray-300 mx-4" />

      {/* Search button */}
      <button
        onClick={handleSearch}
        className="bg-[#1D9E75] text-white text-sm font-medium px-6 py-3 md:py-0 md:rounded-none hover:bg-[#178c68] transition-colors"
      >
        Search
      </button>
    </div>
  );
}
