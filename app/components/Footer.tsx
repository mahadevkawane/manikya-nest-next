import Link from "next/link";

const aboutLinks = [
  "About us",
  "How it works",
  "Careers",
  "Blog",
  "Contact",
];

const quickLinks = [
  { label: "Find PG/Hostel", href: "/find-nest" },
  { label: "Find Rental Flat", href: "/find-nest" },
  { label: "Jobs & Internships", href: "/whats-next" },
  { label: "Commute Planner", href: "/whats-next" },
  { label: "Upskilling", href: "/whats-next" },
];

const cities = ["Bengaluru", "Mumbai", "Hyderabad", "Pune", "Delhi"];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12 hidden md:block">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-10 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About NestNext */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-4">About NestNext</h3>
            <p className="text-xs leading-relaxed text-gray-400 mb-4">
              NestNext is a platform for students and working professionals in Indian cities.
              Find verified housing with zero broker fee, discover jobs, plan your commute,
              and upskill — all in one place.
            </p>
            <ul className="space-y-2">
              {aboutLinks.map((link) => (
                <li key={link}>
                  <Link href="#" className="text-xs text-gray-400 hover:text-white transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-xs text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cities */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-4">Cities</h3>
            <ul className="space-y-2">
              {cities.map((city) => (
                <li key={city}>
                  <Link href="/find-nest" className="text-xs text-gray-400 hover:text-white transition-colors">
                    {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800" style={{ borderTopWidth: "0.5px" }}>
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-10 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-gray-500">
            © {new Date().getFullYear()} NestNext. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-[11px] text-gray-500 hover:text-gray-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-[11px] text-gray-500 hover:text-gray-300 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
