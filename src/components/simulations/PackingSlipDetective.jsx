// src/components/simulations/PackingSlipDetective.jsx
// Station 4: Error-Detective — Spot misconceptions and correct worked slips
import React, { useState } from 'react';
import CuboidVisual from '../shared/CuboidVisual.jsx';
import './Stations.css';

const DOCKETS = [
  {
    id: 1,
    title: 'Docket #101: Box Volume Calculation',
    boxData: { l: 12, b: 6, h: 5, unit: 'cm' },
    lines: [
      'Line 1: Length = 12 cm, Breadth = 6 cm, Height = 5 cm',
      'Line 2: Base Area = 12 × 6 = 72 cm²',
      'Line 3: Volume = 72 × 5 = 360 cm²', // Error: cm² instead of cm³
    ],
    errorLineIndex: 2,
    errorType: 'unit_error',
    correctionOptions: [
      { text: 'Volume = 72 × 5 = 360 cm³ (Volume is 3D, measured in cubic cm)', correct: true },
      { text: 'Volume = 72 + 5 = 77 cm³', correct: false },
      { text: 'Volume = 12 + 6 + 5 = 23 cm²', correct: false },
    ],
    fixedLine: 'Line 3: Volume = 72 × 5 = 360 cm³ ✓',
    boTip: 'Look closely at the unit on Line 3! Is space inside a box measured in square or cubic units?',
  },
  {
    id: 2,
    title: 'Docket #102: Missing Height Recovery',
    boxData: { l: 10, b: 8, h: 6, area: 80, unit: 'cm' },
    lines: [
      'Line 1: Known Volume = 480 cm³, Base Area = 80 cm²',
      'Line 2: Height = Volume × Base Area', // Error: multiplied instead of divided
      'Line 3: Height = 480 × 80 = 38 400 cm',
    ],
    errorLineIndex: 1,
    errorType: 'operation_reversal',
    correctionOptions: [
      { text: 'Height = Volume ÷ Base Area = 480 ÷ 80 = 6 cm', correct: true },
      { text: 'Height = Volume − Base Area = 480 − 80 = 400 cm', correct: false },
      { text: 'Height = Volume + Base Area = 480 + 80 = 560 cm', correct: false },
    ],
    fixedLine: 'Line 2: Height = Volume ÷ Base Area = 480 ÷ 80 = 6 cm ✓',
    boTip: 'When working backwards from Volume to Height, do we multiply or divide by Base Area?',
  },
  {
    id: 3,
    title: 'Docket #103: Shaded Face Area',
    boxData: { l: 14, b: 10, h: 6, face: 'side', unit: 'cm' },
    lines: [
      'Line 1: Cuboid Volume = 840 cm³, Length = 14 cm',
      'Line 2: Area of Face = Volume ÷ (14 × 10) = 6 cm', // Error: divided by 2 dims giving length instead of area
      'Line 3: Result = 6 cm',
    ],
    errorLineIndex: 1,
    errorType: 'wrong_divisor',
    correctionOptions: [
      { text: 'Area of Face = Volume ÷ Length = 840 ÷ 14 = 60 cm²', correct: true },
      { text: 'Area of Face = Volume × Length = 840 × 14 = 11 760 cm²', correct: false },
      { text: 'Area of Face = 14 × 10 = 140 cm', correct: false },
    ],
    fixedLine: 'Line 2: Area of Face = Volume ÷ Length = 840 ÷ 14 = 60 cm² ✓',
    boTip: 'To find the area of a perpendicular face, divide the volume by the ONE dimension across from it!',
  },
];

export default function PackingSlipDetective({ onComplete, audioEnabled }) {
  const [docketIdx, setDocketIdx] = useState(0);
  const [selectedLine, setSelectedLine] = useState(null);
  const [showCorrectionMenu, setShowCorrectionMenu] = useState(false);
  const [isCorrected, setIsCorrected] = useState(false);
  const [shakeLine, setShakeLine] = useState(null);
  const [completedDockets, setCompletedDockets] = useState([false, false, false]);

  const docket = DOCKETS[docketIdx];

  function handleLineClick(lineIndex) {
    if (isCorrected) return;
    setSelectedLine(lineIndex);

    if (lineIndex === docket.errorLineIndex) {
      setShowCorrectionMenu(true);
      setShakeLine(null);
    } else {
      setShowCorrectionMenu(false);
      setShakeLine(lineIndex);
      setTimeout(() => setShakeLine(null), 600);
    }
  }

  function handleSelectCorrection(option) {
    if (option.correct) {
      setIsCorrected(true);
      const nextDone = [...completedDockets];
      nextDone[docketIdx] = true;
      setCompletedDockets(nextDone);
    } else {
      setShakeLine('menu');
      setTimeout(() => setShakeLine(null), 500);
    }
  }

  function handleNextDocket() {
    if (docketIdx + 1 < DOCKETS.length) {
      setDocketIdx((prev) => prev + 1);
      setSelectedLine(null);
      setShowCorrectionMenu(false);
      setIsCorrected(false);
    }
  }

  const allComplete = completedDockets.every(Boolean);

  return (
    <div className="station-container anim-fade-in">
      <div className="station-header">
        <h3 className="station-title">Station D: Packing Slip Detective</h3>
        <p className="station-subtitle">
          Three depot packing dockets have errors! Tap the incorrect calculation line, then select the proper fix.
        </p>
      </div>

      {/* Progress tabs for 3 dockets */}
      <div className="docket-tabs-row">
        {DOCKETS.map((d, i) => (
          <button
            key={d.id}
            className={`docket-tab-btn ${i === docketIdx ? 'active' : ''} ${completedDockets[i] ? 'done' : ''}`}
            onClick={() => {
              setDocketIdx(i);
              setSelectedLine(null);
              setShowCorrectionMenu(false);
              setIsCorrected(completedDockets[i]);
            }}
          >
            {completedDockets[i] ? '✓ ' : ''}Slip {i + 1}
          </button>
        ))}
      </div>

      <div className="station-body">
        {/* Left: Box Visual & Bo's Tip */}
        <div className="station-visual-pane">
          <div className="station-canvas" style={{ minHeight: '220px' }}>
            <CuboidVisual
              type={docket.boxData.face ? 'faceHighlight' : docket.boxData.area ? 'baseHighlight' : 'isoCuboid'}
              data={docket.boxData}
              maxH={240}
            />
          </div>

          <div className="bo-helper-card">
            <span className="bo-icon">🦫</span>
            <div className="bo-msg-box">
              <div className="bo-author">Bo the Depot Detective says:</div>
              <p className="bo-tip">{docket.boTip}</p>
            </div>
          </div>
        </div>

        {/* Right: Realistic Depot Docket & Corrections */}
        <div className="station-controls-pane">
          <div className="docket-paper-card">
            <div className="docket-title-bar">
              <span className="docket-title">{docket.title}</span>
              {isCorrected && <span className="checked-badge">CHECKED ✓</span>}
            </div>

            <p className="docket-instruction">
              {!selectedLine ? '👉 Tap the line containing a math error:' : 'Line selected:'}
            </p>

            <div className="docket-lines-list">
              {docket.lines.map((line, idx) => {
                const isError = idx === docket.errorLineIndex;
                const isThisSelected = selectedLine === idx;
                const isShaking = shakeLine === idx;

                return (
                  <div
                    key={idx}
                    className={`docket-line-item ${isThisSelected ? 'selected' : ''} ${isShaking ? 'shake-anim' : ''} ${isCorrected && isError ? 'fixed' : ''}`}
                    onClick={() => handleLineClick(idx)}
                  >
                    {isCorrected && isError ? (
                      <div className="fixed-line-content">
                        <span className="struck-line">{line}</span>
                        <span className="replacement-line">{docket.fixedLine}</span>
                      </div>
                    ) : (
                      <span>{line}</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Correction Choices once error line is tapped */}
            {showCorrectionMenu && !isCorrected && (
              <div className="correction-options-box anim-fade-in">
                <h5 className="correction-prompt">Select the correct mathematical working:</h5>
                <div className="correction-options-list">
                  {docket.correctionOptions.map((opt, optIdx) => (
                    <button
                      key={optIdx}
                      className="btn btn-outline btn-block correction-opt-btn"
                      onClick={() => handleSelectCorrection(opt)}
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isCorrected && docketIdx + 1 < DOCKETS.length && (
              <div className="advance-docket-box anim-slide-up">
                <p className="slip-success-msg">✓ Slip {docketIdx + 1} verified and stamped!</p>
                <button className="btn btn-primary btn-block" onClick={handleNextDocket}>
                  Inspect Next Slip →
                </button>
              </div>
            )}
          </div>

          {/* Station Completion */}
          {allComplete && (
            <div className="station-success anim-slide-up">
              <button className="btn btn-green btn-lg btn-block" onClick={onComplete}>
                Complete Station D ✓
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
