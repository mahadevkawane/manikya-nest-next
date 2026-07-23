"use client";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, ZoomControl, Tooltip, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Link from "next/link";
import { PURPLE_LINE_COORDS, GREEN_LINE_COORDS } from "@/lib/metroData";

export interface RentalPin {
  id: string | number;
  price: string;
  title: string;
  lat: number;
  lng: number;
  color: "emerald" | "blue" | "violet";
  image?: string;
  location?: string;
  badge?: string;
}

const BENGALURU: [number, number] = [12.94, 77.64];

const priceIcon = (pin: RentalPin) =>
  L.divIcon({
    className: "",
    html: `<div class="price-pin price-pin--${pin.color} cursor-pointer hover:scale-105 transition-transform duration-150">${pin.price}</div>`,
    iconSize: [0, 0],
  });

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function RentalsMap({ pins }: { pins: RentalPin[] }) {
  const [showMetro, setShowMetro] = useState(true);
  const mapCenter = pins.length > 0 ? [pins[0].lat, pins[0].lng] as [number, number] : BENGALURU;

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={mapCenter}
        zoom={11}
        zoomControl={false}
        scrollWheelZoom={false}
        attributionControl={false}
        className="w-full h-full rounded-[16px] z-0"
      >
        <ChangeView center={mapCenter} />
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
        <ZoomControl position="bottomright" />

        {showMetro && (
          <>
            <Polyline
              positions={PURPLE_LINE_COORDS}
              pathOptions={{ color: "#7c3aed", weight: 2.5, opacity: 0.5 }}
            />
            <Polyline
              positions={GREEN_LINE_COORDS}
              pathOptions={{ color: "#0e8a6a", weight: 2.5, opacity: 0.5 }}
            />
          </>
        )}

        {pins.map((pin) => (
          <Marker key={pin.id} position={[pin.lat, pin.lng]} icon={priceIcon(pin)}>
            <Popup closeButton={false} className="custom-leaflet-popup">
              <Link href={`/listing/${pin.id}`} className="block p-2.5 min-w-[200px] max-w-[220px] hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-center gap-2 mb-1.5">
                  <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-rausch bg-rausch-soft rounded-[5px] px-2 py-0.5">
                    {pin.badge || "Popular"}
                  </span>
                  <span className="text-[12.5px] font-extrabold text-rausch">{pin.price}</span>
                </div>
                <h4 className="text-[12px] font-bold text-ink leading-snug line-clamp-1">{pin.title}</h4>
                {pin.location && <p className="text-[10px] text-muted truncate mt-0.5">{pin.location}</p>}
              </Link>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map options card */}
      <div className="absolute top-3 right-3 z-[500] bg-white/95 backdrop-blur border border-hairline-soft rounded-[12px] px-3.5 py-2.5 shadow-airbnb">
        <p className="text-[11.5px] font-bold text-ink">Map options</p>
        <label className="mt-1.5 flex items-center gap-2 text-[11.5px] font-medium text-body cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showMetro}
            onChange={(e) => setShowMetro(e.target.checked)}
            className="w-3.5 h-3.5 accent-[#0e8a6a] cursor-pointer"
          />
          Show Metro Routes
        </label>
      </div>
    </div>
  );
}
