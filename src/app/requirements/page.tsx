"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import PageLayout from "@/components/PageLayout";
import RequirementCard from "@/components/RequirementCard";
import RespondModal from "@/components/RespondModal";
import { Role, roleList, getRole, Requirement, REQUIREMENTS, fetchRequirementsApi, createRequirementApi, updateRequirementApi } from "@/lib/requirements";
import { World, categoriesForWorld } from "@/lib/categories";

const cities = ["Bengaluru", "Hyderabad", "Chennai", "Mumbai", "Pune", "Delhi NCR", "Kolkata"];
const field = "w-full border border-hairline rounded-[8px] px-3 h-12 text-sm text-ink outline-none focus:border-ink focus:border-2 transition-colors bg-canvas";
const labelCls = "text-[13px] font-medium text-ink block mb-1.5";

type FieldDef = {
  key: string;
  label: string;
  required?: boolean;
  half?: boolean;
} & (
  | { type: "text" | "number" | "date"; placeholder?: string }
  | { type: "select"; options: string[] }
  | { type: "pills"; options: string[] }
);

const bhkTypes = ["1 RK", "1 BHK", "2 BHK", "3 BHK", "4+ BHK"];
const furnishings = ["Fully furnished", "Semi furnished", "Unfurnished"];

/** Small line icon used inside the segmented selectors. */
function SegIcon({ name, className = "w-4 h-4" }: { name: string; className?: string }) {
  const p: Record<string, React.ReactNode> = {
    tenant: <><circle cx="12" cy="7" r="4" /><path d="M5.5 21a6.5 6.5 0 0 1 13 0" /></>,
    buyer: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></>,
    residential: <><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /></>,
    stay: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M9 8h.01M15 8h.01M9 12h.01M15 12h.01M9 16h6" /></>,
    commercial: <><path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M16 9h3a1 1 0 0 1 1 1v11M2 21h20M8 7h2m-2 4h2m-2 4h2" /></>,
    rent: <><circle cx="8" cy="15" r="4" /><path d="M10.85 12.15 20 3m-3 3 2 2m-4 0 2 2" /></>,
    pg: <><path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6M3 14h18M7 10V7" /></>,
    coliving: <><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 5.5a3 3 0 0 1 0 6M21 20a6 6 0 0 0-4-5.6" /></>,
    tag: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></>,
  };
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {p[name] ?? p.tag}
    </svg>
  );
}
/** Map a category slug to the closest available seg icon. */
const catIconName = (slug: string) =>
  slug === "pg" ? "pg" : slug === "coliving" ? "coliving" : slug === "buy" || slug === "rent" ? "rent" : slug.startsWith("commercial") || slug === "coworking" || slug === "warehouse" || slug === "lease" || slug === "land" ? "commercial" : "tag";

function requirementFields(role: Role, slug: string): FieldDef[] {
  if (role === "agent") {
    return [
      { key: "specialities", label: "Specialities", type: "pills", options: ["Residential", "Commercial", "Luxury", "Leasing", "Stay"], required: true },
      { key: "years", label: "Years active", type: "number", placeholder: "e.g. 8", half: true, required: true },
      { key: "inventory", label: "Live properties", type: "number", placeholder: "e.g. 120", half: true, required: true },
      { key: "languages", label: "Languages", type: "text", placeholder: "English, Hindi, Kannada", required: true },
    ];
  }
  if (role === "seller") {
    return [
      { key: "bhk", label: "Configuration", type: "select", options: bhkTypes, required: true },
      { key: "area", label: "Built-up area (sq ft)", type: "number", placeholder: "e.g. 1200", half: true, required: true },
      { key: "howSoon", label: "Sell within", type: "select", options: ["ASAP", "30 days", "60 days", "3 months"], half: true, required: true },
      { key: "openToAgents", label: "Open to agents", type: "pills", options: ["Yes", "No"], required: true },
    ];
  }
  // tenant + buyer
  const isBuy = role === "buyer";
  const fields: FieldDef[] = [];
  if (slug !== "pg" && slug !== "coliving") {
    fields.push({ key: "bhk", label: "BHK type", type: "select", options: bhkTypes, required: true });
  }
  if (isBuy) {
    fields.push({ key: "possession", label: "Possession", type: "pills", options: ["Ready to move", "Under construction", "Any"], required: true });
    fields.push({ key: "loan", label: "Loan needed", type: "pills", options: ["Yes", "No"], required: true });
  } else {
    fields.push({ key: "moveIn", label: "Move-in", type: "select", options: ["Immediate", "Within 2 weeks", "Within 1 month", "Flexible"], half: true, required: true });
    fields.push({ key: "furnishing", label: "Furnishing", type: "select", options: furnishings, half: true, required: true });
    fields.push({ key: "occupancy", label: "Occupancy", type: "pills", options: ["Family", "Bachelors", "Students"], required: true });
  }
  return fields;
}

export default function RequirementsPage() {
  const [requirements, setRequirements] = useState<Requirement[]>(REQUIREMENTS);

  useEffect(() => {
    fetchRequirementsApi().then(setRequirements);
  }, []);

  const [role, setRole] = useState<Role>("tenant");
  const [world, setWorld] = useState<World>("residential");
  const [slug, setSlug] = useState("rent");

  // Category-aware field values
  const [form, setForm] = useState<Record<string, string>>({});
  const set = (k: string, v: string) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrorMsg("");
  };

  // Shared inputs
  const [name, setName] = useState("");
  const [city, setCity] = useState("Bengaluru");
  const [areas, setAreas] = useState<string[]>([]);
  const [areaInput, setAreaInput] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [step, setStep] = useState(1);

  // Feed filters + respond flow
  const [filterRole, setFilterRole] = useState<Role | "all">("all");
  const [respondTarget, setRespondTarget] = useState<Requirement | null>(null);

  // Only tenant/buyer requirements surface here — seller/agent are no longer
  // selectable, so any such items in the data are kept out of the feed too.
  const feed = requirements.filter((r) => (r.role === "tenant" || r.role === "buyer") && (filterRole === "all" || r.role === filterRole));

  const chooseRole = (r: Role) => {
    setRole(r);
    const w = getRole(r)!.worlds[0];
    setWorld(w);
    const filteredCats = categoriesForWorld(w).filter((c) => {
      if (r === "buyer") return c.slug === "buy" || (w === "commercial" && c.slug !== "coworking");
      if (r === "tenant") return c.slug !== "buy" && c.slug !== "land" && c.slug !== "lease";
      return true;
    });
    setSlug(filteredCats[0]?.slug || "");
    setForm({});
    setErrorMsg("");
  };
  const chooseWorld = (w: World) => {
    setWorld(w);
    const filteredCats = categoriesForWorld(w).filter((c) => {
      if (role === "buyer") return c.slug === "buy" || (w === "commercial" && c.slug !== "coworking");
      if (role === "tenant") return c.slug !== "buy" && c.slug !== "land" && c.slug !== "lease";
      return true;
    });
    setSlug(filteredCats[0]?.slug || "");
    setErrorMsg("");
  };

  const addArea = () => {
    const a = areaInput.trim();
    if (a && !areas.includes(a)) setAreas((p) => [...p, a]);
    setAreaInput("");
  };

  const renderField = (f: FieldDef) => {
    if (f.type === "select") {
      return (
        <select value={form[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} className={`${field} ${form[f.key] ? "text-ink" : "text-muted"}`}>
          <option value="">Select</option>
          {f.options.map((o) => (<option key={o} value={o} className="text-ink">{o}</option>))}
        </select>
      );
    }
    if (f.type === "pills") {
      return (
        <div className="flex flex-wrap gap-2">
          {f.options.map((o) => {
            const on = form[f.key] === o;
            return (
              <button key={o} type="button" onClick={() => set(f.key, o)} aria-pressed={on}
                className={`px-4 py-2 text-sm font-medium rounded-[8px] border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 ${on ? "bg-ink text-white border-ink" : "bg-canvas text-body border-hairline hover:border-ink"}`}>
                {o}
              </button>
            );
          })}
        </div>
      );
    }
    return (
      <input type={f.type === "number" ? "text" : f.type} inputMode={f.type === "number" ? "numeric" : undefined}
        value={form[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)}
        placeholder={"placeholder" in f ? f.placeholder : undefined} className={field} />
    );
  };

  const renderFieldGroup = (fields: FieldDef[]) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5">
      {fields.map((f) => (
        <div key={f.key} className={f.half ? "col-span-1" : "col-span-1 sm:col-span-2"}>
          <label className={labelCls}>{f.label}{f.required && <span className="text-[#eab308]"> *</span>}</label>
          {renderField(f)}
        </div>
      ))}
    </div>
  );

  const fmtBudget = (min: string, max: string) => {
    const n = (v: string) => Number(v) || 0;
    const lakh = (v: number) => (v >= 10000000 ? `${(v / 10000000).toFixed(1)} Cr` : v >= 100000 ? `${Math.round(v / 100000)} L` : `${Math.round(v / 1000)}k`);
    if (role === "tenant") return `₹${lakh(n(min))}–${lakh(n(max))}/mo`;
    return `₹${lakh(n(min))}–${lakh(n(max))}`;
  };

  const handleNextStep = () => {
    setErrorMsg("");
    if (step === 1) {
      if (showCategory && !slug) {
        setErrorMsg("Please select a category.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      const fields = requirementFields(role, slug);
      for (const f of fields) {
        if (f.required && !form[f.key]) {
          setErrorMsg(`Please fill in "${f.label}".`);
          return;
        }
      }
      if (role !== "agent") {
        if (!budgetMin || !budgetMax) {
          setErrorMsg("Please provide both minimum and maximum budget.");
          return;
        }
        if (Number(budgetMin) > Number(budgetMax)) {
          setErrorMsg("Minimum budget cannot be higher than maximum budget.");
          return;
        }
      }
      setStep(3);
    }
  };

  const handleSubmit = () => {
    setErrorMsg("");
    if (!name.trim()) {
      setErrorMsg("Please enter your name.");
      return;
    }
    if (areas.length === 0) {
      setErrorMsg("Please add at least one preferred area/locality.");
      return;
    }
    if (!notes.trim()) {
      setErrorMsg("Please provide description details in notes.");
      return;
    }

    const tags = [form.occupancy, form.possession === "Ready to move" ? "Ready to move" : undefined, form.loan === "Yes" ? "Loan needed" : undefined, form.openToAgents === "Yes" ? "Open to agents" : undefined].filter(Boolean) as string[];
    const req: Requirement = {
      id: Date.now(),
      role,
      category: role === "agent" ? undefined : slug,
      name: name.trim(),
      city,
      areas,
      budgetMin: Number(budgetMin) || 0,
      budgetMax: Number(budgetMax) || 0,
      budgetLabel: role === "agent" ? (notes || "Agent profile") : fmtBudget(budgetMin, budgetMax),
      moveIn: form.moveIn,
      bhk: form.bhk,
      furnishing: form.furnishing,
      notes: notes.trim(),
      tags,
      postedAt: "Just now",
      responseCount: 0,
    };
    createRequirementApi(req).then((savedReq) => {
      setRequirements((prev) => [savedReq, ...prev]);
      setSubmitted(true);
      setFilterRole("all");
      setStep(1);
      // Reset inputs
      setName("");
      setForm({});
      setAreas([]);
      setBudgetMin("");
      setBudgetMax("");
      setNotes("");
      if (typeof document !== "undefined") {
        document.getElementById("requirements-feed")?.scrollIntoView({ behavior: "smooth" });
      }
    });
  };

  const roleDef = getRole(role)!;
  const worldCategories = categoriesForWorld(world).filter((c) => {
    if (role === "buyer") return c.slug === "buy" || (world === "commercial" && c.slug !== "coworking");
    if (role === "tenant") return c.slug !== "buy" && c.slug !== "land" && c.slug !== "lease";
    return true;
  });
  const showCategory = role !== "agent";

  return (
    <div className="bg-[#f6f4ef] min-h-screen pt-[64px] md:pt-[80px]">
      <div className="max-w-[1320px] mx-auto px-4 md:px-6 lg:px-10">
        <section
          aria-label="Post your requirement"
          className="relative overflow-hidden w-full py-5 md:py-6 px-5 md:px-10 rounded-[20px]"
          style={{ background: "linear-gradient(115deg,#ece5d7 0%,#f4f0e7 46%,#efe9dc 100%)" }}
        >
          {/* Building photo on the right, dissolving into the cream toward the left */}
          <div className="absolute inset-y-0 right-0 w-1/2 hidden md:block" aria-hidden="true">
            <div
              className="absolute inset-0"
              style={{
                WebkitMaskImage: "linear-gradient(to right, transparent 0%, #000 38%)",
                maskImage: "linear-gradient(to right, transparent 0%, #000 38%)",
              }}
            >
              <Image src="/hero-day.jpg" alt="" fill priority sizes="50vw" className="object-cover object-[60%_45%] photo-enhance" />
            </div>
            {/* soft warm sun glow behind the building */}
            <div className="absolute left-[6%] top-[46%] -translate-y-1/2 w-72 h-72 rounded-full" style={{ background: "radial-gradient(circle, rgba(250,204,21,.5), rgba(250,204,21,0) 70%)" }} />
          </div>

          <div className="relative max-w-[1320px] mx-auto w-full">
            <div className="max-w-[560px]">
              <h1 className="font-extrabold tracking-tight leading-[1.03] text-[clamp(22px,3.5vw,36px)]">
                <span className="block text-ink">Skip the scroll.</span>
                <span className="block text-[#e0a80a]">Let owners find you.</span>
              </h1>

              <p className="mt-1.5 text-[13px] md:text-[14px] text-body max-w-[440px] leading-snug">
                Post what you want to rent, buy or lease — landlords, sellers and verified agents bring matching offers to you.
              </p>

              <button
                type="button"
                onClick={() => document.getElementById("post-form")?.scrollIntoView({ behavior: "smooth", block: "center" })}
                className="mt-3 inline-flex items-center gap-2 h-9 px-4 bg-ink text-white text-xs font-semibold rounded-[10px] hover:bg-black active:scale-[0.98] transition-all shadow-sm"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
                Post your requirement
              </button>
            </div>
          </div>
        </section>
      </div>

      <PageLayout breadcrumbs={[{ label: "Home", href: "/" }, { label: "Post a requirement" }]} className="max-w-[1320px] mx-auto px-4 md:px-6 lg:px-10 pb-4">
        {/* Main split dashboard layout */}
        <div className="max-w-[1320px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5 items-start pb-4">

        {/* Left Column: Post form (Sticky on desktop) */}
        <section id="post-form" className="lg:col-span-5 lg:sticky lg:top-[88px] bg-canvas border border-hairline rounded-[20px] p-3.5 sm:p-4 shadow-sm transition-all">
          <div className="mb-2.5">
            <div className="flex items-center justify-between">
              <h2 className="text-[17px] font-bold text-ink flex items-center gap-2">
                <span className="text-[#eab308] font-extrabold tabular-nums">01</span>
                Create Requirement
              </h2>
              <span className="text-xs font-semibold text-muted bg-surface-soft px-2.5 py-1 rounded-full">
                Step {step} of 3
              </span>
            </div>
            <p className="text-xs text-muted mt-1">Tell owners what you&apos;re looking for</p>
          </div>

          {/* Progress Indicators */}
          <div className="flex items-center gap-2 mb-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className={`h-1 flex-1 rounded-full transition-all duration-300 ${step >= n ? "bg-[#eab308]" : "bg-surface-strong"}`} />
            ))}
          </div>

          {submitted && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium rounded-lg flex items-center gap-2 animate-fade-up" role="status">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-emerald-600 shrink-0">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3" />
              </svg>
              Requirement posted! It is live on the matchboard.
            </div>
          )}

          {errorMsg && (
            <div className="mb-4 p-3 bg-error/5 border border-error/25 text-error text-[11px] rounded-lg">{errorMsg}</div>
          )}

          {step === 1 && (
            <div className="animate-fade-up">
              <div className="mb-3">
                <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">My Profile Role</label>
                <div role="group" aria-label="Your role" className="flex items-center bg-surface-soft rounded-lg p-0.5">
                  {roleList().map((rd) => {
                    const on = role === rd.role;
                    return (
                      <button key={rd.role} type="button" onClick={() => chooseRole(rd.role)} aria-pressed={on}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-[6px] transition-all flex items-center justify-center gap-1.5 ${on ? "bg-white text-ink shadow-sm" : "text-muted hover:text-ink"}`}>
                        <SegIcon name={rd.role} />
                        {rd.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {roleDef.worlds.length > 1 && (
                <div className="mb-3">
                  <label className={labelCls}>Property Type</label>
                  <div role="group" aria-label="Property world" className="flex items-center bg-surface-soft border border-hairline-soft rounded-lg p-0.5">
                    {roleDef.worlds.map((w) => {
                      const on = world === w;
                      return (
                        <button key={w} type="button" onClick={() => chooseWorld(w)} aria-pressed={on}
                          className={`flex-1 py-1.5 text-xs font-bold rounded-[6px] capitalize transition-all ${on ? "bg-ink text-white shadow-sm" : "text-muted hover:text-ink"}`}>
                          {w}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {showCategory && (
                <div className="mb-3">
                  <label className={labelCls}>{role === "seller" ? "Select Category" : "What are you looking for?"}</label>
                  <div className="flex flex-wrap gap-1.5" role="group">
                    {worldCategories.map((c) => {
                      const on = slug === c.slug;
                      return (
                        <button key={c.slug} type="button" onClick={() => { setSlug(c.slug); setErrorMsg(""); }}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg border ${on ? "bg-ink text-white border-ink" : "bg-canvas text-ink border-hairline hover:border-ink"}`}>
                          {c.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-up">
              <div className="mb-4">{renderFieldGroup(requirementFields(role, slug))}</div>
              {role !== "agent" && (
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className={labelCls}>Min Budget (₹)</label>
                    <input inputMode="numeric" value={budgetMin} onChange={(e) => { setBudgetMin(e.target.value); setErrorMsg(""); }} placeholder="Min" className={field} />
                  </div>
                  <div>
                    <label className={labelCls}>Max Budget (₹)</label>
                    <input inputMode="numeric" value={budgetMax} onChange={(e) => { setBudgetMax(e.target.value); setErrorMsg(""); }} placeholder="Max" className={field} />
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-up">
              <div className="mb-4">
                <label className={labelCls}>{role === "agent" ? "Coverage" : "Locations"}</label>
                <div className="flex gap-2 mb-2">
                  <input value={areaInput} onChange={(e) => setAreaInput(e.target.value)} placeholder="e.g. Koramangala" className={field} />
                  <button type="button" onClick={addArea} className="px-3 h-10 border rounded-[8px] text-xs font-bold text-ink">Add</button>
                </div>
              </div>
              <div className="mb-4">
                <label className={labelCls}>Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={field} />
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-hairline-soft">
            {step > 1 && <button type="button" onClick={() => setStep((s) => s - 1)} className="flex-1 h-10 border rounded-lg text-xs font-bold text-ink">Back</button>}
            <button type="button" onClick={step < 3 ? handleNextStep : handleSubmit} className="flex-[2] h-10 bg-ink text-white text-xs font-bold rounded-lg">
              {step < 3 ? "Next" : "Post Requirement"}
            </button>
          </div>
        </section>

        <section id="requirements-feed" className="lg:col-span-7 mt-2 lg:mt-0">
          <div className="bg-canvas border border-hairline rounded-[20px] p-3.5 sm:p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2 pb-3 border-b border-hairline-soft">
              <div>
                <h2 className="text-base font-bold text-ink">Matchboard Feed</h2>
                <p className="text-[11px] text-muted mt-0.5">Showing recent seeker requirements in {city}</p>
              </div>
              <div role="group" aria-label="Filter by role" className="inline-flex items-center gap-1 bg-surface-soft border border-hairline-soft rounded-full p-1">
                {(["all", "tenant", "buyer"] as const).map((r) => {
                  const on = filterRole === r;
                  return (
                    <button key={r} type="button" onClick={() => setFilterRole(r)} aria-pressed={on}
                      className={`px-3.5 py-1 text-xs font-semibold rounded-full capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink ${on ? "bg-ink text-white" : "text-muted hover:text-ink"}`}>
                      {r === "all" ? "All" : roleList().find((x) => x.role === r)!.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {feed.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-16 px-4">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-muted-soft mb-3">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                </svg>
                <p className="text-sm font-semibold text-ink">No requirements found</p>
                <p className="text-xs text-muted mt-1">Try changing the filter or post your own to start matchmaking.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {feed.map((r) => (
                  <div key={r.id} className="animate-fade-up">
                    <RequirementCard req={r} onRespond={setRespondTarget} />
                  </div>
                ))}
              </div>
            )}

            {/* Notify / view-all footer bar */}
            <div className="mt-5 flex items-center justify-between gap-4 flex-wrap bg-surface-soft rounded-[16px] px-4 py-3.5">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 shrink-0 flex items-center justify-center rounded-full bg-canvas border border-hairline text-ink" aria-hidden="true">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></svg>
                </span>
                <span>
                  <span className="block text-[13.5px] font-bold text-ink leading-tight">Get notified for new matches</span>
                  <span className="block text-[11.5px] text-muted mt-0.5">We&apos;ll notify you when owners respond.</span>
                </span>
              </div>
              <button type="button" className="inline-flex items-center gap-1.5 text-[13px] font-bold text-ink hover:gap-2.5 transition-all">
                View all requirements
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </button>
            </div>
          </div>
        </section>
      </div>

      {respondTarget && (
        <RespondModal
          req={respondTarget}
          onClose={() => setRespondTarget(null)}
          onSent={(id) => {
            const target = requirements.find((r) => r.id === id);
            if (target) {
              const updated = { ...target, responseCount: target.responseCount + 1 };
              updateRequirementApi(updated).then((ok) => {
                if (ok) {
                  setRequirements((prev) => prev.map((r) => (r.id === id ? updated : r)));
                }
              });
            }
          }}
        />
      )}
    </PageLayout>
    </div>
  );
}
