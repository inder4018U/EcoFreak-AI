import { useState } from "react";
import { CATEGORIES_DATA } from "../data/categoriesData.js";

export default function WasteGuidePage({ onScanItem, onSelectCategory }) {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const categoriesList = Object.values(CATEGORIES_DATA);
  const filteredCategories = selectedFilter === "all"
    ? categoriesList
    : categoriesList.filter(c => c.id === selectedFilter);

  return (
    <div className="animate-fadeIn max-w-5xl mx-auto text-left">
      {/* Header Banner on Parchment */}
      <div className="parchment-sheet rounded-3xl p-6 sm:p-8 border-2 border-kraft-border shadow-paper-lg relative mb-8">
        <div className="washi-tape tape-top" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="rubber-stamp stamp-green text-xs font-bold">
                Field Identification Journal
              </span>
              <span className="text-xs font-stamp text-charcoal/50">• Vol. 2</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal tracking-tight">
              The Waste Guide
            </h1>
            <p className="text-charcoal/70 text-xs sm:text-sm font-sans mt-1 max-w-xl">
              Learn how to identify, sort and responsibly dispose of common everyday materials.
            </p>
          </div>

          <button
            onClick={onScanItem}
            className="px-5 py-2.5 rounded-xl bg-forest hover:bg-forest-light text-parchment font-serif font-bold text-xs flex items-center gap-2 shadow-md transition-all self-start sm:self-center shrink-0 active:scale-95"
          >
            <span>📷</span> Scan a Waste Item →
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pt-5 mt-4 border-t border-kraft-border/60 scrollbar-none">
          <button
            onClick={() => setSelectedFilter("all")}
            className={`px-4 py-1.5 rounded-xl text-xs font-serif font-bold transition-all shadow-paper ${
              selectedFilter === "all"
                ? "bg-forest text-parchment"
                : "bg-paper text-charcoal/70 hover:bg-parchment border border-kraft-border"
            }`}
          >
            All Materials
          </button>
          {categoriesList.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedFilter(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-serif font-bold transition-all shadow-paper flex items-center gap-1.5 whitespace-nowrap ${
                selectedFilter === cat.id
                  ? "bg-forest text-parchment"
                  : "bg-paper text-charcoal/70 hover:bg-parchment border border-kraft-border"
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Specimen Scrap Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCategories.map((cat) => (
          <div
            key={cat.id}
            className="parchment-sheet rounded-3xl p-6 border-2 border-kraft-border shadow-paper relative flex flex-col justify-between"
          >
            <div className="washi-tape tape-corner-left" />

            <div>
              {/* Category Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-paper border border-kraft-border flex items-center justify-center text-2xl shadow-paper">
                    {cat.emoji}
                  </div>
                  <div>
                    <h2 className="text-xl font-serif font-bold text-charcoal">
                      {cat.label}
                    </h2>
                    <p className="text-charcoal/60 text-xs font-sans">
                      {cat.subtitle}
                    </p>
                  </div>
                </div>

                <span className={`rubber-stamp text-[10px] font-bold ${cat.stampClass}`}>
                  {cat.name}
                </span>
              </div>

              {/* Action Tip Pill */}
              <div className="p-3 rounded-xl bg-paper border border-kraft-border text-xs text-charcoal/85 mb-4 shadow-paper">
                <span className="font-serif font-bold text-forest uppercase text-[10px] block mb-0.5">
                  Action Rule:
                </span>
                {cat.actionTip}
              </div>

              {/* Accepted Items */}
              <div className="mb-3">
                <span className="text-[11px] font-serif font-bold text-charcoal/70 uppercase tracking-wider block mb-1">
                  Accepted Specimen Examples:
                </span>
                <ul className="space-y-1 text-xs text-charcoal/80 pl-1">
                  {cat.acceptedItems.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-forest font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Prohibited Warnings */}
              <div className="mb-4">
                <span className="text-[11px] font-serif font-bold text-terracotta uppercase tracking-wider block mb-1">
                  Common Contaminants (Avoid):
                </span>
                <ul className="space-y-1 text-xs text-charcoal/70 pl-1">
                  {cat.prohibitedItems.slice(0, 2).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-terracotta font-bold">✕</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Footer with Google Maps Link & Scan Shortcut */}
            <div className="pt-3 border-t border-kraft-border/60 flex items-center justify-between text-xs">
              <a
                href={`https://www.google.com/maps/search/${encodeURIComponent(cat.mapsQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-forest hover:text-forest-dark font-serif font-semibold underline flex items-center gap-1"
              >
                <span>📍</span> Find {cat.name} Drop-offs
              </a>

              <button
                onClick={onScanItem}
                className="text-charcoal/70 hover:text-charcoal font-serif font-bold"
              >
                Scan This Item →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
