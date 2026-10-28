# 🌿 EcoFreak AI — Waste today. A cleaner tomorrow.

> **Know what it is. Know where it goes.**  
> An interactive environmental field journal powered by a **Hybrid AI Scanner** combining on-device **Google Teachable Machine (TensorFlow.js)** and **Groq Vision AI (Llama 4 Vision)**.

🌐 **Deployment:** [https://ecoscan-v2.vercel.app/](https://ecoscan-v2.vercel.app/)

---

## 🎨 Visual Identity & Scrapbook Field Journal Aesthetic

EcoFreak AI is designed from the ground up to reflect an authentic environmental field journal, inspired by vintage botanist scrapbooks and tactile materials:
- **Earthy Natural Palette**: Warm cream/parchment (`#FAF6EE`), recycled kraft paper (`#CDB089`), weathered wood (`#5D4F41`), forest green (`#2F4F35`), olive leaf (`#6D7F4F`), terracotta rust (`#B85C38`), and muted sky teal (`#88B0A8`).
- **Tactile Details**: Layered parchment cards, washi tape corners, deckled edges, subtle paper drop shadows, and authentic field rubber stamps (*"SORT TODAY • CLEANER TOMORROW"*, *"THERE IS NO PLANET B"*).
- **Vintage Editorial Typography**: Bold serif titles (`DM Serif Display`), readable body text (`DM Sans`), handwritten annotations (`Caveat`), and typewriter accents (`Special Elite`).
- **Specimen Polaroids**: Waste items framed as specimens with authenticity indicators (physical camera photo vs. digital screenshot).

---

## ⚙️ Hybrid AI Scanner — Dual Engine Architecture

EcoFreak AI uses **both on-device TensorFlow.js and cloud-based Groq Vision AI**, with distinct responsibilities:

```
[ Camera Stream / Uploaded Specimen ]
                  │
                  ▼
   ┌────────────────────────────────────────┐
   │ Stage A: On-Device Inference (TF.js)   │
   │ - Model: 19-class MobileNetV2          │
   │ - Runs 100% locally in browser         │
   │ - Throttled live frame predictions     │
   │ - Zero bandwidth, instant edge pill    │
   └────────────────────────────────────────┘
                  │
                  │ Frame capture + TF.js context
                  ▼
   ┌────────────────────────────────────────┐
   │ Stage B: Groq Vision AI (Cloud)        │
   │ - Model: Llama 4 Scout (17B Vision)    │
   │ - Deep semantic visual examination     │
   │ - Informed by TF.js hypothesis         │
   │ - Final classification authority       │
   └────────────────────────────────────────┘
                  │
                  ▼
   ┌────────────────────────────────────────┐
   │ Stage C: Synthesis & Transparent Report│
   │ - Groq final object & category result  │
   │ - TF.js preliminary comparison badge   │
   │ - Transparent variance reporting       │
   │ - Full carbon lifecycle calculations   │
   └────────────────────────────────────────┘
```

### Stage A: Live Edge Camera Inference with TensorFlow.js
- **Model Files Placement**: Located in `public/model/`:
  - `model.json` (MobileNetV2 topology)
  - `metadata.json` (19 class labels, 224×224 input size)
  - `weights.bin` (Binary model weights)
- **19 Trained Classes**:
  `Plastic`, `Glasses`, `Trash`, `Shoes`, `Paper`, `Metal`, `Clothes`, `Cardboard`, `Food Waste`, `Battery`, `Mobile`, `Keyboard`, `Mouse`, `TV`, `PCB`, `Leaf`, `Wood Waste`, `Plastic bags`, `Leather`.
- **Center-Crop & Normalized Preprocessing**: Center-crops video frames to square, resizes to 224×224, and normalizes pixel values to `[-1, 1]` via `.div(127.5).sub(1)` to strictly match MobileNet training expectations.
- **Stateful Confidence Gate with Hysteresis**: Requires 5 consecutive stable frames (≥80% confidence, ≥20% margin between top-2 classes) to lock onto a class, and requires 8 consecutive non-matching frames before releasing the lock. Completely eliminates false-positive HUD flickering!
- **Resource Cleanup**: WebGL tensors (`tf.tidy()`) and camera media streams are automatically disposed of when scanning closes or unmounts.

### Stage B: Capture & Final Groq Cloud Classification
- On pressing the shutter capture button, the high-resolution frame is drawn to canvas and evaluated by TensorFlow.js to capture the freshest prediction.
- The compressed JPEG and the TF.js prediction context are submitted to `/api/classify`.
- The Groq vision model independently analyzes the image with the TF.js prediction as secondary clue, producing the final structured result (`wasteType`, `itemName`, `confidence`, `reason`, `isScreenshot`, `estimatedMaterial`, `estimatedWeightG`).

### Stage C: Transparent Disagreement Handling
- **Groq is the final authority**; TensorFlow.js provides edge hypotheses and context.
- If the two models disagree (e.g. TF.js detects "Trash", Groq resolves "Aluminium Soda Can"), the field report highlights both observations clearly without artificially averaging confidence scores.

---

## 📁 Model File Placement

To update or replace the TensorFlow.js model, export an **Image Model** from Google Teachable Machine (Tensorflow.js format) and place the three exported files into:

```text
public/
└── model/
    ├── metadata.json
    ├── model.json
    └── weights.bin
```

---

## 🛠️ Tech Stack & Dependencies

| Layer | Technology |
| --- | --- |
| **Frontend Framework** | React 19, Vite 7, Tailwind CSS 3 |
| **Edge AI Engine** | TensorFlow.js 4.22 + `@teachablemachine/image` 0.8.5 |
| **Cloud Vision AI** | Meta Llama 4 Scout 17B via Groq API (`meta-llama/llama-4-scout-17b-16e-instruct`) |
| **Lifecycle Science** | UK DESNZ/DEFRA 2024 & US EPA WARM emission factors |
| **Backend & Routing** | Vercel Serverless Functions (`api/classify.js`, `api/carbon-estimate.js`) |
| **Test Suite** | Vitest 5.0 (58 automated unit & integration tests) |

---

## 🧪 Testing & Verification

EcoFreak AI includes 52 automated tests covering:
- Mass-to-emissions lifecycle mathematics & unit conversions
- Hazard assessments & handling safety protocols
- Simulation pathway step progressions & quiz mechanics
- Model label mapping across all 19 Teachable Machine classes
- Hybrid AI model agreement and transparent disagreement handling

```bash
# Run unit & integration tests
npm test

# Build production bundle
npm run build
```

---

## 🔐 Environment Configuration

Copy `.env.example` to `.env.local` and configure your Groq API key:

```bash
GROQ_API_KEY=gsk_your_groq_api_key_here
```

*Note: In local development when `GROQ_API_KEY` is not set, EcoFreak AI automatically switches to offline demo simulation mode so all UI and edge AI features can be tested.*

---

## 📄 License

© 2026 EcoFreak AI. Personal and educational use.
