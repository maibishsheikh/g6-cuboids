// src/components/gamification/KingdomMap.jsx
import React from 'react';
import './KingdomMap.css';
import { calcStars } from '../../utils/scoring.js';
import { DISTRICTS } from '../../data/questionBank.js';
import {
  Box,
  Package,
  Layers,
  Maximize2,
  Wrench,
  Grid,
  Fish,
  Boxes,
  Scale,
  Trophy,
} from 'lucide-react';

// Themed icon for each of the 10 worlds
const WORLD_ICONS = [
  Box,        // W1: Box Basics Bay
  Package,    // W2: Parcel Packing Plant
  Layers,     // W3: Base Area Bakery
  Maximize2,  // W4: Missing Height Hangar
  Wrench,     // W5: Missing Edge Workshop
  Grid,       // W6: Face Finder Studio
  Fish,       // W7: Aquarium & Tank Lane
  Boxes,      // W8: Stack & Store Yard
  Scale,      // W9: Compare & Decide Corner
  Trophy,     // W10: Grand Depot Finale
];

// Stylized Golden Brass Padlock matching the reference design
function GoldenLock({ size = 26 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="world-golden-lock"
      aria-hidden="true"
    >
      {/* Shackle */}
      <path
        d="M7 10.5V6.8C7 4.149 9.239 2 12 2C14.761 2 17 4.149 17 6.8V10.5"
        stroke="#cf9944"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Body */}
      <rect
        x="4"
        y="9.8"
        width="16"
        height="12.5"
        rx="2.8"
        fill="url(#goldLockGrad)"
        stroke="#a2701e"
        strokeWidth="0.8"
      />
      {/* Keyhole */}
      <circle cx="12" cy="14.8" r="1.3" fill="#582a03" />
      <path d="M12 15.8V18.2" stroke="#582a03" strokeWidth="1.3" strokeLinecap="round" />
      <defs>
        <linearGradient id="goldLockGrad" x1="4" y1="9.8" x2="20" y2="22.3" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="30%" stopColor="#f59e0b" />
          <stop offset="70%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#854d0e" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function KingdomMap({
  districtScores = [],
  districtCorrect = [],
  currentDistrict = 0,
  onSelectDistrict,
}) {
  // Calculate total stars earned across all worlds (max 30)
  const totalStars = districtScores.reduce((sum, sc) => {
    if (sc === null || sc === undefined) return sum;
    return sum + calcStars(sc);
  }, 0);

  // Unlocking condition: W1 is always unlocked.
  // Subsequent worlds unlock if user reached this district or scored >= 4/10 on the preceding world.
  const isUnlocked = (idx) => {
    if (idx === 0) return true;
    if (idx <= currentDistrict) return true;
    if (districtScores[idx] !== null && districtScores[idx] !== undefined) return true;
    const prevScore = districtScores[idx - 1] ?? districtCorrect[idx - 1] ?? 0;
    return prevScore >= 4;
  };

  return (
    <div className="practice-hub-card">
      {/* Top glowing mint-green pill accent */}
      <div className="practice-accent-pill" />

      {/* Header section: Title, Subtitle, and Star Badge */}
      <div className="practice-hub-header">
        <div className="practice-title-group">
          <h1 className="practice-hub-title">Cuboid Game Worlds</h1>
          <p className="practice-hub-subtitle">
            10 Themed Worlds · Need 4/10 Correct to Unlock Next World
          </p>
        </div>

        <div className="practice-stars-badge" title="Total Stars Earned">
          <span className="star-icon" aria-hidden="true">⭐</span>
          <span className="star-count">{totalStars} / 30</span>
        </div>
      </div>

      {/* 2 rows × 5 columns World Cards Grid */}
      <div className="practice-worlds-grid">
        {DISTRICTS.map((dist, idx) => {
          const unlocked = isUnlocked(idx);
          const isCurrent = idx === currentDistrict;
          const IconComponent = WORLD_ICONS[idx % WORLD_ICONS.length] || Box;
          const qStart = idx * 10 + 1;
          const qEnd = (idx + 1) * 10;
          const qRange = `Q${qStart}–${qEnd}`;

          return (
            <div
              key={dist.id}
              className={`practice-world-card ${unlocked ? 'unlocked' : 'locked'} ${
                isCurrent ? 'is-current' : ''
              }`}
              onClick={() => {
                if (unlocked && onSelectDistrict) {
                  onSelectDistrict(idx);
                }
              }}
              role="button"
              tabIndex={unlocked ? 0 : -1}
              aria-label={`${dist.name} (${unlocked ? 'Unlocked' : 'Locked'})`}
              onKeyDown={(e) => {
                if (unlocked && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  onSelectDistrict && onSelectDistrict(idx);
                }
              }}
            >
              {/* Top Row: W# on left, Q Range on right */}
              <div className="world-card-top">
                <span className="world-card-num">W{idx + 1}</span>
                <span className="world-card-qrange">{qRange}</span>
              </div>

              {/* Center Area: Icon + World Name */}
              <div className="world-card-center">
                <div className="world-icon-wrapper">
                  {unlocked ? (
                    <IconComponent
                      size={26}
                      color="#4ECCA3"
                      strokeWidth={2}
                      className="world-active-icon"
                    />
                  ) : (
                    <GoldenLock size={26} />
                  )}
                </div>

                <div className="world-card-title" title={dist.name}>
                  {dist.name}
                </div>
              </div>

              {/* Bottom Row: Play action or Locked label */}
              <div className="world-card-bottom">
                {unlocked ? (
                  <span className="world-play-btn">Play →</span>
                ) : (
                  <span className="world-locked-label">Locked</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
