export default function AboutPage({ onScanItem }) {
  return (
    <div className="animate-fadeIn max-w-4xl mx-auto text-left">
      {/* Header Banner on Parchment */}
      <div className="parchment-sheet rounded-3xl p-6 sm:p-8 border-2 border-kraft-border shadow-paper-lg relative mb-8">
        <div className="washi-tape tape-top" />

        <div className="flex items-center gap-2 mb-2">
          <span className="rubber-stamp stamp-green text-xs font-bold">
            Field Manifesto & Technology
          </span>
          <span className="text-xs font-stamp text-charcoal/50">• EcoFreak AI</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal tracking-tight">
          Know what it is. Know where it goes.
        </h1>
        <p className="font-hand text-xl text-forest font-bold mt-1">
          "Waste today. A cleaner tomorrow."
        </p>

        <p className="text-charcoal/80 text-xs sm:text-sm font-sans mt-3 leading-relaxed max-w-2xl">
          EcoFreak AI is an interactive environmental field journal designed to make waste classification tangible, understandable, and scientifically grounded. Rather than treating recycling as an opaque algorithmic chore, we treat every discarded item as an environmental specimen with a lifecycle story.
        </p>
      </div>

      {/* ─── HYBRID AI SCANNER ARCHITECTURE ─── */}
      <div className="parchment-sheet rounded-3xl p-6 sm:p-8 border-2 border-kraft-border shadow-paper mb-8 relative">
        <div className="washi-tape tape-corner-left" />

        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="text-2xl font-serif font-bold text-charcoal flex items-center gap-2">
            <span>⚙️</span> The Hybrid AI Scanner Architecture
          </h2>
          <span className="rubber-stamp stamp-olive text-[10px] font-bold">
            Dual AI Engine
          </span>
        </div>

        <p className="text-charcoal/80 text-xs sm:text-sm font-sans leading-relaxed mb-6">
          EcoFreak AI combines client-side edge machine learning with cloud-based foundation vision intelligence. This two-stage pipeline guarantees instantaneous on-device feedback while providing rigorous, reasoned final classifications.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          {/* Stage A */}
          <div className="p-5 rounded-2xl bg-paper border border-kraft-border shadow-paper flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-stamp text-xs text-forest font-bold uppercase">Stage A: On-Device Edge</span>
                <span className="text-xl">⚡</span>
              </div>
              <h3 className="font-serif font-bold text-base text-charcoal mb-2">
                Google Teachable Machine (TF.js)
              </h3>
              <p className="text-xs text-charcoal/75 leading-relaxed font-sans mb-3">
                A custom MobileNetV2 neural network running directly inside your browser via TensorFlow.js. It continuously inspects camera frames in real-time across 19 waste categories without transmitting any video frames to external servers.
              </p>
              <ul className="space-y-1 text-xs text-charcoal/70 pl-1 font-sans">
                <li>• <strong>Resolution:</strong> 224 × 224 RGB tensors</li>
                <li>• <strong>Latency:</strong> ~15–30ms per frame</li>
                <li>• <strong>Classes:</strong> Plastic, Metal, Cardboard, Batteries, E-Waste, Organics, etc.</li>
                <li>• <strong>Zero bandwidth:</strong> 100% on-device live inference</li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-kraft-border text-[11px] font-stamp text-forest">
              ✔ Instant preliminary observation
            </div>
          </div>

          {/* Stage B */}
          <div className="p-5 rounded-2xl bg-paper border border-kraft-border shadow-paper flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-stamp text-xs text-forest font-bold uppercase">Stage B: Cloud Vision</span>
                <span className="text-xl">☁️</span>
              </div>
              <h3 className="font-serif font-bold text-base text-charcoal mb-2">
                Groq Vision AI (Llama 4 Vision)
              </h3>
              <p className="text-xs text-charcoal/75 leading-relaxed font-sans mb-3">
                Upon capturing a still frame, the image and the TensorFlow.js preliminary prediction are evaluated by Groq's high-speed Llama 4 Vision AI. It conducts deep semantic examination, validates material composition, estimates mass, and outputs structured disposal guidance.
              </p>
              <ul className="space-y-1 text-xs text-charcoal/70 pl-1 font-sans">
                <li>• <strong>Model:</strong> meta-llama/llama-4-scout-17b-16e-instruct</li>
                <li>• <strong>Context:</strong> Informed by local TF.js hypothesis</li>
                <li>• <strong>Authenticity:</strong> Evaluates real photo vs digital screenshot</li>
                <li>• <strong>Final Arbiter:</strong> Governs final displayed category & reasoning</li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-kraft-border text-[11px] font-stamp text-forest">
              ✔ Deep contextual reasoning & material science
            </div>
          </div>
        </div>

        {/* Disagreement handling guarantee */}
        <div className="p-4 rounded-xl bg-[#FDF3EE] border border-terracotta/30 text-charcoal/90 text-xs">
          <strong className="font-serif text-terracotta block mb-1 text-sm">
            ⚖️ Transparent Model Disagreement Protocol:
          </strong>
          If the preliminary TensorFlow.js edge model and the Groq Vision model observe differing attributes (e.g., if TF.js tentatively flags an obscured crushed can as "Trash" but Groq accurately identifies an "Aluminium Soda Can"), both perspectives are clearly reported in the field log. We do not synthesize artificial confidence averages; Groq serves as the final authority based on thorough visual reasoning.
        </div>
      </div>

      {/* Field Journal Ethos */}
      <div className="parchment-sheet rounded-3xl p-6 sm:p-8 border-2 border-kraft-border shadow-paper mb-8 relative">
        <h2 className="text-2xl font-serif font-bold text-charcoal mb-3">
          Our Field Philosophy
        </h2>
        <div className="space-y-3 text-xs sm:text-sm text-charcoal/80 font-sans leading-relaxed">
          <p>
            Modern waste systems fail primarily because materials are ambiguous. Multi-layer packaging, confusing resin identification numbers, and conflicting municipal rules lead to high contamination rates that doom entire recycling batches to landfills.
          </p>
          <p>
            By marrying instant edge vision with scientific lifecycle greenhouse gas estimations, EcoFreak AI empowers citizens, students, and facilities managers to make informed sorting decisions that directly mitigate global emissions.
          </p>
        </div>

        <div className="mt-6 pt-5 border-t border-kraft-border flex flex-wrap items-center justify-between gap-3">
          <div className="font-hand text-xl text-forest font-bold">
            "Same planet. Different habits."
          </div>
          <button
            onClick={onScanItem}
            className="px-5 py-2.5 rounded-xl bg-forest hover:bg-forest-light text-parchment font-serif font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
          >
            <span>📷</span> Try the Field Scanner →
          </button>
        </div>
      </div>
    </div>
  );
}
