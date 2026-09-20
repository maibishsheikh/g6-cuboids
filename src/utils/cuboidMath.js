// src/utils/cuboidMath.js
// Single source of truth for all cuboid arithmetic and constraints

// ——— Curated pools (PRD §9.2) ———
export const DIM_POOL       = [2, 3, 4, 5, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20];
export const LARGE_DIM_POOL = [25, 30, 40, 50, 60];          // tanks, vans
export const METRE_POOL     = [1, 2, 3, 4, 5, 6, 8, 10];        // m³ questions only

// ——— Core formulas ———
export const volume        = (l, b, h) => l * b * h;
export const baseArea      = (l, b)    => l * b;
export const heightFromVB  = (v, area) => v / area;       // LO 4: h = V ÷ base area
export const dimFromVolume = (v, d1, d2) => v / (d1 * d2);// LO 5: missing dimension
export const faceAreaFromV = (v, d)    => v / d;          // LO 6: face area = V ÷ perpendicular dim

// ——— Capacity ———
export const cm3ToMl    = (cm3) => cm3;                   // 1 cm³ = 1 ml
export const cm3ToLitre = (cm3) => cm3 / 1000;
export const litreToCm3 = (l)   => l * 1000;
export const waterHeight = (volCm3, area) => volCm3 / area;

// ——— Packing ———
export const fitsPerAxis = (outer, inner) => [
  outer.l / inner.l,
  outer.b / inner.b,
  outer.h / inner.h,
];

export const packCount = (outer, inner) =>
  fitsPerAxis(outer, inner).reduce((a, n) => a * Math.floor(n), 1);

// ——— Clean-number guards (HARD CONSTRAINTS) ———
// Cubes are explicitly excluded from generation (belongs to CubeQuest)
export const isCube = (l, b, h) => l === b && b === h;

// Area factorizes cleanly into 2 pool dimensions
export const isPoolProduct = (area) =>
  DIM_POOL.some(a => area % a === 0 && DIM_POOL.includes(area / a));

// Every axis divides exactly (no fractional or non-fitting leftover along any dimension)
export const packsExactly = (outer, inner) =>
  fitsPerAxis(outer, inner).every(r => Number.isInteger(r) && r >= 1);

// Capacity division results in a clean whole number
export const isWholeHeight = (volCm3, area) =>
  area > 0 && volCm3 % area === 0;

// ——— Utility helpers ———
export const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Generate a valid cuboid triple (l, b, h), strictly rejecting cubes
export const pickTriple = (pool = DIM_POOL) => {
  let l, b, h;
  let attempts = 0;
  do {
    l = pickRandom(pool);
    b = pickRandom(pool);
    h = pickRandom(pool);
    attempts++;
  } while (isCube(l, b, h) && attempts < 100);

  if (isCube(l, b, h)) {
    // Failsafe fallback
    h = pool.find(d => d !== l) || (l + 1);
  }
  return [l, b, h];
};
