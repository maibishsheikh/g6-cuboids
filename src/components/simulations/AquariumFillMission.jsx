// src/components/simulations/AquariumFillMission.jsx
// Station 3: Multi-Step / Composite Construction — Tank base, liquid volume & water depth
import React, { useState } from 'react';
import CuboidVisual from '../shared/CuboidVisual.jsx';
import { baseArea, waterHeight } from '../../utils/cuboidMath.js';
import './Stations.css';

export default function AquariumFillMission({ onComplete, audioEnabled }) {
  const [stage, setStage] = useState('A'); // 'A' | 'B' | 'C'
  const [l, setL] = useState(30);
  const [b, setB] = useState(20);
  const [tankH] = useState(25);
  const [poured, setPoured] = useState(0); // in ml / cm3
  const [stageBTargetH] = useState(10); // target 10 cm height in Stage B
  const [stageCTargetH] = useState(12); // target 12 cm height in Stage C
  const [stageCChecked, setStageCChecked] = useState(false);

  const curArea = baseArea(l, b);
  const curHeight = curArea > 0 ? poured / curArea : 0;
  const isOverflow = curHeight > tankH;

  const targetVolStageB = curArea * stageBTargetH;
  const targetVolStageC = curArea * stageCTargetH;

  function handlePour(amountMl) {
    setPoured((p) => Math.min(25000, p + amountMl));
    setStageCChecked(false);
  }

  function handleDrain() {
    setPoured(0);
    setStageCChecked(false);
  }

  function handleAdvanceStageB() {
    setStage('B');
    setPoured(0);
  }

  function handleAdvanceStageC() {
    setStage('C');
    setPoured(0);
    setStageCChecked(false);
  }

  function handleCheckStageC() {
    setStageCChecked(true);
  }

  const isStageBExact = poured === targetVolStageB;
  const isStageCExact = poured === targetVolStageC && stageCChecked;
  const isAllComplete = stage === 'C' && isStageCExact;

  return (
    <div className="station-container anim-fade-in">
      <div className="station-header">
        <h3 className="station-title">Station C: Aquarium Fill Mission</h3>
        <p className="station-subtitle">
          Design the aquarium tank base, pour water from litre jugs, and connect capacity to depth!
        </p>
      </div>

      {/* Stage Tracker */}
      <div className="stage-tracker-bar">
        <div className={`stage-step ${stage === 'A' ? 'active' : 'done'}`}>
          <span className="step-num">Stage 1</span>
          <span className="step-desc">Pick Tank Base</span>
        </div>
        <div className={`stage-step ${stage === 'B' ? 'active' : stage === 'C' ? 'done' : ''}`}>
          <span className="step-num">Stage 2</span>
          <span className="step-desc">Pour to Target Depth</span>
        </div>
        <div className={`stage-step ${stage === 'C' ? 'active' : ''}`}>
          <span className="step-num">Stage 3</span>
          <span className="step-desc">Reverse Capacity Challenge</span>
        </div>
      </div>

      <div className="station-body">
        {/* Left: Aquarium Tank Visual */}
        <div className="station-visual-pane">
          <div className="station-canvas">
            <CuboidVisual
              type="tankWater"
              data={{
                l,
                b,
                h: tankH,
                waterHeight: curHeight,
                waterCm3: poured,
                overflow: isOverflow,
              }}
              maxH={240}
            />
          </div>

          {/* Three-Line Formula Readout */}
          <div className="station-readout-card">
            <div className="readout-line">
              <span className="readout-label">Base (l × b):</span>
              <span className="readout-value highlight-green">{curArea} cm²</span>
            </div>
            <div className="readout-line">
              <span className="readout-label">Poured:</span>
              <span className="readout-value highlight-blue">
                {poured.toLocaleString()} ml ({poured / 1000} L)
              </span>
            </div>
            {/* In Stage C, hide the direct height feedback until student checks */}
            {stage !== 'C' || stageCChecked ? (
              <div className="readout-line">
                <span className="readout-label">Depth:</span>
                <span className={`readout-value ${curHeight === (stage === 'B' ? stageBTargetH : stageCTargetH) ? 'highlight-gold' : ''}`}>
                  <strong>{Math.round(curHeight * 10) / 10} cm</strong>
                </span>
              </div>
            ) : (
              <div className="readout-line">
                <span className="readout-label">Target Depth:</span>
                <span className="readout-value highlight-gold">{stageCTargetH} cm</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Controls per Stage */}
        <div className="station-controls-pane">
          {/* STAGE A: Base sizing */}
          {stage === 'A' && (
            <div className="control-group-box anim-fade-in">
              <h4 className="control-heading">Step 1: Choose Aquarium Dimensions</h4>
              <p className="control-subtext">Set length and breadth of the aquarium's rectangular bottom.</p>

              <div className="stepper-grid-2">
                {/* Length */}
                <div className="stepper-col">
                  <span className="stepper-col-label">Length (l)</span>
                  <div className="stepper-wrap">
                    <button
                      className="step-btn"
                      onClick={() => setL((v) => Math.max(10, v - 5))}
                      disabled={l <= 10}
                    >−</button>
                    <span className="step-val">{l} cm</span>
                    <button
                      className="step-btn"
                      onClick={() => setL((v) => Math.min(50, v + 5))}
                      disabled={l >= 50}
                    >+</button>
                  </div>
                </div>

                {/* Breadth */}
                <div className="stepper-col">
                  <span className="stepper-col-label">Breadth (b)</span>
                  <div className="stepper-wrap">
                    <button
                      className="step-btn"
                      onClick={() => setB((v) => Math.max(10, v - 5))}
                      disabled={b <= 10}
                    >−</button>
                    <span className="step-val">{b} cm</span>
                    <button
                      className="step-btn"
                      onClick={() => setB((v) => Math.min(40, v + 5))}
                      disabled={b >= 40}
                    >+</button>
                  </div>
                </div>
              </div>

              <div className="stage-action-box">
                <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                  Tank Base Area: <strong>{curArea} cm²</strong>
                </p>
                <button className="btn btn-primary btn-block" onClick={handleAdvanceStageB}>
                  Lock In Tank Base &amp; Pour Water →
                </button>
              </div>
            </div>
          )}

          {/* STAGE B: Pour water with jugs */}
          {stage === 'B' && (
            <div className="control-group-box anim-fade-in">
              <h4 className="control-heading">Step 2: Fill to Exactly {stageBTargetH} cm Depth</h4>
              <p className="control-subtext">
                Tap water jugs to pour. Goal: {stageBTargetH} cm water height ({targetVolStageB} ml).
              </p>

              <div className="jug-grid">
                <button className="jug-btn" onClick={() => handlePour(250)}>
                  <span className="jug-icon">🥛</span>
                  <span>+250 ml</span>
                </button>
                <button className="jug-btn" onClick={() => handlePour(500)}>
                  <span className="jug-icon">🍶</span>
                  <span>+500 ml</span>
                </button>
                <button className="jug-btn" onClick={() => handlePour(1000)}>
                  <span className="jug-icon">🫖</span>
                  <span>+1 Litre</span>
                </button>
                <button className="jug-btn" onClick={() => handlePour(2000)}>
                  <span className="jug-icon">🪣</span>
                  <span>+2 Litres</span>
                </button>
              </div>

              <div className="drain-row">
                <button className="btn btn-outline btn-sm" onClick={handleDrain}>
                  🚰 Drain Tank
                </button>
                <span className="poured-total-chip">
                  Total: {poured / 1000} L ({poured} ml)
                </span>
              </div>

              {isStageBExact && (
                <div className="stage-success-pill anim-bounce-in">
                  <p>🎉 Spot on! Depth is exactly {stageBTargetH} cm!</p>
                  <button className="btn btn-primary btn-block" onClick={handleAdvanceStageC}>
                    Advance to Reverse Challenge (Stage 3) →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STAGE C: Reverse Challenge */}
          {stage === 'C' && (
            <div className="control-group-box anim-fade-in">
              <h4 className="control-heading">Step 3: Reverse Capacity Challenge</h4>
              <p className="control-subtext">
                The pet shop wants the water level at <strong>exactly {stageCTargetH} cm</strong>.
                Calculate how many litres to pour, then pour it!
              </p>

              <div className="jug-grid">
                <button className="jug-btn" onClick={() => handlePour(250)}>
                  <span className="jug-icon">🥛</span>
                  <span>+250 ml</span>
                </button>
                <button className="jug-btn" onClick={() => handlePour(500)}>
                  <span className="jug-icon">🍶</span>
                  <span>+500 ml</span>
                </button>
                <button className="jug-btn" onClick={() => handlePour(1000)}>
                  <span className="jug-icon">🫖</span>
                  <span>+1 Litre</span>
                </button>
                <button className="jug-btn" onClick={() => handlePour(2000)}>
                  <span className="jug-icon">🪣</span>
                  <span>+2 Litres</span>
                </button>
              </div>

              <div className="drain-row">
                <button className="btn btn-outline btn-sm" onClick={handleDrain}>
                  🚰 Drain Tank
                </button>
                <span className="poured-total-chip">
                  Poured: {poured / 1000} L
                </span>
              </div>

              <button
                className="btn btn-primary btn-block check-depth-btn"
                onClick={handleCheckStageC}
              >
                🔍 Check Water Depth
              </button>

              {stageCChecked && (
                <div className={`depth-result-banner anim-bounce-in ${poured === targetVolStageC ? 'success' : 'retry'}`}>
                  {poured === targetVolStageC ? (
                    <div>
                      <p className="result-headline">🏆 Exact Match!</p>
                      <p className="result-detail">
                        {curArea} cm² base × {stageCTargetH} cm depth = {targetVolStageC} cm³ = {targetVolStageC / 1000} Litres.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="result-headline">
                        {curHeight < stageCTargetH ? 'Too Low! Water depth is only ' : 'Too High! Water depth is '}
                        {Math.round(curHeight * 10) / 10} cm.
                      </p>
                      <p className="result-detail">
                        Hint: Base Area ({curArea} cm²) × Desired Height ({stageCTargetH} cm) = {targetVolStageC} ml.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Station Completion */}
          {isAllComplete && (
            <div className="station-success anim-slide-up">
              <button className="btn btn-green btn-lg btn-block" onClick={onComplete}>
                Complete Station C ✓
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
