import React from "react";
import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export default function PageLayout({ children, breadcrumbs }: PageLayoutProps) {
  return (
    <main className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-10 pb-20 md:pb-8">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 py-3 text-xs text-gray-400">
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className="text-gray-300">/</span>}
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-gray-600 transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-gray-600">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}
      {children}
    </main>
  );
}
