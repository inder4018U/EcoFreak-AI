import { useState } from "react";
import { FIELD_FACILITIES } from "../data/categoriesData.js";

export default function NearbyFacilitiesPage({ onScanItem }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedFacility, setSelectedFacility] = useState(null);

  const filtered = FIELD_FACILITIES.filter(f => {
    const matchesSearch = searchQuery.trim() === "" ||
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.materials.some(m => m.toLowerCase().includes(searchQuery.toLowerCase())) ||
      f.type.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (activeFilter === "all") return true;
    if (activeFilter === "compost") return f.materials.some(m => m.toLowerCase().includes("food") || m.toLowerCase().includes("compost"));
    if (activeFilter === "ewaste") return f.materials.some(m => m.toLowerCase().includes("electronic") || m.toLowerCase().includes("battery"));
    if (activeFilter === "hazardous") return f.type.toLowerCase().includes("hazardous");
    if (activeFilter === "general") return f.materials.some(m => m.toLowerCase().includes("plastic") || m.toLowerCase().includes("paper"));
    return true;
  });

  return (
    <div className="animate-fadeIn max-w-5xl mx-auto text-left">
      {/* Header Banner on Parchment (Moodboard #04) */}
      <div className="parchment-sheet rounded-3xl p-6 sm:p-8 border-2 border-kraft-border shadow-paper-lg relative mb-8">
        <div className="washi-tape tape-top" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="rubber-stamp stamp-green text-xs font-bold">
                Field Logistics Directory
              </span>
              <span className="text-xs font-stamp text-charcoal/50">Verified Disposal Centers</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal tracking-tight">
              Nearby Recycling Facilities
            </h1>
            <p className="text-charcoal/70 text-xs sm:text-sm font-sans mt-1 max-w-xl">
              Locate authorized drop-off depots, e-waste centers, municipal composting stations, and hazardous collection sites.
            </p>
          </div>

          <button
            onClick={onScanItem}
            className="px-5 py-2.5 rounded-xl bg-forest hover:bg-forest-light text-parchment font-serif font-bold text-xs flex items-center gap-2 shadow-md transition-all self-start sm:self-center shrink-0 active:scale-95"
          >
            <span>📷</span> Scan Item First →
          </button>
        </div>

        {/* Search Bar & Location Query */}
        <div className="mt-4 flex flex-col sm:flex-row gap-2.5">
          <div className="flex-1 relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40 text-base">
              📍
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by neighborhood, city, or material (e.g. Batteries, Compost, Plastics)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-paper border border-kraft-border text-charcoal text-xs sm:text-sm font-sans placeholder:text-charcoal/40 focus:outline-none focus:border-forest shadow-paper"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              const query = searchQuery.trim() || "recycling center near me";
              window.open(`https://www.google.com/maps/search/${encodeURIComponent(query)}`, "_blank");
            }}
            className="px-5 py-2.5 rounded-xl bg-forest hover:bg-forest-light text-parchment font-serif font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 shrink-0"
          >
            <span>🗺️</span> Open In Google Maps
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pt-4 mt-3 border-t border-kraft-border/60 scrollbar-none">
          {[
            { id: "all", label: "All Depots" },
            { id: "general", label: "♻️ Recyclables (Plastic/Paper/Glass)" },
            { id: "compost", label: "🌱 Organic Compost" },
            { id: "ewaste", label: "📱 E-Waste & Batteries" },
            { id: "hazardous", label: "⚠️ Hazardous & Chemical" },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setActiveFilter(btn.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-serif font-bold transition-all shadow-paper whitespace-nowrap ${
                activeFilter === btn.id
                  ? "bg-forest text-parchment"
                  : "bg-paper text-charcoal/70 hover:bg-parchment border border-kraft-border"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Facilities Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {filtered.map((facility) => (
          <div
            key={facility.id}
            className="parchment-sheet rounded-3xl p-6 border-2 border-kraft-border shadow-paper relative flex flex-col justify-between"
          >
            <div className="washi-tape tape-corner-left" />

            <div>
              {/* Facility Header */}
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="text-[10px] font-stamp text-forest font-bold uppercase tracking-wider block">
                    {facility.type}
                  </span>
                  <h3 className="text-xl font-serif font-bold text-charcoal mt-0.5">
                    {facility.name}
                  </h3>
                </div>
                <span className="rubber-stamp stamp-green text-[10px] font-bold shrink-0">
                  {facility.distance}
                </span>
              </div>

              {/* Address & Hours */}
              <div className="space-y-1 text-xs text-charcoal/70 mb-3 font-sans">
                <p className="flex items-center gap-1.5">
                  <span>📍</span> {facility.address}
                </p>
                <p className="flex items-center gap-1.5 font-medium text-forest">
                  <span>🕒</span> {facility.hours}
                </p>
              </div>

              {/* Accepted Materials Badges */}
              <div className="mb-4">
                <span className="text-[10px] font-serif font-bold text-charcoal/60 uppercase tracking-wider block mb-1.5">
                  Accepted Field Materials:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {facility.materials.map((mat, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-full bg-paper border border-kraft-border text-charcoal/80 text-[11px] font-stamp"
                    >
                      • {mat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="p-3 rounded-xl bg-paper border border-kraft-border text-xs text-charcoal/80 mb-4 shadow-paper">
                <p className="font-hand text-base text-charcoal leading-tight">
                  "{facility.notes}"
                </p>
              </div>
            </div>

            {/* Footer with Directions */}
            <div className="pt-3 border-t border-kraft-border/60 flex items-center justify-between text-xs">
              <span className="text-charcoal/60 font-sans">{facility.phone}</span>
              <a
                href={`https://www.google.com/maps/search/${encodeURIComponent(`${facility.name} ${facility.address}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-1.5 rounded-xl bg-forest hover:bg-forest-light text-parchment font-serif font-bold shadow-sm transition-all flex items-center gap-1.5"
              >
                <span>🗺️</span> Get Directions →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
