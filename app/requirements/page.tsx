"use client";
import { useState } from "react";
import PageLayout from "../components/PageLayout";
import { Role, roleList, getRole, Requirement, REQUIREMENTS } from "../lib/requirements";
import { World, categoriesForWorld } from "../lib/categories";

const labelCls = "text-[13px] font-medium text-ink block mb-1.5";

export default function RequirementsPage() {
  const [requirements, setRequirements] = useState<Requirement[]>(REQUIREMENTS);
  const [role, setRole] = useState<Role>("tenant");
  const [world, setWorld] = useState<World>("residential");
  const [slug, setSlug] = useState("rent");

  // setRequirements is wired up to the form/feed in later tasks.
  void requirements;
  void setRequirements;

  const chooseRole = (r: Role) => {
    setRole(r);
    const w = getRole(r)!.worlds[0];
    setWorld(w);
    setSlug(categoriesForWorld(w)[0].slug);
  };
  const chooseWorld = (w: World) => {
    setWorld(w);
    setSlug(categoriesForWorld(w)[0].slug);
  };

  const roleDef = getRole(role)!;
  const worldCategories = categoriesForWorld(world);
  const showCategory = role !== "agent";

  return (
    <PageLayout breadcrumbs={[{ label: "Home", href: "/" }, { label: "Post a requirement" }]}>
      <section className="max-w-[760px] mx-auto">
        <h1 className="text-[clamp(26px,4vw,40px)] font-bold text-ink tracking-tight mb-2">Post your requirement</h1>
        <p className="text-base text-body mb-6">{roleDef.tagline}</p>

        {/* Role selector */}
        <div role="group" aria-label="Your role" className="flex items-center bg-surface-soft rounded-[8px] p-1 mb-6">
          {roleList().map((rd) => {
            const on = role === rd.role;
            return (
              <button key={rd.role} type="button" onClick={() => chooseRole(rd.role)} aria-pressed={on}
                className={`flex-1 py-2 text-sm font-semibold rounded-[6px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 ${on ? "bg-ink text-white shadow-airbnb" : "text-muted hover:text-ink"}`}>
                {rd.label}
              </button>
            );
          })}
        </div>

        {/* World toggle (hidden for single-world cases) */}
        {roleDef.worlds.length > 1 && (
          <>
            <label className={labelCls}>Property type</label>
            <div role="group" aria-label="Property world" className="inline-flex items-center gap-1 bg-surface-soft border border-hairline-soft rounded-full p-1 mb-5 w-full">
              {roleDef.worlds.map((w) => {
                const on = world === w;
                return (
                  <button key={w} type="button" onClick={() => chooseWorld(w)} aria-pressed={on}
                    className={`flex-1 py-2 text-sm font-semibold rounded-full capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 ${on ? "bg-ink text-white" : "text-muted hover:text-ink"}`}>
                    {w}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* Category chips */}
        {showCategory && (
          <>
            <label className={labelCls}>{role === "seller" ? "What are you selling/renting out?" : "What are you looking for?"}</label>
            <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Category">
              {worldCategories.map((c) => {
                const on = slug === c.slug;
                return (
                  <button key={c.slug} type="button" onClick={() => setSlug(c.slug)} aria-pressed={on}
                    className={`px-3 py-1.5 text-sm font-medium rounded-[8px] border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 ${on ? "bg-rausch text-white border-rausch" : "bg-canvas text-body border-hairline hover:border-ink"}`}>
                    {c.label}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* Form fields injected in Task 3 */}
        <div id="requirement-fields" className="text-sm text-muted">Form fields added in Task 3.</div>
      </section>
    </PageLayout>
  );
}
