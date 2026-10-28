import { getHazardAndDisposalGuidance } from "../data/hazardAndDisposalData.js";

export default function DosAndDontsCard({ category, itemName }) {
  const guidance = getHazardAndDisposalGuidance(category, itemName);

  return (
    <div className="mt-5 rounded-2xl parchment-sheet p-5 text-left relative overflow-hidden">
      {/* Tape accent */}
      <div className="washi-tape tape-top" />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-kraft-border mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">📋</span>
          <div>
            <h3 className="text-charcoal text-base font-serif font-bold tracking-tight">
              Disposal Do’s & Don’ts
            </h3>
            <p className="text-charcoal/60 text-xs font-sans">
              Clean sorting field guidelines
            </p>
          </div>
        </div>
        <span className="rubber-stamp stamp-olive text-[11px] font-bold capitalize">
          {category} Specimen
        </span>
      </div>

      {/* Two-Column Grid: Do's vs Don'ts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* DO's */}
        <div className="rounded-xl border border-forest/30 bg-[#F2F7F2] p-4 flex flex-col justify-between shadow-paper">
          <div>
            <div className="flex items-center gap-1.5 text-forest font-serif font-bold text-xs uppercase tracking-wider mb-2.5">
              <span>✅</span> Recommended Actions (Do’s)
            </div>
            <ul className="space-y-2 text-xs text-charcoal/85">
              {guidance.dos.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-forest text-sm font-bold leading-none mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-3.5 pt-2.5 border-t border-forest/20 text-[11px] text-forest font-hand text-base">
            ✔ Clean sorting increases local recycling yields and reduces contamination.
          </div>
        </div>

        {/* DON'Ts */}
        <div className="rounded-xl border border-terracotta/30 bg-[#FDF4F0] p-4 flex flex-col justify-between shadow-paper">
          <div>
            <div className="flex items-center gap-1.5 text-terracotta font-serif font-bold text-xs uppercase tracking-wider mb-2.5">
              <span>❌</span> Practices to Avoid (Don’ts)
            </div>
            <ul className="space-y-2 text-xs text-charcoal/85">
              {guidance.donts.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-terracotta text-sm font-bold leading-none mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-3.5 pt-2.5 border-t border-terracotta/20 text-[11px] text-terracotta font-hand text-base">
            ✖ Avoids facility fires, contamination fees, and worker injuries.
          </div>
        </div>
      </div>
    </div>
  );
}
