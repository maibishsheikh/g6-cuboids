# CuboidQuest (Grade 6 Mathematics)

**CuboidQuest** is a Grade 6 gamified mathematics learning module aligned with the Singapore MOE Primary 6 "Volume of Cube and Cuboid" strand:
- Calculating cuboid volume from length, breadth, and height ($V = l \times b \times h$)
- Relating volume to base area and height ($V = \text{Base Area} \times \text{Height}$)
- Working *backwards* using division to find a missing height ($\text{Height} = \text{Volume} \div \text{Base Area}$) or unknown dimension
- Finding the area of a face given volume and one dimension
- Connecting volume to liquid capacity ($1\text{ cm}^3 = 1\text{ ml}$, $1000\text{ cm}^3 = 1\text{ Litre}$) and calculating water depth in rectangular tanks
- Multi-step packing, comparing, and error-detection problems

---

## 1. Architectural Lineage & Clone Source
- **Clone Source:** `G2-Money-Money-main` (MoneyQuest architecture).
- **Dead Code Cleaned:** Unused `src/features/*` duplicate code path and unused core directories purged.
- **Story Panel Generalization:** Generalizes `App.jsx` reducer to dynamically handle all 5 story panels (`STORY_PANELS.length - 1`) instead of the reference's hardcoded 4-panel assumption.
- **Viewport Clipping Fix:** Dynamically measures header height with a `ResizeObserver` and applies `calc(100dvh - var(--header-h))` to prevent any visual clipping on mobile viewports.
- **Procedural Question Bank:** 100 questions procedurally generated from verified templates across 10 worlds with 100% whole-number reverse arithmetic and zero cube leakage.

---

## 2. Five-Phase Learning Architecture

1. **Wonder:** The depot packing dilemma hook — can a $20 \times 10 \times 8\text{ cm}$ box hold 2 litres of fish food?
2. **Story:** *Rina & Wei Jie's Box & Parcel Depot* (5 panels)
   - Panel 1: *A Box Too Big* (Volume as 3D space)
   - Panel 2: *Six Faces, Three Numbers* (Cuboid net & dimensions)
   - Panel 3: *Layer by Layer* (Base Area $\times$ Height)
   - Panel 4: *Working Backwards* (Division to recover missing edges)
   - Panel 5: *Fill the Tank* (Capacity: $\text{cm}^3$, $\text{ml}$, Litres, water depth)
3. **Simulate:** 4 interactive laboratories
   - **Station A — Unfold & Fill Lab:** Concept discovery with 6-face net unfolding and unit cube layer-by-layer stacking.
   - **Station B — Custom Crate Builder:** Build-to-target challenge hitting exact volume & base area targets with multiple dimension solutions.
   - **Station C — Aquarium Fill Mission:** Multi-step composite station sizing aquarium base, pouring water with jugs, and calculating water height.
   - **Station D — Packing Slip Detective:** Error-detective spotting unit errors ($\text{cm}^2$ vs $\text{cm}^3$), operation reversals ($\times$ vs $\div$), and wrong divisors.
4. **Practice:** 10 themed worlds (10 questions each = 100 questions) + 10 Boss Battles with lives and reward badges.
5. **Reflect:** 3 conceptual recap questions targeting core misconceptions + scorecard and trophy display.

---

## 3. Story Phase Art Brief (5 Panels at 2000 × 800 px)

- **Panel 1 — A Box Too Big:**
  - *Scene:* Busy neighbourhood packing depot with cardboard boxes and parcel scales.
  - *Characters:* Rina (sharp, holding clipboard), Wei Jie (hefting an oversized cardboard carton), Bo the Beaver (holding a wooden measuring rule).
  - *Key Prop:* Large oversized brown cardboard box with fish food packet.
  - *Mood:* Curious, inviting, workshop atmosphere.

- **Panel 2 — Six Faces, Three Numbers:**
  - *Scene:* Workshop floor workbench.
  - *Characters:* Bo the Beaver flattening a cardboard box; Rina with chalk labeling edges.
  - *Key Prop:* Flattened 6-face cross net of a cuboid showing rectangular faces.
  - *Mood:* Discovery, analytical, hands-on.

- **Panel 3 — Layer by Layer:**
  - *Scene:* Depot packaging station.
  - *Characters:* Wei Jie placing wooden $1\text{ cm}$ unit cubes in neat rows on the carton base.
  - *Key Prop:* Transparent acrylic box showing a base grid of 24 cubes and 3 vertical layers forming 72 cubes.
  - *Mood:* Enlightening, structural, satisfying.

- **Panel 4 — Working Backwards:**
  - *Scene:* Depot loading dock.
  - *Characters:* Rina solving the missing dimension calculation on a shipping docket; Wei Jie measuring the crate.
  - *Key Prop:* Wooden shipping crate stamped "$960\text{ cm}^3$" with a smudge over the height label.
  - *Mood:* Focused, problem-solving, triumphant.

- **Panel 5 — Fill the Tank:**
  - *Scene:* Depot receiving bay next door to the pet shop.
  - *Characters:* Rina, Wei Jie, and Bo pouring clear water into a rectangular glass display aquarium.
  - *Key Prop:* Clean rectangular aquarium with centimetre water level markings and water jugs ($1\text{ L}$, $500\text{ ml}$).
  - *Mood:* Celebratory, master packaging depot ready for business!

---

## 4. Running Locally

```bash
# Navigate to directory
cd cuboid-main

# Install dependencies
npm install

# Run automated QA question bank stress test (300 runs = 30,000 questions)
npm run qa:questions

# Start development dev server
npm run dev

# Run production build validation
npm run build
```
