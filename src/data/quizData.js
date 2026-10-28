/**
 * EcoFreak AI - Science Day Educational Mini-Quiz Question Bank
 * 
 * Category-specific multiple-choice questions covering:
 * - Waste classification & material identification
 * - Handling hazards and safety protocols
 * - Correct disposal & circular economics
 * - Environmental impacts and greenhouse gas prevention
 */

export const QUIZ_QUESTIONS = {
  plastic: [
    {
      id: "plastic_q1",
      question: "Why should plastic bottles be rinsed before placing them in the recycling bin?",
      options: [
        "To make the plastic heavier so trucks carry more",
        "To prevent food residue from rotting, attracting pests, and contaminating paper batches",
        "To remove the plastic color and make it transparent",
        "It is not necessary; recycling facilities incinerate all plastics anyway"
      ],
      correctIndex: 1,
      explanation: "Food and liquid residues spoil in recycling carts, attract vermin, and can ruin entire batches of dry recyclables like cardboard and paper pulp."
    },
    {
      id: "plastic_q2",
      question: "What is the primary danger of burning plastics in an open campfire or backyard barrel?",
      options: [
        "It extinguishes the fire too quickly",
        "It releases toxic, carcinogenic dioxins and black carbon into the local air",
        "It produces pure oxygen which causes explosions",
        "It creates liquid petroleum that leaks into grass"
      ],
      correctIndex: 1,
      explanation: "Combusting chlorine-containing plastics (like PVC or chlorinated polymers) generates toxic dioxins and furans, which cause serious respiratory and cellular damage."
    },
    {
      id: "plastic_q3",
      question: "Why can't thin plastic grocery bags go into standard single-stream curbside bins?",
      options: [
        "They are too small to be picked up by trucks",
        "They wrap around mechanical sorting gears and shut down the recycling plant",
        "They absorb too much atmospheric carbon",
        "They melt into toxic liquid inside collection trucks"
      ],
      correctIndex: 1,
      explanation: "Flexible plastic films and grocery bags are 'tanglers'. They wrap around automated spinning sorting screens, forcing sorting plants to halt operations for manual cut-outs."
    }
  ],

  organic: [
    {
      id: "organic_q1",
      question: "What dangerous greenhouse gas is generated when organic food scraps rot in an oxygen-deprived landfill?",
      options: [
        "Argon (Ar)",
        "Methane (CH₄)",
        "Helium (He)",
        "Chlorofluorocarbon (CFC)"
      ],
      correctIndex: 1,
      explanation: "Deep underground in landfills, methanogenic bacteria decompose organic waste anaerobically, venting methane (CH₄) — a greenhouse gas 28 times more potent than CO₂ over a 100-year horizon."
    },
    {
      id: "organic_q2",
      question: "Which of the following items should NEVER be placed in a domestic compost pile?",
      options: [
        "Coffee grounds and unbleached paper filters",
        "Apple cores and citrus fruit peels",
        "Plastic produce stickers, twist ties, and pet feces",
        "Dry autumn leaves and shredded cardboard"
      ],
      correctIndex: 2,
      explanation: "Produce stickers are synthetic plastic and do not degrade. Pet feces can harbor dangerous parasites (like Toxoplasma gondii) that survive home composting temperatures."
    },
    {
      id: "organic_q3",
      question: "How does applying finished compost help agricultural topsoil combat climate change?",
      options: [
        "It permanently freezes the ground temperature",
        "It sequesters organic carbon and enhances soil moisture retention, reducing synthetic fertilizer demand",
        "It turns soil into sand so water drains faster",
        "It stops plant roots from absorbing minerals"
      ],
      correctIndex: 1,
      explanation: "Compost builds dark, carbon-rich soil organic matter (humus). It improves water retention by up to 20% and reduces the need for fossil-fuel-based synthetic nitrogen fertilizers."
    }
  ],

  metal: [
    {
      id: "metal_q1",
      question: "How much energy is saved by recycling an aluminum beverage can compared to smelting new aluminum from bauxite ore?",
      options: [
        "About 10%",
        "About 35%",
        "Approximately 95%",
        "Zero energy is saved"
      ],
      correctIndex: 2,
      explanation: "Primary aluminum extraction requires intensive bauxite mining and huge amounts of electrolytic electricity. Secondary remelting uses scrap that requires only 5% of that initial energy — saving 95%!"
    },
    {
      id: "metal_q2",
      question: "What safety precaution should you take when disposing of an opened food tin can?",
      options: [
        "Push the sharp lid inside the can body to prevent lacerations to sanitation workers",
        "Sharpen the rim with a file",
        "Fill the tin with tap water before tossing",
        "Crush it into fine metallic powder"
      ],
      correctIndex: 0,
      explanation: "Opened tin lids have razor-sharp serrated edges. Pushing the lid inwards prevents deep finger lacerations for manual sorting workers and protects disposal collection bags."
    },
    {
      id: "metal_q3",
      question: "Why is discarding consumer electronics (e-waste) in standard trash illegal in many regions?",
      options: [
        "Because e-waste makes garbage trucks too heavy",
        "Electronics contain toxic heavy metals (lead, cadmium, mercury) and flammable lithium batteries",
        "Signals from discarded gadgets interfere with satellite communications",
        "Copper wire absorbs domestic trash moisture"
      ],
      correctIndex: 1,
      explanation: "Circuit boards contain toxic lead solder and mercury, and internal lithium batteries pose spontaneous fire hazards during compaction. E-waste requires certified collection."
    }
  ],

  glass: [
    {
      id: "glass_q1",
      question: "How many times can container glass (bottles and jars) be recycled?",
      options: [
        "Only 1 to 2 times before weakening",
        "5 to 7 times maximum",
        "Endlessly, without any loss in purity, quality, or strength",
        "Glass cannot be recycled"
      ],
      correctIndex: 2,
      explanation: "Glass is 100% mineral silica and limestone. It can be remelted endlessly in furnaces without any structural degradation or chemical breakdown."
    },
    {
      id: "glass_q2",
      question: "Why can't heat-resistant cookware (Pyrex), light bulbs, and window panes be recycled with normal glass bottles?",
      options: [
        "They have different chemical formulations and higher melting temperatures that ruin container glass batches",
        "They are made of colored plastic",
        "They absorb too much electromagnetic radiation",
        "They are too heavy for recycling conveyors"
      ],
      correctIndex: 0,
      explanation: "Pyrex contains boron and ceramics that melt at significantly higher temperatures than container soda-lime glass. In a bottle furnace, un-melted Pyrex forms dangerous structural flaws."
    },
    {
      id: "glass_q3",
      question: "What is the proper way to dispose of broken glass shards in domestic refuse?",
      options: [
        "Throw them loosely into a thin plastic trash bag",
        "Wrap shards securely in heavy newspaper or a rigid cardboard box labeled 'BROKEN GLASS'",
        "Grind shards into fine powder with a hammer",
        "Flush broken pieces down the toilet"
      ],
      correctIndex: 1,
      explanation: "Loose glass easily slices through plastic bags, severely injuring sanitation workers. Wrapping in sturdy cardboard or an empty rigid container protects handlers."
    }
  ],

  paper: [
    {
      id: "paper_q1",
      question: "Why should greasy pizza box bottoms NOT be placed in the paper recycling bin?",
      options: [
        "The grease makes the box too heavy",
        "Food oil cannot be separated from paper fibers during water pulping, ruining entire batches",
        "Grease attracts laser scanners and causes sorting errors",
        "Pizza boxes are actually made of pure sheet metal"
      ],
      correctIndex: 1,
      explanation: "Paper recycling is a water-based washing and pulping process. Oil and water do not mix, so grease saturates the cellulose fibers and creates oil spots that ruin new paper."
    },
    {
      id: "paper_q2",
      question: "Approximately how many times can virgin wood pulp fibers be recycled into new paper products?",
      options: [
        "1 time only",
        "5 to 7 times before fibers become too short to bind",
        "Up to 10,000 times",
        "Paper fibers never degrade"
      ],
      correctIndex: 1,
      explanation: "Each time paper is re-pulped and dried, cellulose fibers become shorter and more brittle. After 5 to 7 cycles, fibers are too short to form paper sheets and can only be composted."
    },
    {
      id: "paper_q3",
      question: "What is the most effective way to optimize cardboard recycling in curbside collection?",
      options: [
        "Break down and flatten boxes completely to conserve volume",
        "Fill boxes with wet food waste",
        "Cover the cardboard with glossy plastic tape",
        "Soak the cardboard in water before disposal"
      ],
      correctIndex: 0,
      explanation: "Flattening boxes maximizes collection truck capacity, reduces transport carbon emissions, and ensures boxes pass smoothly onto facility sorting conveyor belts."
    }
  ],

  hazardous: [
    {
      id: "hazardous_q1",
      question: "What safety step should you take before dropping off rechargeable lithium or alkaline batteries for recycling?",
      options: [
        "Puncture the outer casing with a nail",
        "Tape both terminal ends with non-conductive electrical tape or place in individual bags",
        "Soak the batteries in salt water overnight",
        "Melt the terminals with a lighter"
      ],
      correctIndex: 1,
      explanation: "Residual battery charge can short-circuit if terminals touch other metal objects in collection bins. Taping terminals prevents electrical sparking and thermal runaway fires."
    },
    {
      id: "hazardous_q2",
      question: "What happens if common household bleach is accidentally mixed with ammonia-based cleaners?",
      options: [
        "It creates a super-effective eco-friendly disinfectant",
        "It generates deadly chloramine gas, which causes severe chemical burns and respiratory failure",
        "It instantly turns into pure drinking water",
        "It freezes into harmless salt crystals"
      ],
      correctIndex: 1,
      explanation: "Bleach (sodium hypochlorite) reacts violently with ammonia to produce chloramine gas (NH₂Cl), which dissolves in lung moisture to form hydrochloric acid, causing severe respiratory damage."
    },
    {
      id: "hazardous_q3",
      question: "Where should leftover solvents, oil-based paints, and chemical cleaners always be taken?",
      options: [
        "Poured down the street stormwater drain",
        "Buried in your backyard garden soil",
        "Taken to a certified municipal Household Hazardous Waste (HHW) collection facility",
        "Burned inside an open barrel"
      ],
      correctIndex: 2,
      explanation: "Storm drains lead directly to local rivers and groundwater. Only certified Household Hazardous Waste (HHW) facilities have the specialized high-temperature kilns to neutralize hazardous chemical compounds."
    }
  ]
};

/**
 * Returns quiz questions for category with fallback
 * @param {string} category
 * @returns {Array} Array of 3 questions
 */
export function getQuizForCategory(category) {
  const clean = (category || "").toLowerCase().trim();
  return QUIZ_QUESTIONS[clean] || QUIZ_QUESTIONS.plastic;
}
