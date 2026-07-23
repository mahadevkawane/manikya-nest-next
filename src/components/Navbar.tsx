"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "./Logo";
import { signOut, switchProfileMode } from "@/lib/auth";
import { useHydrated, useSession } from "@/lib/useSession";
import { initialsOf } from "@/lib/roleTheme";
import NotificationBell from "./NotificationBell";

const navLinks = [
  {
    href: "/",
    label: "Home",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="transition-transform group-hover:scale-110" aria-hidden="true">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    )
  },
  {
    href: "/explore",
    label: "Explore",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="transition-transform group-hover:rotate-12 group-hover:scale-110" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </svg>
    )
  },
  {
    href: "/requirements",
    label: "Requirements",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="transition-transform group-hover:scale-110" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    )
  },
  {
    href: "/jobs",
    label: "Jobs",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="transition-transform group-hover:scale-110 group-hover:-rotate-3" aria-hidden="true">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    )
  },
  {
    href: "/funding",
    label: "Funding",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="transition-transform group-hover:scale-110" aria-hidden="true">
        <path d="M6 4h12M6 9h12M6 4a5 5 0 0 1 0 10H6l8 7" />
      </svg>
    )
  },
];

/**
 * Site chrome — clean solid-white bar (mockup style): logo left, icon+label
 * links center with an emerald underline on the active route, and the
 * primary "List your property" CTA + auth actions on the right.
 */
export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // Hydration guard: the store hook returns null on the server and the first
  // client paint, then syncs — so logged-out chrome renders until mounted.
  const session = useSession();
  const hydrated = useHydrated();
  const pathname = usePathname();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the avatar dropdown on outside click / Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const handleLogout = () => {
    signOut();
    setMenuOpen(false);
    setDrawerOpen(false);
    router.push("/");
  };

  const loggedIn = hydrated && session;

  return (
    <>
      <nav
        aria-label="Main"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white shadow-[0_1px_0_rgba(15,23,42,0.06),0_10px_28px_-16px_rgba(15,23,42,0.18)]"
            : pathname === "/"
              ? "bg-transparent border-transparent"
              : "bg-white border-b border-hairline-soft"
        }`}
      >
        <div className="max-w-[1560px] mx-auto flex items-center justify-between gap-4 px-4 md:px-8 lg:px-10 h-16">
          {/* Logo */}
          <Link href="/" aria-label="FindWay home" className="shrink-0">
            <Logo size={32} />
          </Link>

          {/* Center links — icon + label, emerald underline on active */}
          <div className="hidden lg:flex items-center gap-7 h-full">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group relative h-full inline-flex items-center gap-1.5 text-[14.5px] transition-colors ${
                    isActive ? "font-semibold text-ink" : "font-medium text-muted hover:text-ink"
                  }`}
                >
                  <span className={`shrink-0 transition-opacity ${isActive ? "text-rausch opacity-100" : "opacity-70 group-hover:opacity-100"}`}>
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t-full bg-rausch"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right — CTA + auth */}
          <div className="hidden lg:flex items-center gap-2.5">
            <Link
              href="/post"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-[13.5px] font-semibold text-white bg-rausch hover:bg-rausch-active rounded-[12px] shadow-[0_4px_14px_rgba(14,138,106,0.28)] hover:shadow-[0_6px_18px_rgba(14,138,106,0.36)] hover:-translate-y-px active:translate-y-0 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rausch focus-visible:ring-offset-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
                <path d="M12 5v14m-7-7h14" />
              </svg>
              List your property
            </Link>

            {loggedIn && session ? (
              <div className="flex items-center gap-2.5">
                <NotificationBell />
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setMenuOpen((v) => !v)}
                    aria-haspopup="menu"
                    aria-expanded={menuOpen}
                    aria-label="Account menu"
                    className={`flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full border transition-all hover:shadow-airbnb focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rausch focus-visible:ring-offset-2 ${
                      pathname === "/profile" ? "border-rausch ring-1 ring-rausch" : "border-hairline"
                    } text-ink`}
                  >
                    {session.avatarUrl ? (
                      <Image
                        src={session.avatarUrl}
                        alt={session.name}
                        width={30}
                        height={30}
                        className="rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <span
                        className={`w-[30px] h-[30px] rounded-full flex items-center justify-center text-[11px] font-bold ${
                          session.activeView === "business"
                            ? "bg-gradient-to-br from-rausch to-rausch-active text-white"
                            : "bg-rausch-soft text-rausch"
                        }`}
                      >
                        {initialsOf(session.name)}
                      </span>
                    )}
                    <span className="text-[13px] font-medium max-w-[110px] truncate">
                      {session.name.split(" ")[0]}
                    </span>
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      aria-hidden="true"
                      className={`text-muted transition-transform ${menuOpen ? "rotate-180" : ""}`}
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>

                  {menuOpen && (
                    <div
                      role="menu"
                      aria-label="Account"
                      className="absolute right-0 top-full mt-2 w-56 bg-canvas border border-hairline-soft rounded-[14px] shadow-airbnb py-2 animate-fade-up"
                    >
                      <div className="px-4 py-2 border-b border-hairline-soft mb-1">
                        <p className="text-sm font-semibold text-ink truncate">{session.name}</p>
                        <p className="text-[11px] text-muted truncate">
                          {session.email && !session.email.endsWith("@findway.temp")
                            ? session.email
                            : session.phone
                              ? `+91 ${session.phone}`
                              : ""}
                        </p>
                      </div>
                      {!session.roles.includes("admin") && (
                        <Link
                          href="/profile"
                          role="menuitem"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-body hover:bg-surface-soft transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rausch focus-visible:ring-inset"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                            <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Profile
                        </Link>
                      )}
                      {session.roles.includes("admin") && (
                        <Link
                          href="/admin"
                          role="menuitem"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-rausch hover:bg-surface-soft transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rausch focus-visible:ring-inset"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
                          </svg>
                          Admin Panel
                        </Link>
                      )}
                      {!session.roles.includes("admin") && (
                        <button
                          role="menuitem"
                          onClick={() => {
                            switchProfileMode(session.activeView === "business" ? "personal" : "business");
                            setMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-body hover:bg-surface-soft transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rausch focus-visible:ring-inset text-left font-medium"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                            <path d="M8 3 4 7l4 4M4 7h16M16 21l4-4-4-4M20 17H4" />
                          </svg>
                          {session.activeView === "business" ? "Switch to Personal" : "Switch to Business"}
                        </button>
                      )}
                      <button
                        role="menuitem"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-error hover:bg-surface-soft transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rausch focus-visible:ring-inset"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                          <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Log out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2.5 text-[14px] font-medium text-ink rounded-[12px] hover:bg-surface-soft transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/login?mode=signup"
                  className="px-5 py-2.5 text-[14px] font-semibold text-rausch border border-rausch/45 rounded-[12px] hover:bg-rausch-soft transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile: CTA + hamburger */}
          <div className="lg:hidden flex items-center gap-2">
            <Link
              href="/post"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-rausch rounded-[10px] shadow-[0_3px_10px_rgba(14,138,106,0.3)] active:scale-[0.97] transition-all duration-200"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <path d="M12 5v14m-7-7h14" />
              </svg>
              List
            </Link>
            <button
              className="flex flex-col gap-[5px] p-2"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
            >
              <span className="block w-5 h-[2px] rounded-full bg-ink" />
              <span className="block w-5 h-[2px] rounded-full bg-ink" />
              <span className="block w-5 h-[2px] rounded-full bg-ink" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden" onClick={() => setDrawerOpen(false)}>
          <div className="absolute inset-0 bg-black/45" />
          <div
            className="absolute top-0 right-0 w-72 h-full bg-canvas shadow-airbnb animate-slide-in overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-hairline-soft">
              <Logo size={28} />
              <button onClick={() => setDrawerOpen(false)} aria-label="Close menu" className="p-1.5 text-muted rounded-full hover:bg-surface-soft">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Signed-in identity row */}
            {loggedIn && session && (
              <Link
                href="/profile"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-3 px-4 py-3 border-b border-hairline-soft hover:bg-surface-soft transition-colors"
              >
                {session.avatarUrl ? (
                  <Image
                    src={session.avatarUrl}
                    alt={session.name}
                    width={36}
                    height={36}
                    className="rounded-full object-cover shrink-0"
                  />
                ) : (
                  <span
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0 ${
                      session.activeView === "business"
                        ? "bg-gradient-to-br from-rausch to-rausch-active text-white"
                        : "bg-rausch-soft text-rausch"
                    }`}
                  >
                    {initialsOf(session.name)}
                  </span>
                )}
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-ink truncate">{session.name}</span>
                  <span className="block text-[11px] text-muted truncate">
                    {session.email && !session.email.endsWith("@findway.temp")
                      ? session.email
                      : session.phone
                        ? `+91 ${session.phone}`
                        : ""}
                  </span>
                </span>
              </Link>
            )}

            <div className="flex flex-col p-4 gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setDrawerOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[15px] font-medium transition-colors ${
                      isActive ? "bg-rausch-soft text-rausch" : "text-body hover:bg-surface-soft"
                    }`}
                  >
                    <span className={`shrink-0 ${isActive ? "text-rausch" : "text-muted"}`}>{link.icon}</span>
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="flex flex-col gap-2 px-4 mt-2 pb-8">
              <Link
                href="/post"
                onClick={() => setDrawerOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 text-[15px] font-semibold text-white bg-rausch hover:bg-rausch-active rounded-[12px] shadow-[0_4px_14px_rgba(14,138,106,0.28)] active:scale-[0.98] transition-all duration-200"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                  <path d="M12 5v14m-7-7h14" />
                </svg>
                List your property
              </Link>
              {loggedIn ? (
                <>
                  <Link
                    href={session.roles.includes("admin") ? "/admin" : "/profile"}
                    onClick={() => setDrawerOpen(false)}
                    className="w-full py-2.5 text-center text-[15px] font-medium text-ink border border-hairline rounded-[12px] hover:bg-surface-soft transition-colors"
                  >
                    {session.roles.includes("admin") ? "Admin Panel" : "Profile"}
                  </Link>
                  {!session.roles.includes("admin") && (
                    <button
                      onClick={() => {
                        switchProfileMode(session.activeView === "business" ? "personal" : "business");
                        setDrawerOpen(false);
                      }}
                      className="w-full py-2.5 text-center text-[15px] font-semibold text-white bg-gradient-to-r from-rausch to-rausch-active rounded-[12px] hover:opacity-90 transition-opacity"
                    >
                      {session.activeView === "business" ? "Switch to Personal" : "Switch to Business"}
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full py-2.5 text-center text-[15px] font-medium text-error border border-error/40 rounded-[12px] hover:bg-error/5 transition-colors"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setDrawerOpen(false)}
                    className="w-full py-2.5 text-center text-[15px] font-medium text-ink border border-hairline rounded-[12px] hover:bg-surface-soft transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/login?mode=signup"
                    onClick={() => setDrawerOpen(false)}
                    className="w-full py-2.5 text-center text-[15px] font-semibold text-rausch border border-rausch/45 rounded-[12px] hover:bg-rausch-soft transition-colors"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
