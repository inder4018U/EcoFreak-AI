import { useState, useEffect } from "react";
import ScannerSection from "./components/ScannerSection.jsx";
import ResultCard from "./components/ResultCard.jsx";
import WasteGuidePage from "./components/WasteGuidePage.jsx";
import CarbonImpactPage from "./components/CarbonImpactPage.jsx";
import NearbyFacilitiesPage from "./components/NearbyFacilitiesPage.jsx";
import AboutPage from "./components/AboutPage.jsx";
import { CATEGORIES_DATA } from "./data/categoriesData.js";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home"); // home | scan | result | guide | carbon | facilities | about
  const [activeResult, setActiveResult] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [scanCounter, setScanCounter] = useState(5);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Smooth scroll to top on page switch
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const handleResult = (result, previewUrl) => {
    setActiveResult(result);
    setPreviewImage(previewUrl);
    setScanCounter((c) => c + 1);
    setCurrentPage("result");
  };

  const handleAnalyzing = (previewUrl) => {
    setPreviewImage(previewUrl);
  };

  const handleResetScanner = () => {
    setActiveResult(null);
    setPreviewImage(null);
    setCurrentPage("scan");
  };

  const categories = Object.values(CATEGORIES_DATA);

  return (
    <div className="min-h-screen flex flex-col bg-[#C8AC85] text-[#262426] relative overflow-x-hidden">
      {/* ─── VINTAGE SCRAPBOOK MARGIN ANNOTATIONS (Moodboard #01 desktop) ─── */}
      <div className="hidden xl:block absolute top-28 left-4 w-40 text-left pointer-events-none opacity-60 z-0">
        <p className="font-stamp text-[10px] uppercase text-charcoal/80 leading-relaxed">
          SMALL ACTIONS.<br />
          LOWER EMISSIONS.<br />
          BRIGHTER DAYS. 😊
        </p>
        <p className="font-hand text-lg text-forest font-bold mt-6 leading-tight">
          Same planet.<br />Different habits.
        </p>
        <p className="font-stamp text-[9px] uppercase text-charcoal/60 mt-6 leading-relaxed">
          REDUCE<br />REUSE<br />RECYCLE<br />LOWER CARBON<br />CLEANER CITIES<br />BRIGHTER DAYS.
        </p>
      </div>

      <div className="hidden xl:block absolute top-40 right-4 w-40 text-right pointer-events-none opacity-60 z-0">
        <p className="font-stamp text-[10px] uppercase text-charcoal/80 leading-relaxed">
          LESS WASTE<br />LOWER<br />EMISSIONS
        </p>
        <p className="font-hand text-lg text-forest font-bold mt-8 leading-tight">
          A cleaner planet<br />is a brighter<br />tomorrow. ♡
        </p>
        <span className="rubber-stamp stamp-rust text-[9px] font-bold mt-6 inline-block">
          No Planet B
        </span>
      </div>

      {/* ─── BROWSER / HEADER (Moodboard #01) ─── */}
      <header className="sticky top-0 z-40 bg-[#FAF6EE]/95 backdrop-blur-md border-b-2 border-kraft-border shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          {/* Logo & Tagline */}
          <div
            onClick={() => setCurrentPage("home")}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-forest border-2 border-forest-light flex items-center justify-center text-xl shadow-md group-hover:rotate-6 transition-transform">
              🌿
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-extrabold text-xl sm:text-2xl text-charcoal tracking-tight">
                  EcoFreak <span className="text-forest">AI</span>
                </span>
                <span className="rubber-stamp stamp-green text-[9px] font-bold py-0.5 px-1.5 hidden sm:inline-block">
                  Hybrid AI
                </span>
              </div>
              <p className="font-serif text-[11px] text-charcoal/65 tracking-wide -mt-0.5">
                Waste today. A cleaner tomorrow.
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {[
              { id: "home", label: "Home" },
              { id: "scan", label: "Scan Waste" },
              { id: "guide", label: "Waste Guide" },
              { id: "carbon", label: "Carbon Impact" },
              { id: "facilities", label: "Nearby Facilities" },
              { id: "about", label: "About" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`px-3 py-1.5 rounded-xl font-serif text-xs font-bold transition-all ${
                  currentPage === item.id
                    ? "bg-forest text-parchment shadow-sm"
                    : "text-charcoal/75 hover:text-charcoal hover:bg-paper"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Action Button: Scan an Item */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage("scan")}
              className="px-4 py-2 rounded-xl bg-forest hover:bg-forest-light text-parchment font-serif font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              <span>📷</span> Scan an item →
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-xl bg-paper border border-kraft-border flex items-center justify-center text-charcoal text-base"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-parchment border-b-2 border-kraft-border px-4 py-3 space-y-1 text-left animate-fadeIn">
            {[
              { id: "home", label: "🏠 Home" },
              { id: "scan", label: "📷 Scan Waste (Hybrid AI)" },
              { id: "guide", label: "📖 Waste Guide" },
              { id: "carbon", label: "🌍 Carbon Impact (Why it matters)" },
              { id: "facilities", label: "📍 Nearby Facilities" },
              { id: "about", label: "ℹ️ About & Technology" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full px-3 py-2 rounded-xl font-serif text-xs font-bold text-left transition-all ${
                  currentPage === item.id
                    ? "bg-forest text-parchment"
                    : "text-charcoal/80 hover:bg-paper"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* ─── MAIN CONTENT CONTAINER ─── */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 relative z-10">

        {/* ─── 01. HOMEPAGE VIEW (Moodboard #01) ─── */}
        {currentPage === "home" && (
          <div className="animate-fadeIn space-y-12">
            {/* HERO BLOCK ON TORN PARCHMENT SHEET */}
            <section className="parchment-sheet rounded-3xl p-6 sm:p-10 border-2 border-kraft-border shadow-paper-lg relative">
              <div className="washi-tape tape-top" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
                {/* Left Text Column */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="rubber-stamp stamp-green text-xs font-bold">
                      EcoFreak AI • Field Journal
                    </span>
                    <span className="text-xs font-stamp text-charcoal/60">
                      Waste today. A cleaner tomorrow.
                    </span>
                  </div>

                  {/* Headline from prompt and moodboard */}
                  <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-charcoal tracking-tight leading-[1.15]">
                    Know what it is.<br />
                    <span className="inline-block bg-[#D3E8D6] text-forest px-3 py-1 rounded-2xl border-2 border-dashed border-forest/50 mt-1">
                      Know where it goes.
                    </span>
                  </h1>

                  <p className="text-charcoal/80 text-sm sm:text-base font-sans leading-relaxed max-w-xl">
                    Photograph a waste item to identify its material, get instant disposal guidance, and see how it relates to a cleaner, lower carbon future.
                  </p>

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-wrap items-center gap-4">
                    <button
                      onClick={() => setCurrentPage("scan")}
                      className="px-6 py-3 rounded-2xl bg-forest hover:bg-forest-light text-parchment font-serif font-bold text-sm flex items-center gap-2 shadow-paper transition-all active:scale-95"
                    >
                      <span>Scan an item →</span>
                    </button>

                    <button
                      onClick={() => setCurrentPage("guide")}
                      className="text-forest hover:text-forest-dark font-serif font-bold text-sm underline underline-offset-4 decoration-2 decoration-forest/50"
                    >
                      Explore the waste guide
                    </button>
                  </div>

                  {/* Stamp Badge on Hero */}
                  <div className="pt-3 flex items-center gap-3">
                    <div className="p-2.5 rounded-xl border-2 border-dashed border-terracotta bg-parchment inline-flex items-center gap-2 shadow-sm">
                      <span className="text-base">🏷️</span>
                      <span className="font-stamp text-[10px] font-bold text-terracotta uppercase">
                        SORT TODAY • CLEANER TOMORROW
                      </span>
                    </div>

                    <span className="font-hand text-base text-charcoal/70">
                      Field verified with dual AI models
                    </span>
                  </div>
                </div>

                {/* Right Polaroid Photo Column (Moodboard Crumpled Bottle Photo) */}
                <div className="lg:col-span-5 flex justify-center">
                  <div className="polaroid-frame w-full max-w-sm rotate-1 hover:rotate-0 transition-transform">
                    <div className="washi-tape tape-top" />
                    <div className="relative aspect-[4/3] rounded overflow-hidden bg-kraft/40 border border-kraft-border/40">
                      {/* Stylized Crushed Plastic Specimen Graphic matching moodboard photograph */}
                      <svg viewBox="0 0 400 300" className="w-full h-full object-cover">
                        <defs>
                          <radialGradient id="woodBg" cx="50%" cy="50%" r="75%">
                            <stop offset="0%" stopColor="#C4A57B" />
                            <stop offset="100%" stopColor="#8A6843" />
                          </radialGradient>
                        </defs>
                        <rect width="400" height="300" fill="url(#woodBg)" />
                        {/* Leaf & dirt particles */}
                        <circle cx="60" cy="70" r="14" fill="#6D7F4F" opacity="0.4" />
                        <circle cx="340" cy="220" r="18" fill="#5D4F41" opacity="0.3" />
                        <circle cx="80" cy="240" r="8" fill="#5D4F41" opacity="0.4" />
                        {/* Crushed clear PET plastic bottle */}
                        <g transform="translate(140, 40) rotate(15)">
                          {/* Green cap */}
                          <rect x="35" y="10" width="30" height="20" rx="3" fill="#2F4F35" stroke="#1E3523" strokeWidth="2" />
                          <line x1="40" y1="10" x2="40" y2="30" stroke="#FAF6EE" strokeWidth="1" opacity="0.4" />
                          <line x1="50" y1="10" x2="50" y2="30" stroke="#FAF6EE" strokeWidth="1" opacity="0.4" />
                          <line x1="60" y1="10" x2="60" y2="30" stroke="#FAF6EE" strokeWidth="1" opacity="0.4" />
                          {/* Bottle neck */}
                          <path d="M40 30 L60 30 L70 50 L30 50 Z" fill="#E8F4F8" fillOpacity="0.8" stroke="#A2C4BE" strokeWidth="1.5" />
                          {/* Crumpled body */}
                          <path d="M30 50 Q10 80 25 110 Q45 130 20 160 Q35 190 75 185 Q85 150 70 120 Q90 90 70 50 Z"
                            fill="#F0F8FA" fillOpacity="0.85" stroke="#7DA69E" strokeWidth="2" />
                          {/* Fold creases */}
                          <path d="M25 110 Q50 120 70 115" stroke="#88B0A8" strokeWidth="1.5" fill="none" />
                          <path d="M20 160 Q55 150 75 165" stroke="#88B0A8" strokeWidth="1.5" fill="none" />
                          <path d="M40 70 Q60 85 45 100" stroke="#FAF6EE" strokeWidth="2" fill="none" />
                        </g>
                      </svg>

                      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-[10px] font-stamp text-parchment">
                        Field Specimen #01 • PET Plastic
                      </div>
                    </div>

                    <div className="pt-3 text-center">
                      <p className="font-hand text-xl text-forest font-bold leading-tight">
                        "A cleaner planet is a brighter tomorrow." ♡
                      </p>
                      <p className="font-stamp text-[10px] text-charcoal/50 uppercase mt-0.5">
                        IDENTIFY • SORT • RECYCLE • REDUCE CARBON
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SCANNER WORKFLOW EMBEDDED IN HERO */}
            <section className="space-y-4">
              <div className="flex items-center justify-between text-left">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal">
                    Field Specimen Scanner
                  </h2>
                  <p className="text-charcoal/60 text-xs sm:text-sm font-sans">
                    Stage A: On-Device TensorFlow.js • Stage B: Groq Cloud Vision AI
                  </p>
                </div>
                <div className="flex items-center gap-1.5 bg-paper px-3 py-1.5 rounded-xl border border-kraft-border shadow-paper">
                  <span className="font-stamp text-xs text-forest font-bold">Scans Logged: {scanCounter}</span>
                </div>
              </div>

              <ScannerSection
                onResult={handleResult}
                onAnalyzing={handleAnalyzing}
              />
            </section>

            {/* 6 ILLUSTRATED WASTE CATEGORY SPECIMEN CARDS (Moodboard #01 bottom row) */}
            <section className="text-left space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal">
                    Waste Categories
                  </h2>
                  <p className="text-charcoal/60 text-xs sm:text-sm font-sans">
                    Learn the key physical traits and rules for each stream
                  </p>
                </div>

                <button
                  onClick={() => setCurrentPage("guide")}
                  className="text-forest hover:text-forest-dark font-serif font-bold text-xs underline"
                >
                  View Complete Field Guide →
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => setCurrentPage("guide")}
                    className="parchment-sheet rounded-2xl p-4 border border-kraft-border shadow-paper hover:shadow-paper-lg transition-all cursor-pointer flex flex-col justify-between group hover:-translate-y-1"
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-xl bg-paper border border-kraft-border mx-auto flex items-center justify-center text-2xl shadow-paper group-hover:scale-110 transition-transform">
                        {cat.emoji}
                      </div>
                      <h3 className="font-serif font-bold text-sm text-charcoal mt-2.5">
                        {cat.name}
                      </h3>
                      <p className="text-[11px] font-sans text-charcoal/60 mt-1 line-clamp-2 leading-tight">
                        {cat.subtitle}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-kraft-border/60 text-center">
                      <span className="text-[10px] font-stamp text-forest font-bold group-hover:underline">
                        Explore →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* QUICK WHY IT MATTERS CIRCULAR PROVIEW BANNER */}
            <section className="parchment-sheet rounded-3xl p-6 sm:p-8 border-2 border-kraft-border shadow-paper text-left">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="rubber-stamp stamp-olive text-xs font-bold">
                      Climate Insight
                    </span>
                    <span className="font-stamp text-xs text-charcoal/60">
                      Lifecycle Accounting
                    </span>
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-charcoal">
                    Every properly sorted item saves energy at the source.
                  </h3>
                  <p className="text-xs sm:text-sm font-sans text-charcoal/80 leading-relaxed">
                    Remelting recycled aluminum saves 95% of virgin bauxite smelting energy, while keeping food scraps out of oxygen-deprived landfills prevents potent methane (CH₄) gas emissions.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setCurrentPage("carbon")}
                    className="px-5 py-2.5 rounded-xl bg-forest hover:bg-forest-light text-parchment font-serif font-bold text-xs shadow-md transition-all whitespace-nowrap"
                  >
                    Explore Carbon Lifecycle →
                  </button>
                  <button
                    onClick={() => setCurrentPage("facilities")}
                    className="px-4 py-2.5 rounded-xl bg-paper hover:bg-parchment border border-kraft-border text-charcoal font-serif font-semibold text-xs shadow-paper transition-all whitespace-nowrap"
                  >
                    Find Drop-offs Nearby
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ─── 02. SCANNER DEDICATED VIEW ─── */}
        {currentPage === "scan" && (
          <div className="animate-fadeIn max-w-3xl mx-auto space-y-6 text-left">
            <div className="parchment-sheet rounded-3xl p-6 sm:p-8 border-2 border-kraft-border shadow-paper-lg relative">
              <div className="washi-tape tape-top" />
              <div className="flex items-center justify-between mb-3">
                <span className="rubber-stamp stamp-green text-xs font-bold">
                  Hybrid AI Scanner
                </span>
                <span className="font-stamp text-xs text-charcoal/60">
                  Dual-Model Classification
                </span>
              </div>
              <h1 className="text-3xl font-serif font-bold text-charcoal">
                Scan Any Waste Item
              </h1>
              <p className="text-xs sm:text-sm font-sans text-charcoal/70 mt-1 max-w-xl leading-relaxed">
                Use your webcam for live on-device inference with TensorFlow.js, or upload a photo to receive an in-depth classification and carbon evaluation via Groq Vision AI.
              </p>
            </div>

            <ScannerSection
              onResult={handleResult}
              onAnalyzing={handleAnalyzing}
            />
          </div>
        )}

        {/* ─── 03. SCAN RESULT VIEW (Moodboard #07 & #03) ─── */}
        {currentPage === "result" && activeResult && (
          <ResultCard
            result={activeResult}
            preview={previewImage}
            onReset={handleResetScanner}
            onNavigateToFacilities={() => setCurrentPage("facilities")}
          />
        )}

        {/* ─── 05. WASTE GUIDE VIEW (Moodboard #05) ─── */}
        {currentPage === "guide" && (
          <WasteGuidePage
            onScanItem={() => setCurrentPage("scan")}
            onSelectCategory={(catId) => console.log(catId)}
          />
        )}

        {/* ─── 06. CARBON IMPACT VIEW (Moodboard #06) ─── */}
        {currentPage === "carbon" && (
          <CarbonImpactPage
            onScanItem={() => setCurrentPage("scan")}
          />
        )}

        {/* ─── 04. NEARBY FACILITIES VIEW (Moodboard #04) ─── */}
        {currentPage === "facilities" && (
          <NearbyFacilitiesPage
            onScanItem={() => setCurrentPage("scan")}
          />
        )}

        {/* ─── ABOUT & MANIFESTO VIEW ─── */}
        {currentPage === "about" && (
          <AboutPage
            onScanItem={() => setCurrentPage("scan")}
          />
        )}
      </main>

      {/* ─── FOOTER (Moodboard #08) ─── */}
      <footer className="mt-16 bg-[#262426] text-parchment border-t-4 border-kraft-dark py-12 px-5 text-left relative z-0">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand & Mission */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-forest flex items-center justify-center text-base">
                🌿
              </div>
              <span className="font-serif font-extrabold text-2xl text-parchment tracking-tight">
                EcoFreak <span className="text-forest-light">AI</span>
              </span>
            </div>
            <p className="font-serif text-sm text-parchment/80">
              Waste today. A cleaner tomorrow.
            </p>
            <p className="text-xs font-sans text-parchment/60 leading-relaxed max-w-sm">
              An interactive environmental field journal combining client-side on-device TensorFlow.js and Groq Vision AI to make waste sorting transparent and actionable.
            </p>
            <div className="pt-2">
              <span className="rubber-stamp stamp-green text-[10px] font-bold">
                A CLEANER PLANET • BRIGHTER DAYS
              </span>
            </div>
          </div>

          {/* Product Links */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-forest-light">
              Field Product
            </h4>
            <ul className="space-y-1.5 text-xs text-parchment/70 font-sans">
              <li>
                <button onClick={() => setCurrentPage("scan")} className="hover:text-parchment transition-colors">
                  Scan Waste Specimen
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage("guide")} className="hover:text-parchment transition-colors">
                  The Waste Guide
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage("carbon")} className="hover:text-parchment transition-colors">
                  Carbon Impact (Why it matters)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage("facilities")} className="hover:text-parchment transition-colors">
                  Nearby Recycling Facilities
                </button>
              </li>
            </ul>
          </div>

          {/* About & Legal Links */}
          <div className="md:col-span-4 space-y-2">
            <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-forest-light">
              Ethos & Technology
            </h4>
            <ul className="space-y-1.5 text-xs text-parchment/70 font-sans">
              <li>
                <button onClick={() => setCurrentPage("about")} className="hover:text-parchment transition-colors">
                  Our Field Philosophy
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage("about")} className="hover:text-parchment transition-colors">
                  Hybrid AI Architecture (TF.js + Groq)
                </button>
              </li>
              <li>
                <span className="text-parchment/40">Privacy Policy: No user images or videos stored</span>
              </li>
              <li>
                <span className="text-parchment/40">Open Standards • US EPA GHG Accounting</span>
              </li>
            </ul>
            <div className="pt-2">
              <span className="rubber-stamp stamp-rust text-[9px] font-bold">
                THERE IS NO PLANET B
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-parchment/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-parchment/40 font-sans gap-2">
          <p>© {new Date().getFullYear()} EcoFreak AI. All environmental rights reserved.</p>
          <p className="font-hand text-base text-parchment/70">
            "Waste today. A cleaner tomorrow."
          </p>
        </div>
      </footer>
    </div>
  );
}
