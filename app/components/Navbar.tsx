"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/find-nest", label: "Find Nest" },
  { href: "/whats-next", label: "What's Next" },
];

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200" style={{ borderBottomWidth: "0.5px" }}>
        <div className="max-w-[1200px] mx-auto flex items-center justify-between px-4 md:px-6 lg:px-10 h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-0 text-xl font-semibold select-none">
            <span className="text-gray-900">Nest</span>
            <span className="text-[#1D9E75]">Next</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm font-medium pb-1 transition-colors ${
                    isActive ? "text-[#1D9E75]" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1D9E75] rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button className="px-4 py-1.5 text-sm font-medium text-[#1D9E75] border border-[#1D9E75] rounded-lg hover:bg-[#1D9E75]/5 transition-colors">
              Log in
            </button>
            <button className="px-4 py-1.5 text-sm font-medium text-white bg-[#1D9E75] rounded-lg hover:bg-[#178c68] transition-colors">
              Sign up
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1 p-2"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <span className="block w-5 h-[2px] bg-gray-700" />
            <span className="block w-5 h-[2px] bg-gray-700" />
            <span className="block w-5 h-[2px] bg-gray-700" />
          </button>
        </div>
      </nav>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[60] md:hidden" onClick={() => setDrawerOpen(false)}>
          <div className="absolute inset-0 bg-black/30" />
          <div
            className="absolute top-0 right-0 w-64 h-full bg-white shadow-lg animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-100" style={{ borderBottomWidth: "0.5px" }}>
              <span className="text-lg font-semibold">
                <span className="text-gray-900">Nest</span>
                <span className="text-[#1D9E75]">Next</span>
              </span>
              <button onClick={() => setDrawerOpen(false)} aria-label="Close menu" className="p-1 text-gray-500">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col p-4 gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setDrawerOpen(false)}
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? "bg-[#1D9E75]/10 text-[#1D9E75]" : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
            <div className="flex flex-col gap-2 px-4 mt-4">
              <button className="w-full py-2 text-sm font-medium text-[#1D9E75] border border-[#1D9E75] rounded-lg">
                Log in
              </button>
              <button className="w-full py-2 text-sm font-medium text-white bg-[#1D9E75] rounded-lg">
                Sign up
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
