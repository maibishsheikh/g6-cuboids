// src/components/simulations/UnfoldFillLab.jsx
// Station 1: Concept Discovery Lab — Net unfolding & layer-by-layer volume
import React, { useState, useEffect } from 'react';
import CuboidVisual from '../shared/CuboidVisual.jsx';
import { volume, baseArea } from '../../utils/cuboidMath.js';
import './Stations.css';

export default function UnfoldFillLab({ onComplete, audioEnabled }) {
  const [l, setL] = useState(4);
  const [b, setB] = useState(3);
  const [h, setH] = useState(3);
  const [unfolded, setUnfolded] = useState(false);
  const [layersShown, setLayersShown] = useState(1);
  const [isFilling, setIsFilling] = useState(false);
  const [setsExplored, setSetsExplored] = useState(new Set(['4x3x3']));
  const [hasFilledOnce, setHasFilledOnce] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [selectedConfirmOpt, setSelectedConfirmOpt] = useState(null);

  const curBaseArea = baseArea(l, b);
  const curVolume = volume(l, b, h);

  // Track explored sets
  useEffect(() => {
    const key = `${l}x${b}x${h}`;
    setSetsExplored((prev) => new Set([...prev, key]));
  }, [l, b, h]);

  // Layer fill animation
  useEffect(() => {
    let interval = null;
    if (isFilling) {
      interval = setInterval(() => {
        setLayersShown((prev) => {
          if (prev >= h) {
            setIsFilling(false);
            setHasFilledOnce(true);
            return h;
          }
          return prev + 1;
        });
      }, 700);
    }
    return () => clearInterval(interval);
  }, [isFilling, h]);

  function handleStartFill() {
    setUnfolded(false);
    setLayersShown(1);
    setIsFilling(true);
  }

  function handleAnswerConfirm(val) {
    setSelectedConfirmOpt(val);
    if (val === 60) {
      setConfirmed(true);
    }
  }

  const isGateMet = setsExplored.size >= 3 && hasFilledOnce && confirmed;

  return (
    <div className="station-container anim-fade-in">
      <div className="station-header">
        <h3 className="station-title">Station A: Unfold &amp; Fill Lab</h3>
        <p className="station-subtitle">
          Discover why Volume = Base Area × Height. Unfold the 6 faces, then stack cubes layer by layer!
        </p>
      </div>

      <div className="station-body">
        {/* Left: Interactive Visual */}
        <div className="station-visual-pane">
          <div className="visual-toggle-bar">
            <button
              className={`btn btn-sm ${!unfolded ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setUnfolded(false)}
            >
              📦 3D Layers View
            </button>
            <button
              className={`btn btn-sm ${unfolded ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => {
                setUnfolded(true);
                setIsFilling(false);
              }}
            >
              📐 Unfolded Net View
            </button>
          </div>

          <div className="station-canvas">
            {unfolded ? (
              <CuboidVisual
                type="netUnfold"
                data={{ l, b, h, unfoldProgress: 1 }}
                maxH={155}
              />
            ) : (
              <CuboidVisual
                type="layerFill"
                data={{ l, b, h, layersShown }}
                maxH={155}
              />
            )}
          </div>

          {/* Running Layer Readout */}
          <div className="station-readout-card">
            <div className="readout-line">
              <span className="readout-label">Base layer:</span>
              <span className="readout-value highlight-green">{l} × {b} = {curBaseArea}</span>
            </div>
            <div className="readout-line">
              <span className="readout-label">Stacked:</span>
              <span className="readout-value highlight-blue">{layersShown} of {h} layers</span>
            </div>
            <div className="readout-line">
              <span className="readout-label">Volume:</span>
              <span className="readout-value highlight-gold">{curBaseArea * layersShown} cm³</span>
            </div>
          </div>
        </div>

        {/* Right: Controls & Checkpoints */}
        <div className="station-controls-pane">
          <div className="control-group-box">
            <h4 className="control-heading">Adjust Box Dimensions (cm)</h4>

            <div className="stepper-grid-3">
              {/* Length control */}
              <div className="stepper-col">
                <span className="stepper-col-label">Length (l)</span>
                <div className="stepper-wrap">
                  <button
                    className="step-btn"
                    onClick={() => setL((v) => Math.max(2, v - 1))}
                    disabled={l <= 2}
                    aria-label="Decrease length"
                  >−</button>
                  <span className="step-val">{l} cm</span>
                  <button
                    className="step-btn"
                    onClick={() => setL((v) => Math.min(10, v + 1))}
                    disabled={l >= 10}
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
                    onClick={() => setB((v) => Math.max(2, v - 1))}
                    disabled={b <= 2}
                    aria-label="Decrease breadth"
                  >−</button>
                  <span className="step-val">{b} cm</span>
                  <button
                    className="step-btn"
                    onClick={() => setB((v) => Math.min(10, v + 1))}
                    disabled={b >= 10}
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
                    onClick={() => setH((v) => Math.max(2, v - 1))}
                    disabled={h <= 2}
                    aria-label="Decrease height"
                  >−</button>
                  <span className="step-val">{h} cm</span>
                  <button
                    className="step-btn"
                    onClick={() => setH((v) => Math.min(10, v + 1))}
                    disabled={h >= 10}
                    aria-label="Increase height"
                  >+</button>
                </div>
              </div>
            </div>

            <button
              className="btn btn-primary btn-block fill-btn"
              onClick={handleStartFill}
              disabled={isFilling}
            >
              {isFilling ? 'Filling Layers...' : '▶ Fill Layers Animation'}
            </button>
          </div>

          {/* Goal Checklist */}
          <div className="gate-checklist">
            <div className={`check-item ${setsExplored.size >= 3 ? 'done' : ''}`}>
              <span>{setsExplored.size >= 3 ? '✓' : '○'}</span>
              <span>Explore at least 3 dimension sizes ({setsExplored.size}/3)</span>
            </div>
            <div className={`check-item ${hasFilledOnce ? 'done' : ''}`}>
              <span>{hasFilledOnce ? '✓' : '○'}</span>
              <span>Complete the layer-fill animation</span>
            </div>
          </div>

          {/* Confirmation Question */}
          <div className="confirm-quiz-card">
            <p className="quiz-q">
              <strong>Check:</strong> A box's base holds <strong>15 cubes</strong> and it is <strong>4 layers tall</strong>. What is its volume?
            </p>
            <div className="quiz-options-row">
              {[19, 45, 60, 154].map((opt) => (
                <button
                  key={opt}
                  className={`quiz-opt-btn ${selectedConfirmOpt === opt ? (opt === 60 ? 'correct' : 'wrong') : ''}`}
                  onClick={() => handleAnswerConfirm(opt)}
                >
                  {opt} cm³
                </button>
              ))}
            </div>
            {confirmed && (
              <p className="quiz-feedback-text success">
                ✓ Exactly! Base Area × Height = 15 × 4 = 60 cm³.
              </p>
            )}
          </div>

          {/* Station Completion */}
          {isGateMet && (
            <div className="station-success anim-slide-up">
              <button className="btn btn-green btn-lg btn-block" onClick={onComplete}>
                Complete Station A ✓
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
