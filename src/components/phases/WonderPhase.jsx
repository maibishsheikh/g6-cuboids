// src/components/phases/WonderPhase.jsx
import React, { useEffect } from 'react';
import './WonderPhase.css';
import Mascot from '../shared/Mascot.jsx';
import { useAudio } from '../../hooks/useAudio.js';
import { wonderNarration } from '../../utils/narration.js';

const PARTICLES = ['📦', '🧊', '💧', '📐', '⭐', '🏆', '🎯', '💡', '🦫', '✨'];

export default function WonderPhase({ state, dispatch }) {
  const { narrate, stopAll } = useAudio(state?.audioEnabled ?? true);

  useEffect(() => {
    const segs = wonderNarration();
    narrate(segs);
    return () => stopAll();
  }, [narrate, stopAll]);

  function handleInvestigate() {
    stopAll();
    dispatch({ type: 'COMPLETE_PHASE', payload: 'wonder' });
    dispatch({ type: 'SET_PHASE', payload: 'story' });
  }

  return (
    <div className="wonder-wrap">
      {/* Floating particles */}
      <div className="wonder-particles" aria-hidden="true">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="wonder-particle"
            style={{
              left: `${5 + (i * 9.5) % 90}%`,
              top: `${5 + (i * 7.5) % 80}%`,
              animationDelay: `${i * 0.6}s`,
              fontSize: `${1.1 + (i % 3) * 0.4}rem`,
            }}
          >
            {p}
          </span>
        ))}
      </div>

      <div className="wonder-content anim-slide-up">
        {/* Main hook card */}
        <div className="wonder-card glass-card">
          <div className="wonder-stadium-icon" aria-hidden="true">📦</div>
          <h1 className="wonder-title headline">The Big Depot Mystery!</h1>

          <div className="wonder-number-display">
            <span className="number-display wonder-num">2 Litres = 2000 cm³ ➔ Box: 20 × 10 × 8 cm = ?</span>
          </div>

          <div className="wonder-question-card">
            <p className="body-text wonder-q">
              A customer needs <strong className="wonder-em">2 litres of fish food</strong> packed into a shipping box at the depot.
            </p>
            <p className="body-text wonder-q">
              Wei Jie grabs a carton measuring <strong className="wonder-em">20 cm by 10 cm by 8 cm</strong>. Does this box hold enough volume, or is it <span className="wonder-highlight">too small</span>?
            </p>
          </div>

          {/* Mascot */}
          <div className="wonder-mascot-row">
            <Mascot mood="curious" message="Let's investigate how to calculate volume and capacity inside a 3D box!" size="sm" />
          </div>

          <button className="btn btn-primary btn-lg wonder-cta" onClick={handleInvestigate}>
            Start Investigation 🔍
          </button>
        </div>
      </div>
    </div>
  );
}
