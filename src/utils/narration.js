// src/utils/narration.js
// Narration script builder for CuboidQuest
// Strictly matches on-screen text 1:1 and normalizes mathematical notation to full natural speech

// Pre-emit normalizer mapping symbols and abbreviations to spoken words (PRD §11, TRD §9.2)
export function normalizeSpokenText(text) {
  if (!text || typeof text !== 'string') return text;

  let s = text;

  // Replace symbols and unit notations
  s = s.replace(/(\d+)\s*cm³/gi, (m, d) => (d === '1' ? 'one cubic centimetre' : `${d} cubic centimetres`));
  s = s.replace(/cm³|cm3/gi, 'cubic centimetres');

  s = s.replace(/(\d+)\s*m³/gi, (m, d) => (d === '1' ? 'one cubic metre' : `${d} cubic metres`));
  s = s.replace(/m³|m3/gi, 'cubic metres');

  s = s.replace(/(\d+)\s*cm²/gi, (m, d) => (d === '1' ? 'one square centimetre' : `${d} square centimetres`));
  s = s.replace(/cm²|cm2/gi, 'square centimetres');

  s = s.replace(/(\d+)\s*cm\b/gi, (m, d) => (d === '1' ? 'one centimetre' : `${d} centimetres`));
  s = s.replace(/\bcm\b/gi, 'centimetres');

  s = s.replace(/(\d+)\s*ml\b/gi, (m, d) => (d === '1' ? 'one millilitre' : `${d} millilitres`));
  s = s.replace(/\bml\b/gi, 'millilitres');

  s = s.replace(/(\d+)\s*l\b/gi, (m, d) => (d === '1' ? 'one litre' : `${d} litres`));
  s = s.replace(/(\d+)\s*litres\b/gi, '$1 litres');

  s = s.replace(/×/g, ' multiplied by ');
  s = s.replace(/÷/g, ' divided by ');
  s = s.replace(/=/g, ' equals ');
  s = s.replace(/−/g, ' minus ');

  // Singapore curriculum convention: breadth, never width; base area, never bottom
  s = s.replace(/\bwidth\b/gi, 'breadth');
  s = s.replace(/\bthe bottom\b/gi, 'the base area');

  // Clean up extra spaces
  s = s.replace(/\s+/g, ' ').trim();

  return s;
}

export const say       = (text) => ({ text: normalizeSpokenText(text), style: 'statement' });
export const ask       = (text) => ({ text: normalizeSpokenText(text), style: 'question' });
export const cheer     = (text) => ({ text: normalizeSpokenText(text), style: 'celebration' });
export const emphasize = (text) => ({ text: normalizeSpokenText(text), style: 'emphasis' });
export const think     = (text) => ({ text: normalizeSpokenText(text), style: 'thinking' });
export const instruct  = (text) => ({ text: normalizeSpokenText(text), style: 'instruction' });
export const encourage = (text) => ({ text: normalizeSpokenText(text), style: 'encouragement' });

export function wonderNarration() {
  return [
    say("Welcome to CuboidQuest! Let's investigate the big depot mystery!"),
    say("A customer needs two litres of fish food packed into a shipping box at the depot."),
    ask("Wei Jie grabs a carton measuring twenty centimetres by ten centimetres by eight centimetres. Does this box hold enough volume, or is it too small?"),
    cheer("Let's investigate how to calculate volume and capacity inside a three-dimensional box!"),
  ];
}

export function storyNarration(panel) {
  const scripts = [
    // Panel 0: A Box Too Big
    [
      say("At the neighbourhood Box and Parcel Depot, customer orders are piling up!"),
      say("A customer needs two litres of fish food packed securely for the pet shop next door. Wei Jie grabs a huge cardboard carton from the back shelf. Will this hold it? he asks."),
      say("Rina shakes her head with a smile. How do you know it is the right size without measuring? Neither of them can say for sure."),
      cheer("Bo the Beaver taps his wooden ruler against the bench — it is time to measure the space inside!"),
    ],
    // Panel 1: Six Faces, Three Numbers
    [
      say("Bo grabs a utility knife and carefully cuts along the seams of a carton, unfolding it flat onto the depot floor."),
      say("Look! exclaims Wei Jie. A flat net with six rectangular faces — top, bottom, front, back, and two sides!"),
      say("Rina takes out her chalk and marks the edges. Even though there are six faces, their sizes are decided by just three measurements: Length, Breadth, and Height."),
    ],
    // Panel 2: Layer by Layer
    [
      say("Wei Jie begins lining the bottom of a box with one-centimetre wooden cubes. Along the length, six cubes fit. Along the breadth, four cubes fit."),
      say("Six multiplied by four is twenty-four cubes covering the bottom, Wei Jie calculates. That is the Base Area! notes Rina."),
      say("Next, they stack cubes upwards. Each layer adds another twenty-four cubes. Three layers tall makes twenty-four multiplied by three equals seventy-two cubic centimetres!"),
      cheer("Volume is simply base area multiplied by height!"),
    ],
    // Panel 3: Working Backwards
    [
      say("A wooden delivery crate arrives at the loading dock stamped with a volume of nine hundred and sixty cubic centimetres."),
      say("The shipping label shows a length of twelve centimetres and a breadth of eight centimetres, but the height has rubbed off!"),
      ask("How do we find the missing height? asks Wei Jie."),
      say("Rina smiles: We reverse the multiplication using division! Length multiplied by breadth is ninety-six square centimetres. Nine hundred and sixty divided by ninety-six gives a height of exactly ten centimetres!"),
    ],
    // Panel 4: Fill the Tank
    [
      say("The pet shop owner calls in an urgent order: their new rectangular display aquarium has a base of thirty centimetres by twenty centimetres and needs water filled to an exact depth of twelve centimetres."),
      cheer("Water behaves just like unit cubes! Bo chitters happily. One cubic centimetre holds exactly one millilitre, and one thousand cubic centimetres make one litre."),
      say("With a base area of six hundred square centimetres and a height of twelve centimetres, they pour exactly seven point two litres."),
      cheer("The depot is officially ready for business!"),
    ],
  ];

  return scripts[panel] || scripts[0];
}

export function simStationIntro(stationIdx) {
  const intros = [
    [
      instruct("Welcome to Station A — Unfold and Fill Lab!"),
      instruct("Explore why Volume equals Base Area multiplied by Height. Unfold the carton into a six-face net, or stack cubes layer by layer to see volume grow!"),
    ],
    [
      instruct("Welcome to Station B — Custom Crate Builder!"),
      instruct("Build wooden shipping crates to match customer orders. Adjust the length, breadth, and height sliders to hit exact target volumes!"),
    ],
    [
      instruct("Welcome to Station C — Aquarium Fill Mission!"),
      instruct("Size the aquarium tank base, pour water using litre jugs, and calculate the exact water depth inside a rectangular tank!"),
    ],
    [
      instruct("Welcome to Station D — Packing Slip Detective!"),
      instruct("Three depot shipping slips came back with math mistakes. Tap the incorrect calculation line and choose the correct working to stamp the slip!"),
    ],
  ];

  return intros[stationIdx] || intros[0];
}

export function playQuestionNarration(questionText) {
  return [
    ask(normalizeSpokenText(questionText))
  ];
}

export function playCorrectNarration(streak = 1) {
  if (streak >= 5) {
    return [cheer("Incredible streak! You are a master crate packer! 🔥")];
  }
  if (streak >= 3) {
    return [cheer("Awesome! Three correct in a row! ⭐")];
  }
  return [cheer("Spot on! That calculation is exact! 📦")];
}

export function playWrongNarration() {
  return [
    think("Not quite — check the hint, verify the formula, and try again! 💡")
  ];
}

export function playHint1Narration() {
  return [
    encourage("Here is your first hint! Look at the formula and identify whether you need to multiply or divide.")
  ];
}

export function playHint2Narration() {
  return [
    encourage("Here is your final clue! Break down the arithmetic step by step.")
  ];
}

export function districtCompleteNarration() {
  return [
    cheer("World Complete! Spectacular job conquering this depot district! 🌟")
  ];
}

export function bossStartNarration() {
  return [
    emphasize("The Boss Battle begins! Solve the depot challenges correctly to defeat the boss and claim your reward badge!")
  ];
}

export function bossWinNarration() {
  return [
    cheer("Victory! You defeated the depot boss and earned your reward badge! 🏆")
  ];
}

export function reflectNarration() {
  return [
    say("Welcome to the Reflect Phase! Let's review key cuboid volume and capacity concepts and inspect your depot scorecard! 📓")
  ];
}

export function reflectCompleteNarration() {
  return [
    cheer("Outstanding! You have mastered cuboid volume, reverse dimensions, and liquid capacity! You are a true Master of the Depot! 🏆")
  ];
}
