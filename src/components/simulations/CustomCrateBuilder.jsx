// src/components/simulations/CustomCrateBuilder.jsx
// Station 2: Build-to-Target Challenge — Hit exact volume & base area targets
import React, { useState, useEffect } from 'react';
import CuboidVisual from '../shared/CuboidVisual.jsx';
import { volume, baseArea } from '../../utils/cuboidMath.js';
import './Stations.css';

const ROUND_TARGETS = [
  { round: 1, targetVol: 240, mode: 'volume', desc: 'Customer Order #1: Exactly 240 cm³' },
  { round: 2, targetVol: 480, mode: 'volume', desc: 'Customer Order #2: Exactly 480 cm³' },
  { round: 3, targetVol: 360, targetBase: 60, targetH: 6, mode: 'baseArea', desc: 'Special Order #3: Base Area 60 cm² & Height 6 cm (360 cm³)' },
];

export default function CustomCrateBuilder({ onComplete, audioEnabled }) {
  const [roundIdx, setRoundIdx] = useState(0);
  const [l, setL] = useState(6);
  const [b, setB] = useState(5);
  const [h, setH] = useState(4);
  const [solutions, setSolutions] = useState(new Set());
  const [completedRounds, setCompletedRounds] = useState(0);

  const curRound = ROUND_TARGETS[roundIdx];
  const curVol = volume(l, b, h);
  const curArea = baseArea(l, b);

  const isExactHit = curRound.mode === 'baseArea'
    ? (curArea === curRound.targetBase && h === curRound.targetH)
    : (curVol === curRound.targetVol);

  // Track distinct solutions for the current target
  useEffect(() => {
    if (isExactHit) {
      const tripleKey = `${Math.min(l, b)}x${Math.max(l, b)}x${h}`;
      setSolutions((prev) => new Set([...prev, tripleKey]));
    }
  }, [l, b, h, isExactHit]);

  function handleNextRound() {
    if (completedRounds + 1 < ROUND_TARGETS.length) {
      setCompletedRounds((r) => r + 1);
      setRoundIdx((r) => r + 1);
      setL(4);
      setB(4);
      setH(4);
      setSolutions(new Set());
    } else {
      setCompletedRounds(3);
    }
  }

  const progressPercent = Math.min(100, Math.round((curVol / curRound.targetVol) * 100));
  const isAllComplete = completedRounds >= 3;

  return (
    <div className="station-container anim-fade-in">
      <div className="station-header">
        <h3 className="station-title">Station B: Custom Crate Builder</h3>
        <p className="station-subtitle">
          Build shipping crates to exact customer specifications! Multiple dimension combinations work.
        </p>
      </div>

      <div className="station-body">
        {/* Left: Crate Visual & Target Status */}
        <div className="station-visual-pane">
          <div className="target-banner-card">
            <span className="target-tag">ROUND {roundIdx + 1} OF 3</span>
            <div className="target-desc">{curRound.desc}</div>
            <div className="target-goal-number">
              Target: {curRound.mode === 'baseArea' ? `${curRound.targetBase} cm² base × ${curRound.targetH} cm h = ${curRound.targetVol} cm³` : `${curRound.targetVol} cm³`}
            </div>
          </div>

          <div className="station-canvas">
            <CuboidVisual
              type={curRound.mode === 'baseArea' ? 'baseHighlight' : 'isoCuboid'}
              data={{ l, b, h, area: curArea, unit: 'cm' }}
              maxH={240}
            />
          </div>

          {/* Running Calculation Strip */}
          <div className={`crate-calc-strip ${isExactHit ? 'match' : ''}`}>
            {curRound.mode === 'baseArea' ? (
              <span>Base Area ({l} × {b} = {curArea} cm²) × Height ({h} cm) = <strong>{curVol} cm³</strong></span>
            ) : (
              <span>{l} cm × {b} cm × {h} cm = <strong>{curVol} cm³</strong></span>
            )}
          </div>

          {/* Target Match Progress Bar */}
          <div className="target-progress-wrap">
            <div className="target-bar-bg">
              <div
                className={`target-bar-fill ${isExactHit ? 'exact' : curVol > curRound.targetVol ? 'over' : ''}`}
                style={{ width: `${Math.min(100, progressPercent)}%` }}
              />
            </div>
            <span className="target-status-text">
              {isExactHit ? '🎉 EXACT MATCH!' : curVol > curRound.targetVol ? '⚠️ OVER TARGET' : `${progressPercent}% OF GOAL`}
            </span>
          </div>

          {/* Solutions tally chip */}
          {solutions.size > 0 && (
            <div className="solutions-chip anim-fade-in">
              ✨ Unique designs found: <strong>{solutions.size}</strong>
            </div>
          )}
        </div>

        {/* Right: Dimension Steppers & Advance */}
        <div className="station-controls-pane">
          <div className="control-group-box">
            <h4 className="control-heading">Adjust Crate Dimensions (1–20 cm)</h4>

            <div className="stepper-grid-3">
              {/* Length control */}
              <div className="stepper-col">
                <span className="stepper-col-label">Length (l)</span>
                <div className="stepper-wrap">
                  <button
                    className="step-btn"
                    onClick={() => setL((v) => Math.max(1, v - 1))}
                    disabled={l <= 1}
                    aria-label="Decrease length"
                  >−</button>
                  <span className="step-val">{l} cm</span>
                  <button
                    className="step-btn"
                    onClick={() => setL((v) => Math.min(20, v + 1))}
                    disabled={l >= 20}
                    aria-label="Increase length"
                  >+</button>
                </div>
              </div>

              {/* Breadth control */}
              <div className="stepper-col">
                <span className="stepper-col-label">Breadth (b)</span>
                <div className="stepper-wrap">
                  <button
                    className="step-btn"
                    onClick={() => setB((v) => Math.max(1, v - 1))}
                    disabled={b <= 1}
                    aria-label="Decrease breadth"
                  >−</button>
                  <span className="step-val">{b} cm</span>
                  <button
                    className="step-btn"
                    onClick={() => setB((v) => Math.min(20, v + 1))}
                    disabled={b >= 20}
                    aria-label="Increase breadth"
                  >+</button>
                </div>
              </div>

              {/* Height control */}
              <div className="stepper-col">
                <span className="stepper-col-label">Height (h)</span>
                <div className="stepper-wrap">
                  <button
                    className="step-btn"
                    onClick={() => setH((v) => Math.max(1, v - 1))}
                    disabled={h <= 1}
                    aria-label="Decrease height"
                  >−</button>
                  <span className="step-val">{h} cm</span>
                  <button
                    className="step-btn"
                    onClick={() => setH((v) => Math.min(20, v + 1))}
                    disabled={h >= 20}
                    aria-label="Increase height"
                  >+</button>
                </div>
              </div>
            </div>

            {/* Round progress indicator */}
            <div className="round-dots-row">
              {ROUND_TARGETS.map((t, idx) => (
                <span
                  key={t.round}
                  className={`round-dot ${idx < completedRounds ? 'done' : idx === roundIdx ? 'active' : ''}`}
                >
                  {idx < completedRounds ? '✓' : idx + 1}
                </span>
              ))}
            </div>

            {isExactHit && completedRounds < 2 && (
              <button className="btn btn-primary btn-block anim-bounce-in" onClick={handleNextRound}>
                Accept Crate &amp; Next Order →
              </button>
            )}

            {isExactHit && completedRounds === 2 && !isAllComplete && (
              <button className="btn btn-green btn-block anim-bounce-in" onClick={() => setCompletedRounds(3)}>
                Accept Final Crate ✓
              </button>
            )}
          </div>

          {/* Station Completion */}
          {isAllComplete && (
            <div className="station-success anim-slide-up">
              <button className="btn btn-green btn-lg btn-block" onClick={onComplete}>
                Complete Station B ✓
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
