export default function CarbonEducationModal({ onClose }) {
  const topics = [
    {
      icon: "🧪",
      title: "What Does CO₂e Mean?",
      subtitle: "Carbon Dioxide Equivalent",
      content: (
        <>
          <p className="mb-2">
            Not all greenhouse gases are identical. While carbon dioxide (CO₂) is the baseline benchmark, other gases trap significantly more atmospheric heat:
          </p>
          <ul className="list-disc list-inside space-y-1 text-charcoal/80 ml-1">
            <li>
              <strong className="text-charcoal">Methane (CH₄):</strong> ~28× more potent warming impact than CO₂ over a 100-year horizon (often released when organics rot in oxygen-starved municipal landfills).
            </li>
            <li>
              <strong className="text-charcoal">Nitrous Oxide (N₂O):</strong> ~265× more potent than CO₂ (released from agricultural runoff and industrial chemical processing).
            </li>
          </ul>
          <p className="mt-2 text-forest font-serif font-bold">
            CO₂e standardizes all these different gases into a single functional metric: the mass of CO₂ that would create an equivalent warming effect.
          </p>
        </>
      )
    },
    {
      icon: "🏭",
      title: "Why Everyday Objects Carry Emissions",
      subtitle: "The Hidden Lifecycle Journey",
      content: (
        <>
          <p className="mb-2">
            Every physical product carries "embodied carbon" accumulated across four primary lifecycle stages:
          </p>
          <ol className="list-decimal list-inside space-y-1.5 text-charcoal/80 ml-1">
            <li>
              <strong className="text-charcoal">Raw Material Extraction:</strong> Drilling petroleum for plastic polymers, mining bauxite for aluminum, or harvesting timber for virgin paper.
            </li>
            <li>
              <strong className="text-charcoal">Refining & Manufacturing:</strong> Smelting secondary metals at 1,500°C or powering semiconductor cleanrooms consumes substantial thermal and electrical energy.
            </li>
            <li>
              <strong className="text-charcoal">Transportation:</strong> Shipping freight globally via ocean container vessels, freight railways, and diesel trucks.
            </li>
            <li>
              <strong className="text-charcoal">End-of-Life Disposal:</strong> When items decompose in landfills, organic material emits fugitive methane, while incineration releases fossil-based carbon.
            </li>
          </ol>
        </>
      )
    },
    {
      icon: "🔄",
      title: "The 4Rs Hierarchy: Beyond Just Recycling",
      subtitle: "Maximizing the Climate Dividend",
      content: (
        <>
          <p className="mb-2">
            Not all waste reduction steps are equal. The highest climate benefit comes from the top of the waste hierarchy:
          </p>
          <div className="space-y-2 mt-2">
            <div className="p-2.5 rounded-lg bg-[#EBF4EC] border border-forest/30">
              <span className="text-forest font-serif font-bold text-xs uppercase block">1. Refuse & Reduce (Highest Impact)</span>
              <span className="text-charcoal/80 text-xs">Avoids 100% of raw material extraction and manufacturing emissions.</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#EFF4FA] border border-sky/40">
              <span className="text-sky-dark font-serif font-bold text-xs uppercase block">2. Reuse & Repair</span>
              <span className="text-charcoal/80 text-xs">Reusing a container 20 times reduces its per-use footprint by up to 95%.</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#F5F8EE] border border-olive/30">
              <span className="text-olive-dark font-serif font-bold text-xs uppercase block">3. Recycle & Compost</span>
              <span className="text-charcoal/80 text-xs">Remelting aluminum scrap saves 95% of virgin smelting energy; composting organics avoids anaerobic methane.</span>
            </div>
          </div>
        </>
      )
    },
    {
      icon: "⚡",
      title: "Why Real-World Estimates Vary",
      subtitle: "Understanding Scientific Sensitivity",
      content: (
        <>
          <p className="mb-2">
            Carbon footprint numbers are rigorous models, but real-world emissions fluctuate due to key variables:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-charcoal/80 ml-1">
            <li>
              <strong className="text-charcoal">Regional Electricity Grid:</strong> A facility powered by hydroelectric or solar energy has a smaller footprint than one powered by coal or gas.
            </li>
            <li>
              <strong className="text-charcoal">Recycled Content:</strong> An aluminum can produced from 70% post-consumer scrap emits dramatically less than 100% virgin bauxite.
            </li>
            <li>
              <strong className="text-charcoal">Sorting Facility Technology:</strong> Highly automated MRFs (Materials Recovery Facilities) recover higher quality flakes than manual dump yards.
            </li>
            <li>
              <strong className="text-charcoal">Contamination:</strong> Greasy food residue in paper bins can ruin entire recycling batches, forcing them into landfills.
            </li>
          </ul>
        </>
      )
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-charcoal/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-parchment border-2 border-kraft-border rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-paper-lg text-left overflow-hidden animate-fadeIn relative">
        {/* Header */}
        <div className="px-5 py-4 border-b border-kraft-border flex items-center justify-between bg-paper">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🎓</span>
            <div>
              <h2 className="text-charcoal font-serif font-bold text-base">Field Carbon Guide</h2>
              <p className="text-forest text-xs font-serif">Science Day & Climate Education</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-paper hover:bg-parchment border border-kraft-border text-charcoal flex items-center justify-center text-sm transition-all"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs leading-relaxed font-sans">
          {topics.map((t, idx) => (
            <div key={idx} className="bg-paper rounded-2xl p-4 border border-kraft-border shadow-paper">
              <div className="flex items-start gap-2.5 mb-2">
                <span className="text-2xl">{t.icon}</span>
                <div>
                  <h3 className="text-charcoal font-serif font-bold text-sm">{t.title}</h3>
                  <p className="text-charcoal/60 text-[11px] font-sans">{t.subtitle}</p>
                </div>
              </div>
              <div className="text-charcoal/85 mt-2">{t.content}</div>
            </div>
          ))}

          {/* Exhibition Note */}
          <div className="p-4 rounded-2xl bg-[#EAF2EC] border border-forest/30 text-charcoal">
            <p className="font-serif font-bold text-xs mb-1 text-forest">🌿 Field Journal Takeaway:</p>
            <p className="text-[11px] leading-relaxed text-charcoal/80">
              Responsible waste sorting is not merely aesthetic housekeeping — it directly intercepts potent fugitive greenhouse emissions before they enter the global carbon cycle!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-kraft-border bg-paper flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-forest text-parchment font-serif font-bold text-xs hover:bg-forest-light transition-all active:scale-95 shadow-md"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
