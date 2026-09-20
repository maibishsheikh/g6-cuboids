// src/data/questionBank.js
// Procedural Question Bank for CuboidQuest (100 questions across 10 worlds)
import { WORLDS } from '../config/worlds.config.js';
import {
  DIM_POOL,
  LARGE_DIM_POOL,
  METRE_POOL,
  volume,
  baseArea,
  heightFromVB,
  dimFromVolume,
  faceAreaFromV,
  waterHeight,
  packsExactly,
  packCount,
  pickTriple,
  pickRandom,
  isCube,
} from '../utils/cuboidMath.js';

// Export DISTRICTS derived from WORLDS for PlayPhase compatibility
export const DISTRICTS = WORLDS.map((w) => ({
  id: w.id,
  name: w.name,
  icon: w.emoji,
  boss: w.boss,
}));

// Whitelist registry of intentional wrong-unit distractors for QA scanner
export const UNIT_DISTRACTOR_REGISTRY = new Set();

function registerUnitDistractor(str) {
  UNIT_DISTRACTOR_REGISTRY.add(str);
  return str;
}

// Helper to shuffle options
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Assemble 4 distinct options from correct answer and candidates
function buildOptions(correctAnswer, candidates) {
  const unique = [correctAnswer];
  for (const c of candidates) {
    const str = String(c).trim();
    if (str && !unique.includes(str)) {
      unique.push(str);
    }
    if (unique.length === 4) break;
  }

  // Failsafe fallback if candidates didn't produce 4 distinct options
  let fallbackCounter = 1;
  while (unique.length < 4) {
    const numPart = parseInt(correctAnswer, 10);
    const unitPart = correctAnswer.replace(/[0-9\s]/g, '');
    const alt = !isNaN(numPart)
      ? `${numPart + fallbackCounter * 5} ${unitPart}`.trim()
      : `${correctAnswer} ${fallbackCounter}`;
    if (!unique.includes(alt)) {
      unique.push(alt);
    }
    fallbackCounter++;
  }

  return shuffle(unique);
}

// ─── World 0: Box Basics Bay (volume-forward) ──────────────────────────────
export function genVolumeForward(qId, districtId) {
  const [l, b, h] = pickTriple([3, 4, 5, 6, 8, 10]);
  const v = volume(l, b, h);
  const correct = `${v} cm³`;

  const distSum = `${l + b + h} cm³`; // Added dims
  const distBase = `${l * b} cm³`; // 2 dims only
  const distSA = `${2 * (l * b + b * h + l * h)} cm³`; // Surface area
  const distWrongUnit = registerUnitDistractor(`${v} cm²`);

  const questionText = `A gift box measures ${l} cm long, ${b} cm broad, and ${h} cm high. What is its volume?`;
  const explanation = `Volume of a cuboid = length × breadth × height = ${l} × ${b} × ${h} = ${v} cm³.`;

  return {
    id: qId,
    districtId,
    category: 'VOLUME FORMULA',
    visual: 'isoCuboid',
    questionText,
    options: buildOptions(correct, [distSum, distBase, distSA, distWrongUnit]),
    correctAnswer: correct,
    explanation,
    hint1: 'Multiply all three dimensions: length × breadth × height.',
    hint2: `Multiply the base area (${l} × ${b} = ${l * b}) by the height (${h}) to get ${v} cm³.`,
    visualData: { l, b, h, unit: 'cm' },
  };
}

// ─── World 1: Parcel Packing Plant (volume-units) ──────────────────────────
export function genVolumeUnits(qId, districtId) {
  const isMetres = Math.random() < 0.35;
  if (isMetres) {
    const [l, b, h] = pickTriple(METRE_POOL.slice(0, 6));
    const v = volume(l, b, h);
    const correct = `${v} m³`;
    const distSum = `${l + b + h} m³`;
    const distBase = `${l * b} m³`;
    const distWrongUnit = registerUnitDistractor(`${v} m²`);
    const distCm = `${v} cm³`;

    const questionText = `A storage container in the depot has length ${l} m, breadth ${b} m, and height ${h} m. Find its volume in cubic metres.`;
    const explanation = `Volume = length × breadth × height = ${l} m × ${b} m × ${h} m = ${v} m³.`;

    return {
      id: qId,
      districtId,
      category: 'CUBIC METRES',
      visual: 'isoCuboid',
      questionText,
      options: buildOptions(correct, [distSum, distBase, distWrongUnit, distCm]),
      correctAnswer: correct,
      explanation,
      hint1: 'Use length × breadth × height with cubic metres (m³).',
      hint2: `${l} × ${b} × ${h} = ${v} m³.`,
      visualData: { l, b, h, unit: 'm' },
    };
  }

  const [l, b, h] = pickTriple([10, 12, 14, 15, 16, 20]);
  const v = volume(l, b, h);
  const correct = `${v} cm³`;
  const distWrongUnit = registerUnitDistractor(`${v} cm²`);
  const distBase = `${l * b} cm³`;
  const distSum = `${l + b + h} cm³`;

  const questionText = `A postal carton measures ${l} cm by ${b} cm by ${h} cm. What is its volume in cubic centimetres?`;
  const explanation = `Volume = ${l} × ${b} × ${h} = ${v} cm³.`;

  return {
    id: qId,
    districtId,
    category: 'VOLUME UNITS',
    visual: 'isoCuboid',
    questionText,
    options: buildOptions(correct, [distWrongUnit, distBase, distSum]),
    correctAnswer: correct,
    explanation,
    hint1: 'Volume is space inside, measured in cubic centimetres (cm³).',
    hint2: `${l} × ${b} = ${l * b}, then ${l * b} × ${h} = ${v} cm³.`,
    visualData: { l, b, h, unit: 'cm' },
  };
}

// ─── World 2: Base Area Bakery (base-area-forward) ─────────────────────────
export function genBaseAreaForward(qId, districtId) {
  const [l, b, h] = pickTriple([4, 5, 6, 8, 9, 10, 12]);
  const area = baseArea(l, b);
  const v = area * h;

  const askForBase = Math.random() < 0.4;
  if (askForBase) {
    const correct = `${area} cm²`;
    const distSum = `${l + b} cm²`;
    const distVol = `${v} cm²`;
    const distWrongUnit = registerUnitDistractor(`${area} cm³`);

    const questionText = `A rectangular carton has a length of ${l} cm and a breadth of ${b} cm. Find its base area.`;
    const explanation = `Base area = length × breadth = ${l} × ${b} = ${area} cm².`;

    return {
      id: qId,
      districtId,
      category: 'BASE AREA',
      visual: 'baseHighlight',
      questionText,
      options: buildOptions(correct, [distSum, distVol, distWrongUnit]),
      correctAnswer: correct,
      explanation,
      hint1: 'Base area is a 2D surface: length × breadth in cm².',
      hint2: `Multiply ${l} by ${b} to get ${area} cm².`,
      visualData: { l, b, h, area, unit: 'cm' },
    };
  }

  const correct = `${v} cm³`;
  const distSum = `${area + h} cm³`;
  const distDiv = `${Math.round(area / h)} cm³`;
  const distWrongUnit = registerUnitDistractor(`${v} cm²`);

  const questionText = `A parcel has a base area of ${area} cm² and a height of ${h} cm. What is its volume?`;
  const explanation = `Volume = base area × height = ${area} × ${h} = ${v} cm³.`;

  return {
    id: qId,
    districtId,
    category: 'BASE AREA × HEIGHT',
    visual: 'baseHighlight',
    questionText,
    options: buildOptions(correct, [distSum, distDiv, distWrongUnit]),
    correctAnswer: correct,
    explanation,
    hint1: 'Volume = base area × height.',
    hint2: `${area} × ${h} = ${v} cm³.`,
    visualData: { l, b, h, area, unit: 'cm' },
  };
}

// ─── World 3: Missing Height Hangar (height-reverse) ───────────────────────
export function genHeightReverse(qId, districtId) {
  const [l, b, h] = pickTriple([5, 6, 8, 10, 12, 15]);
  const area = baseArea(l, b);
  const v = area * h;

  const correct = `${h} cm`;
  const distMult = `${area * v} cm`; // Multiplied instead of divided
  const distSub = `${v - area} cm`; // Subtracted
  const distWrongUnit = registerUnitDistractor(`${h} cm²`);
  const distHalf = `${Math.round(h * 2)} cm`;

  const questionText = `A crate in the hangar has a volume of ${v} cm³ and a base area of ${area} cm². Find its height.`;
  const explanation = `Height = volume ÷ base area = ${v} ÷ ${area} = ${h} cm.`;

  return {
    id: qId,
    districtId,
    category: 'FIND HEIGHT',
    visual: 'baseHighlight',
    questionText,
    options: buildOptions(correct, [distMult, distSub, distWrongUnit, distHalf]),
    correctAnswer: correct,
    explanation,
    hint1: 'Work backwards: Height = Volume ÷ Base Area.',
    hint2: `Divide ${v} by ${area}: ${v} ÷ ${area} = ${h} cm.`,
    visualData: { l, b, h, area, unit: 'cm' },
  };
}

// ─── World 4: Missing Edge Workshop (dimension-reverse) ────────────────────
export function genDimensionReverse(qId, districtId) {
  const [l, b, h] = pickTriple([4, 5, 6, 8, 10, 12]);
  const v = volume(l, b, h);
  const hidden = pickRandom(['l', 'b', 'h']);

  let correctNum = h;
  let d1 = l, d2 = b;
  let targetName = 'height';
  let d1Name = 'length', d2Name = 'breadth';

  if (hidden === 'l') {
    correctNum = l;
    d1 = b; d2 = h;
    targetName = 'length';
    d1Name = 'breadth'; d2Name = 'height';
  } else if (hidden === 'b') {
    correctNum = b;
    d1 = l; d2 = h;
    targetName = 'breadth';
    d1Name = 'length'; d2Name = 'height';
  }

  const correct = `${correctNum} cm`;
  const distDivOne = `${Math.round(v / d1)} cm`; // Divided by one dim only
  const distMult = `${d1 * d2} cm`; // Multiplied known dims
  const distWrongUnit = registerUnitDistractor(`${correctNum} cm³`);
  const distAdded = `${Math.abs(v - (d1 * d2))} cm`;

  const questionText = `A box has a volume of ${v} cm³. Its ${d1Name} is ${d1} cm and its ${d2Name} is ${d2} cm. Find its ${targetName}.`;
  const explanation = `${targetName} = volume ÷ (${d1Name} × ${d2Name}) = ${v} ÷ (${d1} × ${d2}) = ${v} ÷ ${d1 * d2} = ${correctNum} cm.`;

  return {
    id: qId,
    districtId,
    category: 'FIND MISSING EDGE',
    visual: 'isoCuboidMasked',
    questionText,
    options: buildOptions(correct, [distDivOne, distMult, distWrongUnit, distAdded]),
    correctAnswer: correct,
    explanation,
    hint1: `First find the area of the known face (${d1Name} × ${d2Name}), then divide the volume by it.`,
    hint2: `${d1} × ${d2} = ${d1 * d2}. Then ${v} ÷ ${d1 * d2} = ${correctNum} cm.`,
    visualData: { l, b, h, unit: 'cm', hidden },
  };
}

// ─── World 5: Face Finder Studio (face-area-reverse) ───────────────────────
export function genFaceAreaReverse(qId, districtId) {
  const [l, b, h] = pickTriple([5, 6, 8, 10, 12, 14]);
  const v = volume(l, b, h);
  const perpDim = l; // Length across from end face (b x h)
  const faceArea = b * h;

  const correct = `${faceArea} cm²`;
  const distLengthUnit = registerUnitDistractor(`${faceArea} cm`); // Error detective unit misconception
  const distMult = `${v * perpDim} cm²`;
  const distSub = `${v - perpDim} cm²`;
  const distPerp = `${perpDim} cm²`;

  const questionText = `The volume of a cuboid is ${v} cm³ and its length is ${perpDim} cm. Find the area of the shaded face perpendicular to its length.`;
  const explanation = `Area of face = volume ÷ perpendicular dimension = ${v} ÷ ${perpDim} = ${faceArea} cm².`;

  return {
    id: qId,
    districtId,
    category: 'FIND FACE AREA',
    visual: 'faceHighlight',
    questionText,
    options: buildOptions(correct, [distLengthUnit, distMult, distSub, distPerp]),
    correctAnswer: correct,
    explanation,
    hint1: 'Face Area = Volume ÷ the perpendicular dimension across from it.',
    hint2: `Divide ${v} by ${perpDim}: ${v} ÷ ${perpDim} = ${faceArea} cm².`,
    visualData: { l, b, h, face: 'side', unit: 'cm' },
  };
}

// ─── World 6: Aquarium & Tank Lane (capacity-tank) ─────────────────────────
export function genCapacityTank(qId, districtId) {
  let l = pickRandom([20, 25, 30, 40]);
  let b = pickRandom([10, 15, 20, 25]);
  while (l === b) {
    b = pickRandom([10, 15, 20, 25]);
  }
  const area = l * b;
  const targetH = pickRandom([4, 5, 6, 8, 10, 12]);
  let tankH = targetH + 5;
  while (isCube(l, b, tankH)) {
    tankH += 5;
  }
  const waterVolCm3 = area * targetH;
  const waterLitres = waterVolCm3 / 1000;

  const askForHeight = Math.random() < 0.6;
  if (askForHeight) {
    const correct = `${targetH} cm`;
    const distFlipped = `${targetH * 10} cm`; // Dropped a zero
    const distWrongUnit = registerUnitDistractor(`${targetH} cm²`);
    const distLitres = `${waterLitres} cm`;

    const questionText = `A rectangular aquarium has a base measuring ${l} cm by ${b} cm. If ${waterLitres} litres of water are poured inside, find the height of the water.`;
    const explanation = `Base area = ${l} × ${b} = ${area} cm². ${waterLitres} L = ${waterVolCm3} cm³. Water height = ${waterVolCm3} ÷ ${area} = ${targetH} cm.`;

    return {
      id: qId,
      districtId,
      category: 'WATER HEIGHT IN TANK',
      visual: 'tankWater',
      questionText,
      options: buildOptions(correct, [distFlipped, distWrongUnit, distLitres]),
      correctAnswer: correct,
      explanation,
      hint1: 'Convert litres to cm³ first: 1 litre = 1000 cm³. Then divide by base area.',
      hint2: `Base area is ${area} cm². ${waterLitres} L = ${waterVolCm3} cm³. ${waterVolCm3} ÷ ${area} = ${targetH} cm.`,
      visualData: { l, b, h: tankH, waterHeight: targetH, waterCm3: waterVolCm3 },
    };
  }

  // Ask for capacity in litres
  const correct = `${waterLitres} litres`;
  const distNoConv = `${waterVolCm3} litres`;
  const distHalf = `${waterLitres / 2} litres`;
  const distDouble = `${waterLitres * 2} litres`;

  const questionText = `A rectangular glass tank with base ${l} cm by ${b} cm is filled with water to a depth of ${targetH} cm. How many litres of water are in the tank?`;
  const explanation = `Water volume = ${l} × ${b} × ${targetH} = ${waterVolCm3} cm³. Since 1000 cm³ = 1 litre, ${waterVolCm3} ÷ 1000 = ${waterLitres} litres.`;

  return {
    id: qId,
    districtId,
    category: 'TANK CAPACITY',
    visual: 'tankWater',
    questionText,
    options: buildOptions(correct, [distNoConv, distHalf, distDouble]),
    correctAnswer: correct,
    explanation,
    hint1: 'Find the volume in cm³ (l × b × water height), then divide by 1000 to convert to litres.',
    hint2: `${l} × ${b} × ${targetH} = ${waterVolCm3} cm³ = ${waterLitres} litres.`,
    visualData: { l, b, h: tankH, waterHeight: targetH, waterCm3: waterVolCm3 },
  };
}

// ─── World 7: Stack & Store Yard (packing-multistep) ───────────────────────
export function genPackingMultistep(qId, districtId) {
  // Ensure dimensional fit: outer dims must be exact integer multiples of inner dims
  const inner = {
    l: pickRandom([4, 5, 6, 8, 10]),
    b: pickRandom([2, 3, 4, 5]),
    h: pickRandom([2, 3, 4]),
  };

  const multL = pickRandom([2, 3, 4]);
  const multB = pickRandom([2, 3, 4]);
  const multH = pickRandom([2, 3, 4]);

  const outer = {
    l: inner.l * multL,
    b: inner.b * multB,
    h: inner.h * multH,
  };

  const totalBoxes = multL * multB * multH;
  const correct = `${totalBoxes}`;
  const distOneAxis = `${multL * multB}`;
  const distHalf = `${Math.round(totalBoxes / 2)}`;
  const distDouble = `${totalBoxes * 2}`;
  const distSum = `${multL + multB + multH}`;

  const questionText = `Boxes measuring ${inner.l} cm by ${inner.b} cm by ${inner.h} cm are packed into a carton measuring ${outer.l} cm by ${outer.b} cm by ${outer.h} cm with no gaps. How many boxes can fit?`;
  const explanation = `Along length: ${outer.l} ÷ ${inner.l} = ${multL}. Along breadth: ${outer.b} ÷ ${inner.b} = ${multB}. Along height: ${outer.h} ÷ ${inner.h} = ${multH}. Total boxes = ${multL} × ${multB} × ${multH} = ${totalBoxes}.`;

  return {
    id: qId,
    districtId,
    category: 'PACKING BOXES',
    visual: 'stackGrid',
    questionText,
    options: buildOptions(correct, [distOneAxis, distHalf, distDouble, distSum]),
    correctAnswer: correct,
    explanation,
    hint1: 'Divide each dimension of the carton by the corresponding dimension of the small box.',
    hint2: `${multL} along length × ${multB} along breadth × ${multH} along height = ${totalBoxes} boxes.`,
    visualData: { outer, inner, count: totalBoxes },
  };
}

// ─── World 8: Compare & Decide Corner (compare-reason) ─────────────────────
export function genCompareReason(qId, districtId) {
  let a, b, vA, vB;
  let attempts = 0;
  do {
    const [l1, b1, h1] = pickTriple([4, 5, 6, 8, 10, 12]);
    const [l2, b2, h2] = pickTriple([4, 5, 6, 8, 10, 12]);
    vA = volume(l1, b1, h1);
    vB = volume(l2, b2, h2);
    a = { l: l1, b: b1, h: h1, name: 'Box A' };
    b = { l: l2, b: b2, h: h2, name: 'Box B' };
    attempts++;
  } while (vA === vB && attempts < 50);

  const diff = Math.abs(vA - vB);
  const bigger = vA > vB ? 'Box A' : 'Box B';
  const smaller = vA > vB ? 'Box B' : 'Box A';

  const correct = `${bigger}, by ${diff} cm³`;
  const distFlipped = `${smaller}, by ${diff} cm³`; // Direction flipped
  const distSame = 'They hold the exact same volume';
  const distDimSumDiff = `${bigger}, by ${Math.abs((a.l + a.b + a.h) - (b.l + b.b + b.h))} cm³`;

  const questionText = `Box A measures ${a.l} cm by ${a.b} cm by ${a.h} cm. Box B measures ${b.l} cm by ${b.b} cm by ${b.h} cm. Which box has a greater volume, and by how much?`;
  const explanation = `Volume of Box A = ${a.l} × ${a.b} × ${a.h} = ${vA} cm³. Volume of Box B = ${b.l} × ${b.b} × ${b.h} = ${vB} cm³. Difference = ${Math.max(vA, vB)} − ${Math.min(vA, vB)} = ${diff} cm³. Therefore, ${bigger} holds more by ${diff} cm³.`;

  return {
    id: qId,
    districtId,
    category: 'COMPARE VOLUMES',
    visual: 'comparePair',
    questionText,
    options: buildOptions(correct, [distFlipped, distSame, distDimSumDiff]),
    correctAnswer: correct,
    explanation,
    hint1: 'Calculate the volume of each box first, then find the difference.',
    hint2: `Box A is ${vA} cm³ and Box B is ${vB} cm³. Subtract the smaller from the larger.`,
    visualData: { a, b },
  };
}

// ─── World 9: Grand Depot Finale (mixed-review) ────────────────────────────
export function genMixedReview(qId, districtId) {
  // Rotate through advanced multi-step problem archetypes
  const subType = qId % 4;

  if (subType === 0) {
    // Half-filled tank: how much more to fill completely
    const l = 40, b = 25, h = 30;
    const totalCap = volume(l, b, h); // 30,000 cm3 = 30 L
    const halfCapLitres = totalCap / 2000; // 15 L

    const correct = `${halfCapLitres} litres`;
    const distFull = `${totalCap / 1000} litres`;
    const distQuarter = `${halfCapLitres / 2} litres`;
    const distNoConv = `${totalCap / 2} litres`;

    const questionText = `A depot tank measuring ${l} cm by ${b} cm by ${h} cm is half filled with water. How many more litres of water are needed to fill it completely?`;
    const explanation = `Total tank capacity = ${l} × ${b} × ${h} = ${totalCap} cm³ = ${totalCap / 1000} litres. Half the tank is empty, so ${totalCap / 1000} ÷ 2 = ${halfCapLitres} litres are needed.`;

    return {
      id: qId,
      districtId,
      category: 'DEPOT FINALE · HALF-FILLED TANK',
      visual: 'tankWater',
      questionText,
      options: buildOptions(correct, [distFull, distQuarter, distNoConv]),
      correctAnswer: correct,
      explanation,
      hint1: 'Calculate total volume in litres, then divide by 2 for the remaining empty half.',
      hint2: `Total volume = ${totalCap / 1000} litres. Half of ${totalCap / 1000} is ${halfCapLitres} litres.`,
      visualData: { l, b, h, waterHeight: h / 2, waterCm3: totalCap / 2 },
    };
  }

  if (subType === 1) {
    // Reverse dimension from known volume
    return genDimensionReverse(qId, districtId);
  }

  if (subType === 2) {
    // Packing problem
    return genPackingMultistep(qId, districtId);
  }

  // Capacity reverse problem
  return genCapacityTank(qId, districtId);
}

// ─── Procedural Question Bank Builder (100 questions) ──────────────────────
export function generateQuestionBank() {
  const bank = [];
  let qId = 0;

  for (let w = 0; w < 10; w++) {
    for (let i = 0; i < 10; i++) {
      let q;
      switch (w) {
        case 0: q = genVolumeForward(qId, w); break;
        case 1: q = genVolumeUnits(qId, w); break;
        case 2: q = genBaseAreaForward(qId, w); break;
        case 3: q = genHeightReverse(qId, w); break;
        case 4: q = genDimensionReverse(qId, w); break;
        case 5: q = genFaceAreaReverse(qId, w); break;
        case 6: q = genCapacityTank(qId, w); break;
        case 7: q = genPackingMultistep(qId, w); break;
        case 8: q = genCompareReason(qId, w); break;
        case 9: q = genMixedReview(qId, w); break;
        default: q = genVolumeForward(qId, w); break;
      }
      bank.push(q);
      qId++;
    }
  }

  return bank;
}

// Export pre-generated default bank instance
const questionBank = generateQuestionBank();
export default questionBank;
