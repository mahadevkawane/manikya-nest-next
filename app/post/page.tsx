"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import PageLayout from "../components/PageLayout";
import { World, categoriesForWorld, getCategory } from "../lib/categories";

const cities = ["Bengaluru", "Hyderabad", "Chennai", "Mumbai", "Pune", "Delhi NCR", "Kolkata"];

const benefits = [
  { title: "Zero brokerage", desc: "List free — connect directly with tenants, no middlemen." },
  { title: "Faster tenants", desc: "Verified, ready-to-move seekers reach out within days." },
  { title: "10 lakh+ connections", desc: "Tap into a large pool of tenants and buyers across India." },
];

const ownerPerks = [
  { title: "Privacy", desc: "Your number stays masked" },
  { title: "Promoted listing", desc: "Show up higher in search" },
  { title: "Social marketing", desc: "Promoted across channels" },
  { title: "Price consultation", desc: "Get the right rent advice" },
];

const amenityOptions = ["Wi-Fi", "AC", "Meals", "Laundry", "Security", "Parking", "Power backup", "Hot water", "Gym", "Housekeeping", "Lift", "Gas pipeline"];
const visitDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ─── Wizard step definitions ────────────────────────────────────────────────
const WIZARD_STEPS = [
  { key: "details", label: "Property details" },
  { key: "locality", label: "Locality" },
  { key: "pricing", label: "Pricing" },
  { key: "amenities", label: "Amenities" },
  { key: "gallery", label: "Photos" },
  { key: "schedule", label: "Schedule visits" },
];

const stepIcon = (key: string) => {
  const common = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7 } as const;
  switch (key) {
    case "details":
      return <svg {...common}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><path d="M9 22V12h6v10" /></svg>;
    case "locality":
      return <svg {...common}><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>;
    case "pricing":
      return <svg {...common}><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>;
    case "amenities":
      return <svg {...common}><path d="M20 7h-9M14 17H5M17 17a3 3 0 100-6 3 3 0 000 6zM7 13a3 3 0 100-6 3 3 0 000 6z" /></svg>;
    case "gallery":
      return <svg {...common}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>;
    case "schedule":
      return <svg {...common}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>;
    default:
      return null;
  }
};

// ─── Category-specific field configs ────────────────────────────────────────
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

const bhkTypes = ["1 RK", "1 BHK", "2 BHK", "3 BHK", "4 BHK", "4+ BHK"];
const apartmentTypes = ["Apartment", "Independent House / Villa", "Gated Community Villa", "Standalone Building"];
const floorOptions = ["Ground", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"];
const propertyAges = ["Under construction", "Less than 1 year", "1–3 years", "3–5 years", "5–10 years", "10+ years"];
const facings = ["North", "South", "East", "West", "North-East", "North-West", "South-East", "South-West"];
const furnishings = ["Fully furnished", "Semi furnished", "Unfurnished"];
const commFurnishing = ["Furnished", "Semi furnished", "Bare shell"];

function detailFields(slug: string): FieldDef[] {
  switch (slug) {
    case "pg":
      return [
        { key: "pgName", label: "PG / Hostel name", type: "text", placeholder: "e.g. Green Meadows PG", required: true },
        { key: "totalBeds", label: "Total beds", type: "number", placeholder: "e.g. 24", required: true, half: true },
        { key: "sharing", label: "Sharing", type: "select", options: ["Single", "Double", "Triple", "Four+"], half: true },
        { key: "pgFor", label: "PG is for", type: "pills", options: ["Girls", "Boys", "Anyone"], required: true },
        { key: "suitedFor", label: "Best suited for", type: "pills", options: ["Students", "Professionals", "Both"] },
        { key: "meals", label: "Meals available", type: "pills", options: ["Yes", "No"] },
      ];
    case "coliving":
      return [
        { key: "spaceName", label: "Space name", type: "text", placeholder: "e.g. Sunrise Co-living", required: true },
        { key: "roomType", label: "Room type", type: "select", options: ["Single room", "Twin sharing", "Studio"], required: true, half: true },
        { key: "furnishing", label: "Furnishing", type: "select", options: furnishings, half: true },
        { key: "suitedFor", label: "Best suited for", type: "pills", options: ["Students", "Professionals", "Both"] },
        { key: "meals", label: "Meals available", type: "pills", options: ["Yes", "No"] },
      ];
    case "commercial-office":
    case "coworking":
    case "lease":
      return [
        { key: "area", label: "Built-up area (sq ft)", type: "number", placeholder: "e.g. 3200", required: true, half: true },
        { key: "seats", label: "Seats / workstations", type: "number", placeholder: "e.g. 45", half: true },
        { key: "floor", label: "Floor", type: "select", options: floorOptions, half: true },
        { key: "totalFloors", label: "Total floors", type: "select", options: floorOptions, half: true },
        { key: "furnishing", label: "Furnishing", type: "select", options: commFurnishing, required: true },
        { key: "washrooms", label: "Washrooms", type: "pills", options: ["Private", "Shared"] },
      ];
    case "commercial-shop":
      return [
        { key: "area", label: "Built-up area (sq ft)", type: "number", placeholder: "e.g. 1800", required: true, half: true },
        { key: "frontage", label: "Frontage (ft)", type: "number", placeholder: "e.g. 20", half: true },
        { key: "floor", label: "Floor", type: "select", options: floorOptions, half: true },
        { key: "locationType", label: "Location", type: "pills", options: ["High street", "Mall", "Standalone"] },
        { key: "washroom", label: "Washroom", type: "pills", options: ["Yes", "No"] },
      ];
    case "warehouse":
      return [
        { key: "area", label: "Built-up area (sq ft)", type: "number", placeholder: "e.g. 18000", required: true, half: true },
        { key: "ceiling", label: "Ceiling height (ft)", type: "number", placeholder: "e.g. 24", half: true },
        { key: "docks", label: "Loading docks", type: "number", placeholder: "e.g. 2", half: true },
        { key: "power", label: "Power load (kVA)", type: "number", placeholder: "e.g. 100", half: true },
        { key: "highway", label: "Highway access", type: "pills", options: ["Yes", "No"] },
      ];
    case "land":
      return [
        { key: "plotArea", label: "Plot area (sq ft)", type: "number", placeholder: "e.g. 6000", required: true, half: true },
        { key: "dimensions", label: "Dimensions (ft)", type: "text", placeholder: "e.g. 60 × 100", half: true },
        { key: "approved", label: "Approved use", type: "select", options: ["Commercial", "Mixed-use", "Industrial"] },
        { key: "corner", label: "Corner plot", type: "pills", options: ["Yes", "No"] },
        { key: "boundary", label: "Boundary wall", type: "pills", options: ["Yes", "No"] },
      ];
    default:
      // rent, buy, homestay, flatmate — residential unit
      return [
        { key: "apartmentType", label: "Property type", type: "select", options: apartmentTypes, required: true },
        { key: "bhk", label: "BHK type", type: "select", options: bhkTypes, required: true },
        { key: "floor", label: "Floor", type: "select", options: floorOptions, half: true },
        { key: "totalFloors", label: "Total floors", type: "select", options: floorOptions, half: true },
        { key: "age", label: "Property age", type: "select", options: propertyAges, half: true },
        { key: "facing", label: "Facing", type: "select", options: facings, half: true },
        { key: "area", label: "Built-up area (sq ft)", type: "number", placeholder: "e.g. 1200" },
      ];
  }
}

function pricingFields(slug: string): FieldDef[] {
  const isSale = slug === "buy" || slug === "land" || slug === "lease";
  if (isSale) {
    return [
      { key: "price", label: "Expected price (₹)", type: "number", placeholder: "e.g. 11500000", required: true },
      { key: "negotiable", label: "Price negotiable", type: "pills", options: ["Yes", "No"] },
      { key: "possession", label: "Possession", type: "select", options: ["Ready to move", "Within 3 months", "Within 6 months", "Under construction"] },
    ];
  }
  const isBed = slug === "pg" || slug === "coliving";
  return [
    { key: "rent", label: isBed ? "Rent per bed / mo (₹)" : "Expected rent / mo (₹)", type: "number", placeholder: "e.g. 18500", required: true, half: true },
    { key: "deposit", label: "Security deposit (₹)", type: "number", placeholder: "e.g. 50000", required: true, half: true },
    { key: "available", label: "Available from", type: "date", half: true },
    { key: "maintenance", label: "Maintenance / mo (₹)", type: "number", placeholder: "e.g. 2000", half: true },
  ];
}

export default function PostListing() {
  const [step, setStep] = useState<"landing" | "wizard">("landing");

  // Landing lead-capture state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [city, setCity] = useState("");
  const [whatsapp, setWhatsapp] = useState(true);
  const [world, setWorld] = useState<World>("residential");
  const [slug, setSlug] = useState("rent");

  // Poster-type tab on landing card (visual toggle only)
  const [poster, setPoster] = useState<"owner" | "broker">("owner");

  // Wizard state
  const [active, setActive] = useState(0);
  const [form, setForm] = useState<Record<string, string>>({});
  const [amenities, setAmenities] = useState<string[]>(["Wi-Fi"]);
  const [days, setDays] = useState<string[]>(["Sat", "Sun"]);
  const [images, setImages] = useState<string[]>([]);

  // Urgency countdown (kicks off when the wizard opens)
  const [secondsLeft, setSecondsLeft] = useState(120);
  useEffect(() => {
    if (step !== "wizard") return;
    const t = setInterval(() => setSecondsLeft((s) => (s <= 0 ? 0 : s - 1)), 1000);
    return () => clearInterval(t);
  }, [step]);

  const category = getCategory(slug);
  const worldCategories = categoriesForWorld(world);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));
  const toggleAmenity = (a: string) =>
    setAmenities((p) => (p.includes(a) ? p.filter((x) => x !== a) : [...p, a]));
  const toggleDay = (d: string) =>
    setDays((p) => (p.includes(d) ? p.filter((x) => x !== d) : [...p, d]));
  const addImage = () => setImages((p) => [...p, `Photo ${p.length + 1}`].slice(0, 8));

  const chooseWorld = (w: World) => {
    setWorld(w);
    setSlug(categoriesForWorld(w)[0].slug); // reset to first category of that world
  };

  const progress = Math.round((active / (WIZARD_STEPS.length - 1)) * 100);
  const last = active === WIZARD_STEPS.length - 1;

  const field =
    "w-full border border-hairline rounded-[8px] px-3 h-12 text-sm text-ink outline-none focus:border-ink focus:border-2 transition-colors bg-canvas";
  const labelCls = "text-[13px] font-medium text-ink block mb-1.5";

  // Generic field renderer driven by the category config
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
              <button
                key={o}
                type="button"
                onClick={() => set(f.key, o)}
                aria-pressed={on}
                className={`px-4 py-2 text-sm font-medium rounded-[8px] border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 ${
                  on ? "bg-rausch/10 border-rausch text-rausch" : "bg-canvas text-body border-hairline hover:border-ink"
                }`}
              >
                {o}
              </button>
            );
          })}
        </div>
      );
    }
    return (
      <input
        type={f.type === "number" ? "text" : f.type}
        inputMode={f.type === "number" ? "numeric" : undefined}
        value={form[f.key] ?? ""}
        onChange={(e) => set(f.key, e.target.value)}
        placeholder={"placeholder" in f ? f.placeholder : undefined}
        className={`${field} ${f.type === "date" && !form[f.key] ? "text-muted" : ""}`}
      />
    );
  };

  const renderFieldGroup = (fields: FieldDef[]) => (
    <div className="grid grid-cols-2 gap-x-4 gap-y-5">
      {fields.map((f) => (
        <div key={f.key} className={f.half ? "col-span-1" : "col-span-2"}>
          <label className={labelCls}>
            {f.label}
            {f.required && <span className="text-rausch"> *</span>}
          </label>
          {renderField(f)}
        </div>
      ))}
    </div>
  );

  // ─── STEP 1: Landing ──────────────────────────────────────────────────────
  if (step === "landing") {
    return (
      <PageLayout breadcrumbs={[{ label: "Home", href: "/" }, { label: "List your property" }]}>

        {/* ── Hero band ── full-width bleed matching explore/home hero pattern */}
        <section
          aria-label="List your property"
          className="relative overflow-hidden bg-gradient-to-br from-surface-soft via-violet/10 to-violet/25 -mx-4 md:-mx-6 lg:-mx-10 px-4 md:px-6 lg:px-10 pt-8 md:pt-12 pb-10 md:pb-0 mb-8 rounded-b-[32px]"
        >
          {/* Decorative themed background */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -right-16 w-80 h-80 rounded-full bg-violet/25 blur-3xl" />
            <div className="absolute -bottom-28 -left-24 w-80 h-80 rounded-full bg-indigo/20 blur-3xl" />
            <div className="absolute top-12 right-1/4 w-24 h-24 rounded-[20px] rotate-12 bg-violet/15" />
            <div className="absolute bottom-10 left-1/3 w-16 h-16 rounded-full border border-violet/30" />
          </div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,420px)] gap-8 lg:gap-12 items-start max-w-[1100px] mx-auto">

            {/* ── Left: headline + trust + testimonial ── */}
            <div className="lg:py-10 lg:pb-16">
              <p className="text-sm font-semibold text-rausch uppercase tracking-wider mb-3">
                Free property listing
              </p>
              <h1 className="text-[clamp(28px,4vw,46px)] font-bold text-ink tracking-tight leading-[1.1] mb-4">
                Sell or rent your property{" "}
                <span className="text-rausch">for free</span>
              </h1>
              <p className="text-base text-body max-w-[480px] mb-8 leading-relaxed">
                Post your property in under 3 minutes. Reach verified buyers and
                tenants across India — with zero brokerage.
              </p>

              {/* Trust bullets */}
              <ul className="space-y-4 mb-10" aria-label="Why list with us">
                {benefits.map((b) => (
                  <li key={b.title} className="flex items-start gap-3">
                    <span
                      className="mt-0.5 shrink-0 w-6 h-6 rounded-full bg-rausch/10 flex items-center justify-center text-rausch"
                      aria-hidden="true"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                        <path d="M5 12l4 4L19 7" />
                      </svg>
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-ink">{b.title}</span>
                      <span className="block text-[13px] text-muted">{b.desc}</span>
                    </span>
                  </li>
                ))}
              </ul>

              {/* Testimonial */}
              <figure className="bg-canvas border border-hairline rounded-[14px] p-5 max-w-[420px] shadow-airbnb">
                <p className="text-base font-semibold text-ink mb-2">30 lakh+ owners trust us</p>
                <blockquote className="text-[13px] text-body leading-relaxed mb-3">
                  &ldquo;I posted my flat on NestNext and despite my busy schedule they
                  reached out at the right times and found a great tenant as per my
                  needs.&rdquo;
                </blockquote>
                <figcaption className="flex items-center justify-between">
                  <span className="text-[13px] font-medium text-ink">Aldrin · Bengaluru</span>
                  <span className="text-rausch text-sm" aria-label="5 star rating">★★★★★</span>
                </figcaption>
              </figure>

              {/* "Looking for a home?" link */}
              <p className="text-sm text-muted mt-6">
                Looking for a home?{" "}
                <Link
                  href="/explore"
                  className="text-ink font-semibold underline underline-offset-2 hover:text-rausch transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink rounded-sm"
                >
                  Explore listings
                </Link>
              </p>
            </div>

            {/* ── Right: floating lead-capture card ── */}
            <div className="animate-fade-up lg:-mb-10 lg:mt-6">
              <div className="bg-canvas rounded-[20px] shadow-airbnb border border-hairline-soft p-6">

                {/* Poster-type segmented tabs: Owner | Broker / Builder */}
                <div
                  role="group"
                  aria-label="Poster type"
                  className="flex items-center bg-surface-soft rounded-[8px] p-1 mb-5"
                >
                  {(["owner", "broker"] as const).map((p) => {
                    const on = poster === p;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPoster(p)}
                        aria-pressed={on}
                        className={`flex-1 py-2 text-sm font-semibold rounded-[6px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 ${
                          on
                            ? "bg-ink text-white shadow-airbnb"
                            : "text-muted hover:text-ink"
                        }`}
                      >
                        {p === "owner" ? "Owner" : "Broker / Builder"}
                      </button>
                    );
                  })}
                </div>

                {/* Property type: Residential | Commercial */}
                <label className={labelCls}>Property type</label>
                <div
                  role="group"
                  aria-label="Property type"
                  className="inline-flex items-center gap-1 bg-surface-soft border border-hairline-soft rounded-full p-1 mb-5 w-full"
                >
                  {(["residential", "commercial"] as World[]).map((w) => {
                    const on = world === w;
                    return (
                      <button
                        key={w}
                        type="button"
                        onClick={() => chooseWorld(w)}
                        aria-pressed={on}
                        className={`flex-1 py-2 text-sm font-semibold rounded-full capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 ${
                          on ? "bg-ink text-white" : "text-muted hover:text-ink"
                        }`}
                      >
                        {w}
                      </button>
                    );
                  })}
                </div>

                {/* Category chips: "What are you listing?" */}
                <label className={labelCls}>What are you listing?</label>
                <div
                  className="flex flex-wrap gap-2 mb-5"
                  role="group"
                  aria-label="Listing category"
                >
                  {worldCategories.map((c) => {
                    const on = slug === c.slug;
                    return (
                      <button
                        key={c.slug}
                        type="button"
                        onClick={() => setSlug(c.slug)}
                        aria-pressed={on}
                        className={`px-3 py-1.5 text-sm font-medium rounded-[8px] border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 ${
                          on
                            ? "bg-rausch text-white border-rausch"
                            : "bg-canvas text-body border-hairline hover:border-ink"
                        }`}
                      >
                        {c.label}
                      </button>
                    );
                  })}
                </div>

                {/* Compact Name + City row */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className={labelCls}>Name</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={field}
                      placeholder="Your name"
                      autoComplete="name"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>City</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className={`${field} ${city ? "text-ink" : "text-muted"}`}
                    >
                      <option value="">Select</option>
                      {cities.map((c) => (
                        <option key={c} value={c} className="text-ink">{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Mobile number with +91 prefix */}
                <div className="mb-4">
                  <label className={labelCls}>Mobile number</label>
                  <div className="flex items-center border border-hairline rounded-[8px] h-12 px-3 focus-within:border-ink focus-within:border-2 transition-colors bg-canvas">
                    <span className="text-ink text-sm pr-2 border-r border-hairline mr-2 shrink-0">+91</span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="98765 43210"
                      autoComplete="tel"
                      className="flex-1 text-sm text-ink placeholder-muted outline-none bg-transparent"
                    />
                  </div>
                </div>

                {/* Email (compact, below mobile) */}
                <div className="mb-4">
                  <label className={labelCls}>Email</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={field}
                    placeholder="name@gmail.com"
                    autoComplete="email"
                    type="email"
                  />
                </div>

                {/* WhatsApp toggle */}
                <button
                  type="button"
                  onClick={() => setWhatsapp((w) => !w)}
                  aria-pressed={whatsapp}
                  className="flex items-center gap-2.5 mb-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink rounded-full"
                >
                  <span
                    className={`relative w-10 h-6 rounded-full transition-colors ${
                      whatsapp ? "bg-rausch" : "bg-surface-strong"
                    }`}
                    aria-hidden="true"
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        whatsapp ? "translate-x-4" : ""
                      }`}
                    />
                  </span>
                  <span className="text-sm text-body">Get updates on WhatsApp</span>
                </button>

                {/* Primary CTA */}
                <button
                  type="button"
                  onClick={() => { setStep("wizard"); setActive(0); setSecondsLeft(120); }}
                  className="w-full h-12 bg-rausch text-white text-base font-semibold rounded-[8px] hover:bg-rausch-active transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rausch focus-visible:ring-offset-2"
                >
                  Proceed
                </button>

                {/* Reassurance line */}
                <p className="text-[12px] text-muted text-center mt-3">
                  Free forever · No brokerage · Listings reviewed before going live.
                </p>
              </div>
            </div>

          </div>
        </section>

      </PageLayout>
    );
  }

  // ─── STEP 2: Multi-step wizard ────────────────────────────────────────────
  const mm = String(Math.floor(secondsLeft / 60)).padStart(1, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <PageLayout breadcrumbs={[{ label: "Home", href: "/" }, { label: "List your property", href: "/post" }, { label: category?.label ?? "Post" }]}>
      {/* Urgency strip */}
      <div className="flex items-center gap-3 mb-5 px-4 py-2.5 rounded-[14px] bg-rausch/5 border border-rausch/30">
        <span className="shrink-0 w-8 h-8 rounded-full bg-rausch/10 text-rausch flex items-center justify-center" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" /></svg>
        </span>
        <p className="text-sm text-body flex-1 min-w-0">
          {secondsLeft > 0 ? (
            <>Get <span className="font-semibold text-ink">2 extra enquiries</span> if you list your property now.</>
          ) : (
            <>Timer&apos;s up — but you&apos;ll still get <span className="font-semibold text-ink">3 free enquiries</span>. Just finish posting!</>
          )}
        </p>
        {secondsLeft > 0 && (
          <span className="shrink-0 text-[13px] font-semibold text-white bg-rausch rounded-full px-2.5 py-1 tabular-nums" aria-label={`${secondsLeft} seconds left`}>
            {mm}:{ss}
          </span>
        )}
      </div>

      {/* Top bar: home + progress + preview */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => setStep("landing")} className="shrink-0 text-muted hover:text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink rounded-sm" aria-label="Back to start">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <div className="flex-1">
          <div className="h-1.5 bg-surface-strong rounded-full overflow-hidden">
            <div className="h-full bg-rausch rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <span className="shrink-0 text-[13px] font-medium text-muted">{progress}% done</span>
        <button className="shrink-0 px-4 h-9 border border-rausch text-rausch text-sm font-medium rounded-[8px] hover:bg-rausch/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rausch">Preview</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_240px] gap-6">
        {/* Left: step nav */}
        <nav className="bg-canvas border border-hairline rounded-[14px] p-2 h-fit lg:sticky lg:top-24" aria-label="Posting steps">
          {WIZARD_STEPS.map((s, i) => {
            const isActive = i === active;
            const done = i < active;
            return (
              <button
                key={s.key}
                onClick={() => setActive(i)}
                aria-current={isActive ? "step" : undefined}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-[10px] text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink ${
                  isActive ? "bg-surface-soft text-ink" : "text-muted hover:bg-surface-soft hover:text-ink"
                }`}
              >
                <span className={isActive || done ? "text-rausch" : ""}>
                  {done ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M20 6L9 17l-5-5" /></svg>
                  ) : (
                    stepIcon(s.key)
                  )}
                </span>
                <span className={`text-sm font-medium ${isActive ? "text-ink" : ""}`}>{s.label}</span>
                {isActive && <span className="ml-auto w-1.5 h-6 bg-rausch rounded-full" />}
              </button>
            );
          })}

          {/* WhatsApp helper */}
          <div className="mt-2 p-3 rounded-[10px] bg-surface-soft">
            <p className="text-[12px] text-body leading-snug">
              <span className="font-semibold text-ink">Need help?</span> Now you can post directly via{" "}
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="text-rausch font-medium hover:underline">WhatsApp ›</a>
            </p>
          </div>
        </nav>

        {/* Middle: form */}
        <div className="bg-canvas border border-hairline rounded-[14px] p-6 min-h-[420px]">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-hairline">
            <h2 className="text-[19px] font-bold text-ink">{WIZARD_STEPS[active].label}</h2>
            <span className="text-[12px] font-medium text-muted bg-surface-soft px-2.5 py-1 rounded-full">{category?.label}</span>
          </div>

          {/* Step: category-aware details */}
          {active === 0 && renderFieldGroup(detailFields(slug))}

          {/* Step: locality */}
          {active === 1 && (
            <div className="space-y-5">
              <div>
                <label className={labelCls}>City<span className="text-rausch"> *</span></label>
                <select value={form.city ?? city} onChange={(e) => set("city", e.target.value)} className={`${field} ${(form.city ?? city) ? "text-ink" : "text-muted"}`}>
                  <option value="">Select city</option>
                  {cities.map((c) => (<option key={c} value={c} className="text-ink">{c}</option>))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Locality / Area<span className="text-rausch"> *</span></label>
                <input className={field} placeholder="e.g. Koramangala" value={form.locality ?? ""} onChange={(e) => set("locality", e.target.value)} />
                {!form.locality && <p className="text-[12px] text-error mt-1.5">Please select a valid locality</p>}
              </div>
              <div><label className={labelCls}>Project / Society name</label><input className={field} placeholder="e.g. Prestige Shantiniketan" value={form.project ?? ""} onChange={(e) => set("project", e.target.value)} /></div>
              <div><label className={labelCls}>Street / Landmark</label><input className={field} placeholder="Near Forum Mall" value={form.landmark ?? ""} onChange={(e) => set("landmark", e.target.value)} /></div>
            </div>
          )}

          {/* Step: category-aware pricing */}
          {active === 2 && renderFieldGroup(pricingFields(slug))}

          {/* Step: amenities */}
          {active === 3 && (
            <div>
              <label className={labelCls}>Select the amenities available</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {amenityOptions.map((a) => (
                  <button key={a} type="button" onClick={() => toggleAmenity(a)} aria-pressed={amenities.includes(a)} className={`px-3 py-1.5 text-sm rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 ${amenities.includes(a) ? "bg-rausch/10 border-rausch text-rausch" : "bg-canvas border-hairline text-body hover:border-ink"}`}>
                    {a}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step: photos */}
          {active === 4 && (
            <div>
              <label className={labelCls}>Add photos of your property</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-2">
                {images.map((img) => (
                  <div key={img} className="relative aspect-square bg-surface-strong rounded-[14px] flex items-center justify-center text-[11px] text-muted">
                    {img}
                    <button onClick={() => setImages((p) => p.filter((x) => x !== img))} className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-ink text-white text-xs flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink" aria-label="Remove photo">✕</button>
                  </div>
                ))}
                {images.length < 8 && (
                  <button onClick={addImage} className="aspect-square border-2 border-dashed border-hairline rounded-[14px] flex flex-col items-center justify-center text-muted hover:border-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
                    <span className="text-[11px] mt-1">Upload</span>
                  </button>
                )}
              </div>
              <p className="text-[12px] text-muted mt-3">Properties with photos get up to 5× more responses.</p>
            </div>
          )}

          {/* Step: schedule */}
          {active === 5 && (
            <div className="space-y-5">
              <div>
                <label className={labelCls}>Available days for visits</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {visitDays.map((d) => (
                    <button key={d} type="button" onClick={() => toggleDay(d)} aria-pressed={days.includes(d)} className={`px-3 py-1.5 text-sm rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 ${days.includes(d) ? "bg-ink text-white border-ink" : "bg-canvas border-hairline text-body hover:border-ink"}`}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelCls}>Visit starts</label><input type="time" className={field} value={form.from ?? ""} onChange={(e) => set("from", e.target.value)} /></div>
                <div><label className={labelCls}>Visit ends</label><input type="time" className={field} value={form.to ?? ""} onChange={(e) => set("to", e.target.value)} /></div>
              </div>
              <div>
                <label className={labelCls}>Who shows the property?</label>
                <select value={form.caretaker ?? ""} onChange={(e) => set("caretaker", e.target.value)} className={`${field} ${form.caretaker ? "text-ink" : "text-muted"}`}>
                  <option value="">Select</option>
                  {["I show personally", "Caretaker", "Tenant", "Security"].map((o) => (<option key={o} value={o} className="text-ink">{o}</option>))}
                </select>
              </div>
            </div>
          )}

          {/* Footer nav */}
          <div className="flex items-center justify-between mt-8 pt-5 border-t border-hairline">
            <button
              onClick={() => setActive((i) => Math.max(0, i - 1))}
              disabled={active === 0}
              className="text-sm font-medium text-muted hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={() => (last ? undefined : setActive((i) => i + 1))}
              className="px-6 h-11 bg-rausch text-white text-sm font-semibold rounded-[8px] hover:bg-rausch-active transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rausch focus-visible:ring-offset-2"
            >
              {last ? "Publish listing" : "Save & continue"}
            </button>
          </div>
        </div>

        {/* Right: owner perks rail */}
        <aside className="hidden lg:block h-fit lg:sticky lg:top-24">
          <div className="bg-surface-soft border border-hairline rounded-[14px] p-5">
            <p className="text-base font-semibold text-ink leading-snug mb-1">Get tenants faster</p>
            <p className="text-[12px] text-muted mb-4">Subscribe to an owner plan and find tenants quickly.</p>
            <ul className="space-y-3">
              {ownerPerks.map((p) => (
                <li key={p.title} className="flex gap-3 items-start">
                  <span className="shrink-0 w-8 h-8 rounded-full bg-rausch/10 text-rausch flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7.4L12 17l-6.3 4.4L8 14 2 9.4h7.6z" /></svg>
                  </span>
                  <span>
                    <span className="block text-[13px] font-semibold text-ink">{p.title}</span>
                    <span className="block text-[12px] text-muted">{p.desc}</span>
                  </span>
                </li>
              ))}
            </ul>
            <button className="w-full h-10 mt-4 bg-ink text-white text-sm font-medium rounded-[8px] hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink">Show interest</button>
          </div>
        </aside>
      </div>
    </PageLayout>
  );
}
