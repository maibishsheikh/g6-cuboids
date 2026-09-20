// src/components/shared/CuboidVisual.jsx
// Visual component implementing all 10 visual modes for CuboidQuest
import React from 'react';
import { motion } from 'framer-motion';

export default function CuboidVisual({ type, data, compact = false, maxH = null, maxW = null }) {
  if (!data) return null;

  const width = maxW || (compact ? 260 : 440);
  const height = maxH || (compact ? 150 : 240);

  // ─── 1. Isometric Cuboid & Masked Cuboid ─────────────────────────────────
  if (type === 'isoCuboid' || type === 'isoCuboidMasked') {
    const { l = 8, b = 5, h = 4, unit = 'cm', hidden = null } = data;
    // Scale dimensions to fit SVG
    const maxDim = Math.max(l, b, h, 10);
    const scale = (compact ? 55 : 95) / maxDim;
    const sl = Math.max(22, Math.min(135, l * scale));
    const sb = Math.max(18, Math.min(95, b * scale * 0.8));
    const sh = Math.max(18, Math.min(105, h * scale));

    const cx = width / 2 - (sl - sb) * 0.35;
    const cy = height / 2 + sh * 0.25;

    // Isometric projection points
    const p0 = { x: cx, y: cy }; // Front bottom
    const p1 = { x: cx + sl, y: cy - sl * 0.3 }; // Right bottom
    const p2 = { x: cx - sb, y: cy - sb * 0.3 }; // Left bottom
    const p3 = { x: cx, y: cy - sh }; // Front top
    const p4 = { x: cx + sl, y: cy - sl * 0.3 - sh }; // Right top
    const p5 = { x: cx - sb, y: cy - sb * 0.3 - sh }; // Left top
    const p6 = { x: cx + sl - sb, y: cy - sl * 0.3 - sb * 0.3 - sh }; // Back top

    const lText = hidden === 'l' ? '?' : `${l} ${unit}`;
    const bText = hidden === 'b' ? '?' : `${b} ${unit}`;
    const hText = hidden === 'h' ? '?' : `${h} ${unit}`;

    return (
      <div className="cuboid-visual-wrap" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <defs>
            <linearGradient id="topFace" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.75" />
            </linearGradient>
            <linearGradient id="rightFace" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#b45309" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#78350f" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="leftFace" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d97706" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#92400e" stopOpacity="0.95" />
            </linearGradient>
          </defs>

          {/* Left Face (Breadth x Height) */}
          <polygon
            points={`${p0.x},${p0.y} ${p2.x},${p2.y} ${p5.x},${p5.y} ${p3.x},${p3.y}`}
            fill="url(#leftFace)"
            stroke="#fbbf24"
            strokeWidth="1.5"
          />

          {/* Right Face (Length x Height) */}
          <polygon
            points={`${p0.x},${p0.y} ${p1.x},${p1.y} ${p4.x},${p4.y} ${p3.x},${p3.y}`}
            fill="url(#rightFace)"
            stroke="#fbbf24"
            strokeWidth="1.5"
          />

          {/* Top Face (Length x Breadth) */}
          <polygon
            points={`${p3.x},${p3.y} ${p4.x},${p4.y} ${p6.x},${p6.y} ${p5.x},${p5.y}`}
            fill="url(#topFace)"
            stroke="#fde68a"
            strokeWidth="1.5"
          />

          {/* Dimension Labels */}
          {/* Length Label along right bottom edge */}
          <text
            x={(p0.x + p1.x) / 2 + 12}
            y={(p0.y + p1.y) / 2 + 18}
            fill={hidden === 'l' ? 'var(--gold)' : '#ffffff'}
            fontSize={hidden === 'l' ? '20' : compact ? '12' : '15'}
            fontWeight="bold"
            textAnchor="middle"
          >
            {lText}
          </text>

          {/* Breadth Label along left bottom edge */}
          <text
            x={(p0.x + p2.x) / 2 - 16}
            y={(p0.y + p2.y) / 2 + 18}
            fill={hidden === 'b' ? 'var(--gold)' : '#ffffff'}
            fontSize={hidden === 'b' ? '20' : compact ? '12' : '15'}
            fontWeight="bold"
            textAnchor="middle"
          >
            {bText}
          </text>

          {/* Height Label along front vertical edge */}
          <text
            x={p0.x - 16}
            y={(p0.y + p3.y) / 2}
            fill={hidden === 'h' ? 'var(--gold)' : '#ffffff'}
            fontSize={hidden === 'h' ? '20' : compact ? '12' : '15'}
            fontWeight="bold"
            textAnchor="end"
          >
            {hText}
          </text>
        </svg>
      </div>
    );
  }

  // ─── 2. Base Highlight ──────────────────────────────────────────────────
  if (type === 'baseHighlight') {
    const { l = 8, b = 5, h = 6, area = null, unit = 'cm' } = data;
    const maxDim = Math.max(l, b, h, 10);
    const scale = (compact ? 55 : 95) / maxDim;
    const sl = Math.max(25, Math.min(135, l * scale));
    const sb = Math.max(20, Math.min(95, b * scale * 0.8));
    const sh = Math.max(20, Math.min(105, h * scale));

    const cx = width / 2 - (sl - sb) * 0.35;
    const cy = height / 2 + sh * 0.25;

    const p0 = { x: cx, y: cy };
    const p1 = { x: cx + sl, y: cy - sl * 0.3 };
    const p2 = { x: cx - sb, y: cy - sb * 0.3 };
    const pBack = { x: cx + sl - sb, y: cy - sl * 0.3 - sb * 0.3 };
    const p3 = { x: cx, y: cy - sh };
    const p4 = { x: cx + sl, y: cy - sl * 0.3 - sh };
    const p5 = { x: cx - sb, y: cy - sb * 0.3 - sh };
    const p6 = { x: cx + sl - sb, y: cy - sl * 0.3 - sb * 0.3 - sh };

    return (
      <div className="cuboid-visual-wrap" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* Shaded Base Plane (highlighted green / teal) */}
          <polygon
            points={`${p0.x},${p0.y} ${p1.x},${p1.y} ${pBack.x},${pBack.y} ${p2.x},${p2.y}`}
            fill="rgba(52, 211, 153, 0.45)"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeDasharray="4 2"
          />

          {/* Wireframe edges for cuboid upper part */}
          <polygon
            points={`${p0.x},${p0.y} ${p2.x},${p2.y} ${p5.x},${p5.y} ${p3.x},${p3.y}`}
            fill="rgba(59, 130, 246, 0.15)"
            stroke="#60a5fa"
            strokeWidth="1.5"
          />
          <polygon
            points={`${p0.x},${p0.y} ${p1.x},${p1.y} ${p4.x},${p4.y} ${p3.x},${p3.y}`}
            fill="rgba(37, 99, 235, 0.2)"
            stroke="#60a5fa"
            strokeWidth="1.5"
          />
          <polygon
            points={`${p3.x},${p3.y} ${p4.x},${p4.y} ${p6.x},${p6.y} ${p5.x},${p5.y}`}
            fill="rgba(96, 165, 250, 0.25)"
            stroke="#93c5fd"
            strokeWidth="1.5"
          />

          {/* Base Area text pill in centre of base */}
          <g transform={`translate(${cx + (sl - sb) * 0.35}, ${cy - (sl + sb) * 0.15})`}>
            <rect x="-65" y="-14" width="130" height="28" rx="14" fill="rgba(16, 185, 129, 0.95)" />
            <text x="0" y="5" fill="#ffffff" fontSize={compact ? '11' : '13'} fontWeight="800" textAnchor="middle">
              {area ? `Base: ${area} ${unit}²` : 'Base Area'}
            </text>
          </g>

          {/* Height label */}
          <text
            x={p0.x - 16}
            y={(p0.y + p3.y) / 2}
            fill="#facc15"
            fontSize={compact ? '12' : '15'}
            fontWeight="bold"
            textAnchor="end"
          >
            h: {h} {unit}
          </text>
        </svg>
      </div>
    );
  }

  // ─── 3. Face Highlight ──────────────────────────────────────────────────
  if (type === 'faceHighlight') {
    const { l = 10, b = 6, h = 5, face = 'front', unit = 'cm' } = data;
    const maxDim = Math.max(l, b, h, 10);
    const scale = (compact ? 55 : 95) / maxDim;
    const sl = Math.max(25, Math.min(135, l * scale));
    const sb = Math.max(20, Math.min(95, b * scale * 0.8));
    const sh = Math.max(20, Math.min(105, h * scale));

    const cx = width / 2 - (sl - sb) * 0.35;
    const cy = height / 2 + sh * 0.25;

    const p0 = { x: cx, y: cy };
    const p1 = { x: cx + sl, y: cy - sl * 0.3 };
    const p2 = { x: cx - sb, y: cy - sb * 0.3 };
    const p3 = { x: cx, y: cy - sh };
    const p4 = { x: cx + sl, y: cy - sl * 0.3 - sh };
    const p5 = { x: cx - sb, y: cy - sb * 0.3 - sh };
    const p6 = { x: cx + sl - sb, y: cy - sl * 0.3 - sb * 0.3 - sh };

    const isSide = face === 'side' || face === 'end';
    const isFront = face === 'front';
    const isTop = face === 'top';

    return (
      <div className="cuboid-visual-wrap" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* Side/Left Face */}
          <polygon
            points={`${p0.x},${p0.y} ${p2.x},${p2.y} ${p5.x},${p5.y} ${p3.x},${p3.y}`}
            fill={isSide ? 'rgba(236, 72, 153, 0.7)' : 'rgba(255,255,255,0.08)'}
            stroke={isSide ? '#f472b6' : 'rgba(255,255,255,0.3)'}
            strokeWidth={isSide ? '2.5' : '1'}
          />

          {/* Front/Right Face */}
          <polygon
            points={`${p0.x},${p0.y} ${p1.x},${p1.y} ${p4.x},${p4.y} ${p3.x},${p3.y}`}
            fill={isFront ? 'rgba(236, 72, 153, 0.7)' : 'rgba(255,255,255,0.12)'}
            stroke={isFront ? '#f472b6' : 'rgba(255,255,255,0.3)'}
            strokeWidth={isFront ? '2.5' : '1'}
          />

          {/* Top Face */}
          <polygon
            points={`${p3.x},${p3.y} ${p4.x},${p4.y} ${p6.x},${p6.y} ${p5.x},${p5.y}`}
            fill={isTop ? 'rgba(236, 72, 153, 0.7)' : 'rgba(255,255,255,0.18)'}
            stroke={isTop ? '#f472b6' : 'rgba(255,255,255,0.3)'}
            strokeWidth={isTop ? '2.5' : '1'}
          />

          {/* Highlight Face Badge */}
          <text
            x={isSide ? (p0.x + p2.x) / 2 - 4 : (p0.x + p1.x) / 2 + 4}
            y={(p0.y + p3.y) / 2}
            fill="#ffffff"
            fontSize={compact ? '11' : '13'}
            fontWeight="bold"
            textAnchor="middle"
          >
            Shaded Face
          </text>

          {/* Dimension indicator for known dimension */}
          <text
            x={(p0.x + p1.x) / 2 + 12}
            y={(p0.y + p1.y) / 2 + 20}
            fill="#facc15"
            fontSize={compact ? '12' : '15'}
            fontWeight="bold"
            textAnchor="middle"
          >
            Length: {l} {unit}
          </text>
        </svg>
      </div>
    );
  }

  // ─── 4. Tank Water & Capacity ───────────────────────────────────────────
  if (type === 'tankWater') {
    const {
      l = 30,
      b = 20,
      h = 25,
      waterHeight: wHeight = 10,
      waterCm3 = 6000,
      overflow = false,
    } = data;

    const tankW = compact ? 150 : 250;
    const tankH = compact ? 100 : 155;
    const fillPercent = Math.min(100, Math.max(0, (wHeight / h) * 100));
    const waterLevelY = tankH * (1 - fillPercent / 100);

    const startX = (width - tankW) / 2;
    const startY = (height - tankH) / 2 - 8;

    return (
      <div className="cuboid-visual-wrap" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <defs>
            <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.95" />
            </linearGradient>
          </defs>

          {/* Tank Glass Body */}
          <rect
            x={startX}
            y={startY}
            width={tankW}
            height={tankH}
            rx="8"
            fill="rgba(255, 255, 255, 0.05)"
            stroke="#38bdf8"
            strokeWidth="3.5"
          />

          {/* Water Fill */}
          {fillPercent > 0 && (
            <motion.rect
              initial={{ height: 0, y: startY + tankH }}
              animate={{ height: tankH - waterLevelY, y: startY + waterLevelY }}
              transition={{ duration: 0.4 }}
              x={startX + 3}
              width={tankW - 6}
              rx="4"
              fill="url(#waterGrad)"
            />
          )}

          {/* Water Surface Line */}
          {fillPercent > 0 && (
            <line
              x1={startX + 2}
              y1={startY + waterLevelY}
              x2={startX + tankW - 2}
              y2={startY + waterLevelY}
              stroke="#e0f2fe"
              strokeWidth="3"
            />
          )}

          {/* Measurement ticks */}
          <line x1={startX - 6} y1={startY} x2={startX} y2={startY} stroke="#ffffff" strokeWidth="2" />
          <text x={startX - 10} y={startY + 4} fill="#ffffff" fontSize={compact ? '10' : '12'} fontWeight="bold" textAnchor="end">{h} cm</text>

          {fillPercent > 0 && (
            <>
              <line
                x1={startX + tankW}
                y1={startY + waterLevelY}
                x2={startX + tankW + 8}
                y2={startY + waterLevelY}
                stroke="#38bdf8"
                strokeWidth="2.5"
              />
              <text
                x={startX + tankW + 12}
                y={startY + waterLevelY + 5}
                fill="#38bdf8"
                fontSize={compact ? '11' : '13'}
                fontWeight="bold"
              >
                {Math.round(wHeight)} cm
              </text>
            </>
          )}

          {/* Bottom dimension labels */}
          <text
            x={startX + tankW / 2}
            y={startY + tankH + 18}
            fill="#cbd5e1"
            fontSize={compact ? '11' : '13'}
            fontWeight="bold"
            textAnchor="middle"
          >
            Base: {l} cm × {b} cm
          </text>

          {/* Overflow indicator if tank overflows */}
          {overflow && (
            <text x={width / 2} y={startY - 6} fill="#ef4444" fontSize="13" fontWeight="bold" textAnchor="middle">
              ⚠️ TANK OVERFLOW!
            </text>
          )}
        </svg>

        {waterCm3 !== undefined && (
          <div style={{ fontSize: compact ? '0.82rem' : '0.96rem', color: '#38bdf8', fontWeight: 800, marginTop: '4px' }}>
            💧 {waterCm3.toLocaleString()} cm³ ({waterCm3 / 1000} L)
          </div>
        )}
      </div>
    );
  }

  // ─── 5. Layer Fill (Simulate Station 1 & Practice) ───────────────────────
  if (type === 'layerFill') {
    const { l = 4, b = 3, h = 3, layersShown = 1 } = data;
    const cubeSize = compact ? 12 : 18;
    const startX = width / 2;
    const startY = height / 2 + (h * cubeSize * 0.38);

    return (
      <div className="cuboid-visual-wrap" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          {Array.from({ length: Math.min(layersShown, h) }).map((_, layerIdx) => (
            <g key={`layer-${layerIdx}`}>
              {Array.from({ length: b }).map((_, bi) =>
                Array.from({ length: l }).map((_, li) => {
                  const ix = startX + (li - bi) * (cubeSize * 0.85);
                  const iy = startY - (li + bi) * (cubeSize * 0.4) - layerIdx * (cubeSize * 1.1);

                  const isBase = layerIdx === 0;
                  const faceColor = isBase ? '#10b981' : '#3b82f6';
                  const strokeColor = isBase ? '#059669' : '#2563eb';

                  return (
                    <g key={`c-${layerIdx}-${bi}-${li}`} transform={`translate(${ix}, ${iy})`}>
                      {/* Top diamond */}
                      <polygon
                        points={`0,${-cubeSize * 0.5} ${cubeSize * 0.85},0 0,${cubeSize * 0.5} ${-cubeSize * 0.85},0`}
                        fill={faceColor}
                        opacity="0.9"
                        stroke={strokeColor}
                        strokeWidth="1.2"
                      />
                      {/* Left wall */}
                      <polygon
                        points={`${-cubeSize * 0.85},0 0,${cubeSize * 0.5} 0,${cubeSize * 1.2} ${-cubeSize * 0.85},${cubeSize * 0.7}`}
                        fill={faceColor}
                        opacity="0.65"
                        stroke={strokeColor}
                        strokeWidth="1.2"
                      />
                      {/* Right wall */}
                      <polygon
                        points={`0,${cubeSize * 0.5} ${cubeSize * 0.85},0 ${cubeSize * 0.85},${cubeSize * 0.7} 0,${cubeSize * 1.2}`}
                        fill={faceColor}
                        opacity="0.5"
                        stroke={strokeColor}
                        strokeWidth="1.2"
                      />
                    </g>
                  );
                })
              )}
            </g>
          ))}
        </svg>
      </div>
    );
  }

  // ─── 6. Net Unfold (Simulate Station 1) ──────────────────────────────────
  if (type === 'netUnfold') {
    const { l = 4, b = 3, h = 2, unfoldProgress = 1 } = data;
    // Cross net: Base in centre; Top, Back, Front, Left, Right attached
    const scale = compact ? 11 : 18;
    const fw = l * scale;
    const fh = b * scale;
    const depth = h * scale;

    const cx = width / 2;
    const cy = height / 2;

    return (
      <div className="cuboid-visual-wrap" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <g transform={`translate(${cx}, ${cy})`}>
            {/* Center Base Face */}
            <rect
              x={-fw / 2}
              y={-fh / 2}
              width={fw}
              height={fh}
              fill="rgba(16, 185, 129, 0.45)"
              stroke="#10b981"
              strokeWidth="2.5"
            />
            <text x="0" y="5" fill="#ffffff" fontSize={compact ? '10' : '12'} fontWeight="bold" textAnchor="middle">BASE</text>

            {/* Top Face (folds up past back) */}
            <g transform={`translate(0, ${-fh / 2 - depth * unfoldProgress})`}>
              <rect x={-fw / 2} y={-fh} width={fw} height={fh} fill="rgba(245, 158, 11, 0.35)" stroke="#f59e0b" strokeWidth="2" />
              <text x="0" y={-fh / 2 + 4} fill="#ffffff" fontSize={compact ? '9' : '11'} fontWeight="bold" textAnchor="middle">TOP</text>
            </g>

            {/* Back Face */}
            <g transform={`translate(0, ${-fh / 2})`}>
              <rect x={-fw / 2} y={-depth * unfoldProgress} width={fw} height={depth * unfoldProgress} fill="rgba(59, 130, 246, 0.35)" stroke="#3b82f6" strokeWidth="2" />
              <text x="0" y={(-depth * unfoldProgress) / 2 + 4} fill="#ffffff" fontSize={compact ? '8' : '11'} fontWeight="bold" textAnchor="middle">BACK</text>
            </g>

            {/* Front Face */}
            <g transform={`translate(0, ${fh / 2})`}>
              <rect x={-fw / 2} y="0" width={fw} height={depth * unfoldProgress} fill="rgba(59, 130, 246, 0.35)" stroke="#3b82f6" strokeWidth="2" />
              <text x="0" y={(depth * unfoldProgress) / 2 + 4} fill="#ffffff" fontSize={compact ? '8' : '11'} fontWeight="bold" textAnchor="middle">FRONT</text>
            </g>

            {/* Left Face */}
            <g transform={`translate(${-fw / 2}, 0)`}>
              <rect x={-depth * unfoldProgress} y={-fh / 2} width={depth * unfoldProgress} height={fh} fill="rgba(168, 85, 247, 0.35)" stroke="#a855f7" strokeWidth="2" />
              <text x={(-depth * unfoldProgress) / 2} y="4" fill="#ffffff" fontSize={compact ? '8' : '11'} fontWeight="bold" textAnchor="middle">LEFT</text>
            </g>

            {/* Right Face */}
            <g transform={`translate(${fw / 2}, 0)`}>
              <rect x="0" y={-fh / 2} width={depth * unfoldProgress} height={fh} fill="rgba(168, 85, 247, 0.35)" stroke="#a855f7" strokeWidth="2" />
              <text x={(depth * unfoldProgress) / 2} y="4" fill="#ffffff" fontSize={compact ? '8' : '11'} fontWeight="bold" textAnchor="middle">RIGHT</text>
            </g>
          </g>
        </svg>
      </div>
    );
  }

  // ─── 7. Stack Grid (Packing carton) ─────────────────────────────────────
  if (type === 'stackGrid') {
    const { outer = { l: 40, b: 20, h: 8 }, inner = { l: 10, b: 5, h: 4 }, count = 32 } = data;
    const cols = Math.min(6, Math.max(1, Math.floor(outer.l / inner.l)));
    const rows = Math.min(4, Math.max(1, Math.floor(outer.b / inner.b)));
    const layers = Math.min(3, Math.max(1, Math.floor(outer.h / inner.h)));

    return (
      <div className="cuboid-visual-wrap" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ padding: '8px 14px', background: 'rgba(255,255,255,0.06)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)', textAlign: 'center' }}>
          <div style={{ fontSize: compact ? '0.8rem' : '0.9rem', color: 'var(--gold)', fontWeight: 800 }}>
            📦 Carton: {outer.l} × {outer.b} × {outer.h} cm
          </div>
          <div style={{ fontSize: compact ? '0.75rem' : '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
            Inner boxes: {inner.l} × {inner.b} × {inner.h} cm each
          </div>
          <div style={{ display: 'inline-block', marginTop: '6px', padding: '4px 12px', borderRadius: '16px', background: 'rgba(56, 189, 248, 0.2)', border: '1px solid #38bdf8', color: '#e0f2fe', fontWeight: 800, fontSize: '0.88rem' }}>
            Fit per axis: {outer.l / inner.l} × {outer.b / inner.b} × {outer.h / inner.h} = {count} boxes
          </div>
        </div>
      </div>
    );
  }

  // ─── 8. Compare Pair ────────────────────────────────────────────────────
  if (type === 'comparePair') {
    const { a = { l: 12, b: 5, h: 4, name: 'Box A' }, b = { l: 9, b: 6, h: 5, name: 'Box B' } } = data;
    const vA = a.l * a.b * a.h;
    const vB = b.l * b.b * b.h;

    return (
      <div className="cuboid-visual-wrap" style={{ display: 'flex', gap: '12px', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        <div style={{ flex: 1, padding: '8px', background: 'rgba(56, 189, 248, 0.1)', border: '1.5px solid #38bdf8', borderRadius: '12px', textAlign: 'center' }}>
          <span style={{ fontWeight: 800, color: '#38bdf8', fontSize: '0.9rem' }}>{a.name || 'Box A'}</span>
          <div style={{ fontSize: '0.78rem', color: '#e2e8f0', marginTop: '2px' }}>{a.l} × {a.b} × {a.h} cm</div>
          <div style={{ fontSize: '0.92rem', fontWeight: 900, color: 'var(--gold)', marginTop: '4px' }}>{vA} cm³</div>
        </div>
        <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'rgba(255,255,255,0.4)' }}>VS</div>
        <div style={{ flex: 1, padding: '8px', background: 'rgba(244, 114, 182, 0.1)', border: '1.5px solid #f472b6', borderRadius: '12px', textAlign: 'center' }}>
          <span style={{ fontWeight: 800, color: '#f472b6', fontSize: '0.9rem' }}>{b.name || 'Box B'}</span>
          <div style={{ fontSize: '0.78rem', color: '#e2e8f0', marginTop: '2px' }}>{b.l} × {b.b} × {b.h} cm</div>
          <div style={{ fontSize: '0.92rem', fontWeight: 900, color: 'var(--gold)', marginTop: '4px' }}>{vB} cm³</div>
        </div>
      </div>
    );
  }

  // ─── 9. Packing Slip (Station 4 Error Detective) ─────────────────────────
  if (type === 'packingSlip') {
    const { lines = [], errorIndex = -1, selectedLine = null, fixedLine = null, isChecked = false } = data;

    return (
      <div className="packing-slip-card" style={{ background: '#fef3c7', color: '#1e293b', padding: '14px 18px', borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.35)', border: '2px dashed #d97706', maxWidth: '320px', width: '100%', fontFamily: 'monospace' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #b45309', paddingBottom: '6px', marginBottom: '8px' }}>
          <span style={{ fontWeight: 900, letterSpacing: '1px' }}>DEPOT PACKING SLIP</span>
          {isChecked && <span style={{ color: '#059669', fontWeight: 900, border: '2px solid #059669', padding: '1px 6px', borderRadius: '4px', transform: 'rotate(-5deg)' }}>CHECKED ✓</span>}
        </div>
        {lines.map((line, idx) => {
          const isErrorLine = idx === errorIndex;
          const isFixed = isChecked && isErrorLine;
          return (
            <div
              key={idx}
              style={{
                padding: '4px 6px',
                margin: '3px 0',
                borderRadius: '4px',
                background: selectedLine === idx ? (isErrorLine ? 'rgba(239, 68, 68, 0.2)' : 'rgba(100, 116, 139, 0.15)') : 'transparent',
                border: isErrorLine && !isChecked ? '1px dashed #ef4444' : 'none',
              }}
            >
              {isFixed ? (
                <div>
                  <span style={{ textDecoration: 'line-through', color: '#ef4444', marginRight: '6px' }}>{line}</span>
                  <span style={{ color: '#059669', fontWeight: 'bold' }}>{fixedLine || line}</span>
                </div>
              ) : (
                <span>{line}</span>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return null;
}
