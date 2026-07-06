"use client";

/**
 * CategoryHero — dispatcher
 *
 * Renders the correct per-category hero based on the category slug.
 * Add a new case here whenever a new category is added to categories.ts.
 *
 * All heroes accept an optional `city` prop so the correct city name can be
 * injected at the call site (defaults to "Bengaluru").
 */

import RentHero from "./renthero";
import BuyHero from "./buyhero";
import PgHero from "./pghero";
import ColivingHero from "./colivinghero";
import FlatmateHero from "./flatmatehero";
import CommercialOfficeHero from "./commercialofficehero";
import CommercialShopHero from "./commercialshophero";
import CoworkingHero from "./coworkinghero";
import WarehouseHero from "./warehousehero";
import LandHero from "./landhero";
import LeaseHero from "./leasehero";
import HomestayHero from "./homestayhero";
import ResortHero from "./resorthero";
import ServiceApartmentHero from "./serviceapartmenthero";
import HotelHero from "./hotelhero";

interface CategoryHeroProps {
  slug: string;
  city?: string;
}

export default function CategoryHero({ slug, city = "Bengaluru" }: CategoryHeroProps) {
  switch (slug) {
    case "rent":
      return <RentHero city={city} />;
    case "buy":
      return <BuyHero city={city} />;
    case "pg":
      return <PgHero city={city} />;
    case "coliving":
      return <ColivingHero city={city} />;
    case "flatmate":
      return <FlatmateHero city={city} />;
    case "commercial-office":
      return <CommercialOfficeHero city={city} />;
    case "commercial-shop":
      return <CommercialShopHero city={city} />;
    case "coworking":
      return <CoworkingHero city={city} />;
    case "warehouse":
      return <WarehouseHero city={city} />;
    case "land":
      return <LandHero city={city} />;
    case "lease":
      return <LeaseHero city={city} />;
    case "homestay":
      return <HomestayHero city={city} />;
    case "resort":
      return <ResortHero city={city} />;
    case "service-apartment":
      return <ServiceApartmentHero city={city} />;
    case "hotel":
      return <HotelHero city={city} />;
    default:
      // Unknown slug — render nothing; the category page handles its own 404.
      return null;
  }
}
