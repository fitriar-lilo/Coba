import React, { useState, useMemo, useRef } from 'react';
import { MathView } from './MathView.tsx';

export interface GraphProps {
  type: 'quadratic' | 'cubic' | 'hyperbola' | 'reciprocal_sq' | 'custom';
  params?: {
    a: number;
    b?: number;
    c?: number;
    d?: number;
  };
  xDomain?: [number, number];
  yDomain?: [number, number];
  width?: number;
  height?: number;
  showVertex?: boolean;
  showRoots?: boolean;
  showYIntercept?: boolean;
  showSymmetry?: boolean;
  showAsymptotes?: boolean;
  showTangent?: boolean;
  tangentX?: number;
  onTangentXChange?: (x: number) => void;
  studentPoints?: { x: number; y: number; isCorrect?: boolean }[];
  highlightPoint?: { x: number; y: number; label?: string } | null;
  className?: string;
}

export const InteractiveGraph: React.FC<GraphProps> = ({
  type,
  params = { a: 1, b: 0, c: 0, d: 0 },
  xDomain = [-6, 6],
  yDomain = [-8, 10],
  width = 540,
  height = 380,
  showVertex = true,
  showRoots = true,
  showYIntercept = true,
  showSymmetry = true,
  showAsymptotes = true,
  showTangent = false,
  tangentX: controlledTangentX,
  onTangentXChange,
  studentPoints = [],
  highlightPoint = null,
  className = '',
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [internalHoverX, setInternalHoverX] = useState<number | null>(null);

  const a = params.a ?? 1;
  const b = params.b ?? 0;
  const c = params.c ?? 0;
  const d = params.d ?? 0;

  // Active tangent X position
  const activeTangentX = controlledTangentX !== undefined ? controlledTangentX : (internalHoverX ?? 1);

  // Evaluate function f(x)
  const evaluate = (x: number): number | null => {
    switch (type) {
      case 'quadratic':
        return a * x * x + b * x + c;
      case 'cubic':
        return a * x * x * x + b * x * x + c * x + d;
      case 'hyperbola':
        if (Math.abs(x) < 0.001) return null;
        return a / x;
      case 'reciprocal_sq':
        if (Math.abs(x) < 0.001) return null;
        return a / (x * x);
      default:
        return a * x * x + b * x + c;
    }
  };

  // Evaluate derivative f'(x) for tangent line
  const evaluateDerivative = (x: number): number | null => {
    switch (type) {
      case 'quadratic':
        return 2 * a * x + b;
      case 'cubic':
        return 3 * a * x * x + 2 * b * x + c;
      case 'hyperbola':
        if (Math.abs(x) < 0.001) return null;
        return -a / (x * x);
      case 'reciprocal_sq':
        if (Math.abs(x) < 0.001) return null;
        return -2 * a / (x * x * x);
      default:
        return 2 * a * x + b;
    }
  };

  // Coordinate transformations
  const [xMin, xMax] = xDomain;
  const [yMin, yMax] = yDomain;
  const padding = 38;
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;

  const toSvgX = (x: number) => padding + ((x - xMin) / (xMax - xMin)) * innerW;
  const toSvgY = (y: number) => height - padding - ((y - yMin) / (yMax - yMin)) * innerH;

  const fromSvgX = (svgX: number) => {
    const clampedSvgX = Math.max(padding, Math.min(width - padding, svgX));
    return xMin + ((clampedSvgX - padding) / innerW) * (xMax - xMin);
  };

  // Generate SVG path for the curve
  const curvePaths = useMemo(() => {
    const steps = 300;
    const paths: string[] = [];

    if (type === 'hyperbola' || type === 'reciprocal_sq') {
      // Split into two branches: negative x and positive x to avoid jump discontinuity
      let branch1 = '';
      let branch2 = '';

      for (let i = 0; i <= steps; i++) {
        const x = xMin + (i / steps) * (xMax - xMin);
        if (Math.abs(x) < 0.08) continue; // skip asymptote singularity

        const y = evaluate(x);
        if (y === null || isNaN(y)) continue;

        // Clip y within reasonable visual boundary
        const clampedY = Math.max(yMin - 5, Math.min(yMax + 5, y));
        const sx = toSvgX(x);
        const sy = toSvgY(clampedY);

        if (x < 0) {
          branch1 += branch1 === '' ? `M ${sx.toFixed(1)} ${sy.toFixed(1)}` : ` L ${sx.toFixed(1)} ${sy.toFixed(1)}`;
        } else {
          branch2 += branch2 === '' ? `M ${sx.toFixed(1)} ${sy.toFixed(1)}` : ` L ${sx.toFixed(1)} ${sy.toFixed(1)}`;
        }
      }
      if (branch1) paths.push(branch1);
      if (branch2) paths.push(branch2);
    } else {
      let currentPath = '';
      for (let i = 0; i <= steps; i++) {
        const x = xMin + (i / steps) * (xMax - xMin);
        const y = evaluate(x);
        if (y === null || isNaN(y)) continue;

        const clampedY = Math.max(yMin - 8, Math.min(yMax + 8, y));
        const sx = toSvgX(x);
        const sy = toSvgY(clampedY);

        if (currentPath === '') {
          currentPath = `M ${sx.toFixed(1)} ${sy.toFixed(1)}`;
        } else {
          currentPath += ` L ${sx.toFixed(1)} ${sy.toFixed(1)}`;
        }
      }
      if (currentPath) paths.push(currentPath);
    }

    return paths;
  }, [type, a, b, c, d, xMin, xMax, yMin, yMax, innerW, innerH]);

  // Key features calculation
  const keyFeatures = useMemo(() => {
    const list: { type: string; x: number; y: number; label: string; color: string }[] = [];

    if (type === 'quadratic') {
      // Vertex
      if (a !== 0) {
        const vx = -b / (2 * a);
        const vy = a * vx * vx + b * vx + c;
        if (vx >= xMin && vx <= xMax && vy >= yMin && vy <= yMax) {
          list.push({
            type: 'vertex',
            x: vx,
            y: vy,
            label: `Vertex (${vx.toFixed(2)}, ${vy.toFixed(2)})`,
            color: '#4CC9F0',
          });
        }
      }

      // Roots (b^2 - 4ac)
      const disc = b * b - 4 * a * c;
      if (disc >= 0 && a !== 0) {
        const r1 = (-b + Math.sqrt(disc)) / (2 * a);
        const r2 = (-b - Math.sqrt(disc)) / (2 * a);
        if (r1 >= xMin && r1 <= xMax) {
          list.push({ type: 'root', x: r1, y: 0, label: `Root (${r1.toFixed(2)}, 0)`, color: '#10B981' });
        }
        if (Math.abs(r1 - r2) > 0.05 && r2 >= xMin && r2 <= xMax) {
          list.push({ type: 'root', x: r2, y: 0, label: `Root (${r2.toFixed(2)}, 0)`, color: '#10B981' });
        }
      }

      // Y-intercept
      if (c >= yMin && c <= yMax && 0 >= xMin && 0 <= xMax) {
        list.push({ type: 'y-intercept', x: 0, y: c, label: `y-int (0, ${c.toFixed(1)})`, color: '#F59E0B' });
      }
    } else if (type === 'cubic') {
      // Cubic roots (numerical estimate or known extrema)
      // Derivative: 3ax^2 + 2bx + c = 0
      const dDisc = (2 * b) * (2 * b) - 4 * (3 * a) * c;
      if (dDisc >= 0 && a !== 0) {
        const x1 = (-2 * b + Math.sqrt(dDisc)) / (6 * a);
        const x2 = (-2 * b - Math.sqrt(dDisc)) / (6 * a);
        const y1 = evaluate(x1);
        const y2 = evaluate(x2);
        if (y1 !== null && x1 >= xMin && x1 <= xMax && y1 >= yMin && y1 <= yMax) {
          list.push({ type: 'extrema', x: x1, y: y1, label: `Turn (${x1.toFixed(2)}, ${y1.toFixed(2)})`, color: '#4CC9F0' });
        }
        if (y2 !== null && Math.abs(x1 - x2) > 0.05 && x2 >= xMin && x2 <= xMax && y2 >= yMin && y2 <= yMax) {
          list.push({ type: 'extrema', x: x2, y: y2, label: `Turn (${x2.toFixed(2)}, ${y2.toFixed(2)})`, color: '#A78BFA' });
        }
      }
      // Y-intercept
      if (d >= yMin && d <= yMax && 0 >= xMin && 0 <= xMax) {
        list.push({ type: 'y-intercept', x: 0, y: d, label: `y-int (0, ${d.toFixed(1)})`, color: '#F59E0B' });
      }
    }

    return list;
  }, [type, a, b, c, d, xMin, xMax, yMin, yMax]);

  // Tangent line calculations
  const tangentData = useMemo(() => {
    if (!showTangent) return null;
    const x0 = activeTangentX;
    const y0 = evaluate(x0);
    const m = evaluateDerivative(x0);

    if (y0 === null || m === null) return null;

    // Line equation: y - y0 = m(x - x0) => y = m(x - x0) + y0
    // Line endpoints across domain
    const dx = 2.2;
    const x1 = Math.max(xMin, x0 - dx);
    const x2 = Math.min(xMax, x0 + dx);
    const y1 = m * (x1 - x0) + y0;
    const y2 = m * (x2 - x0) + y0;

    return {
      x0,
      y0,
      m,
      x1,
      y1,
      x2,
      y2,
      svgX0: toSvgX(x0),
      svgY0: toSvgY(y0),
      svgX1: toSvgX(x1),
      svgY1: toSvgY(y1),
      svgX2: toSvgX(x2),
      svgY2: toSvgY(y2),
    };
  }, [showTangent, activeTangentX, a, b, c, d, type, xMin, xMax, yMin, yMax]);

  // Hover coordinate tracking
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const xVal = fromSvgX(clientX);
    setInternalHoverX(xVal);
    if (onTangentXChange) {
      onTangentXChange(parseFloat(xVal.toFixed(2)));
    }
  };

  const handleMouseLeave = () => {
    setInternalHoverX(null);
  };

  // Generate tick marks
  const xTicks = useMemo(() => {
    const ticks: number[] = [];
    for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
      if (x !== 0) ticks.push(x);
    }
    return ticks;
  }, [xMin, xMax]);

  const yTicks = useMemo(() => {
    const ticks: number[] = [];
    const step = yMax - yMin > 14 ? 2 : 1;
    for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y += step) {
      if (y !== 0) ticks.push(y);
    }
    return ticks;
  }, [yMin, yMax]);

  const originX = toSvgX(0);
  const originY = toSvgY(0);

  return (
    <div className={`relative flex flex-col items-center bg-[#0D152D] rounded-xl p-3 border border-[#23324C] shadow-lg select-none ${className}`}>
      {/* Top status bar above SVG */}
      <div className="w-full flex items-center justify-between px-2 mb-2 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#4CC9F0] tracking-wide uppercase text-[11px]">
            {type === 'quadratic' ? 'Quadratic Parabola' : type === 'cubic' ? 'Cubic S-Curve' : 'Reciprocal Hyperbola'}
          </span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-400 font-mono text-[11px]">
            x: [{xMin}, {xMax}] · y: [{yMin}, {yMax}]
          </span>
        </div>
        {internalHoverX !== null && (
          <div className="bg-[#1C2541] px-2.5 py-0.5 rounded border border-[#2A3B5C] font-mono text-xs text-cyan-300">
            x = {internalHoverX.toFixed(2)}, y = {evaluate(internalHoverX)?.toFixed(2) ?? 'undef'}
          </div>
        )}
      </div>

      {/* SVG Canvas */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto cursor-crosshair overflow-hidden rounded-lg bg-[#070D1E]"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <defs>
          <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#48CAE4" />
            <stop offset="50%" stopColor="#4CC9F0" />
            <stop offset="100%" stopColor="#7209B7" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Subtle Background Grid Lines */}
        <g stroke="#162238" strokeWidth="0.8">
          {xTicks.map((x) => (
            <line key={`gx-${x}`} x1={toSvgX(x)} y1={padding} x2={toSvgX(x)} y2={height - padding} />
          ))}
          {yTicks.map((y) => (
            <line key={`gy-${y}`} x1={padding} y1={toSvgY(y)} x2={width - padding} y2={toSvgY(y)} />
          ))}
        </g>

        {/* X and Y Axes */}
        <g stroke="#475569" strokeWidth="1.5">
          {/* X-axis */}
          {originY >= padding && originY <= height - padding && (
            <line x1={padding} y1={originY} x2={width - padding} y2={originY} />
          )}
          {/* Y-axis */}
          {originX >= padding && originX <= width - padding && (
            <line x1={originX} y1={padding} x2={originX} y2={height - padding} />
          )}
        </g>

        {/* Axis Arrows & Labels */}
        <text x={width - padding + 8} y={originY + 4} fill="#94A3B8" fontSize="12" fontWeight="600" fontFamily="sans-serif">
          x
        </text>
        <text x={originX - 4} y={padding - 10} fill="#94A3B8" fontSize="12" fontWeight="600" fontFamily="sans-serif" textAnchor="end">
          y
        </text>
        <text x={originX - 8} y={originY + 14} fill="#64748B" fontSize="10" fontFamily="monospace">
          0
        </text>

        {/* Tick labels */}
        <g fill="#64748B" fontSize="10" fontFamily="monospace" textAnchor="middle">
          {xTicks.map((x) => {
            const sx = toSvgX(x);
            return (
              <g key={`tlx-${x}`}>
                <line x1={sx} y1={originY - 3} x2={sx} y2={originY + 3} stroke="#64748B" strokeWidth="1" />
                <text x={sx} y={originY + 14}>
                  {x}
                </text>
              </g>
            );
          })}
          {yTicks.map((y) => {
            const sy = toSvgY(y);
            return (
              <g key={`tly-${y}`}>
                <line x1={originX - 3} y1={sy} x2={originX + 3} stroke="#64748B" strokeWidth="1" />
                <text x={originX - 10} y={sy + 3} textAnchor="end">
                  {y}
                </text>
              </g>
            );
          })}
        </g>

        {/* Hyperbola Asymptotes */}
        {showAsymptotes && (type === 'hyperbola' || type === 'reciprocal_sq') && (
          <g stroke="#EF4444" strokeWidth="1.2" strokeDasharray="5 4" opacity="0.8">
            {/* Vertical asymptote x = 0 */}
            <line x1={originX} y1={padding} x2={originX} y2={height - padding} />
            {/* Horizontal asymptote y = 0 */}
            <line x1={padding} y1={originY} x2={width - padding} y2={originY} />
            <text x={originX + 6} y={padding + 16} fill="#F87171" fontSize="10" fontFamily="monospace">
              Asymptote x = 0
            </text>
            <text x={width - padding - 90} y={originY - 6} fill="#F87171" fontSize="10" fontFamily="monospace">
              Asymptote y = 0
            </text>
          </g>
        )}

        {/* Axis of Symmetry for Quadratic */}
        {showSymmetry && type === 'quadratic' && a !== 0 && (
          <g stroke="#F59E0B" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.75">
            {(() => {
              const symX = -b / (2 * a);
              if (symX >= xMin && symX <= xMax) {
                const sx = toSvgX(symX);
                return (
                  <>
                    <line x1={sx} y1={padding} x2={sx} y2={height - padding} />
                    <text x={sx + 4} y={padding + 14} fill="#FBBF24" fontSize="10" fontFamily="monospace">
                      x = {symX.toFixed(1)}
                    </text>
                  </>
                );
              }
              return null;
            })()}
          </g>
        )}

        {/* The Mathematical Curve Paths */}
        {curvePaths.map((pathStr, idx) => (
          <path
            key={`curve-${idx}`}
            d={pathStr}
            fill="none"
            stroke="url(#curveGradient)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
          />
        ))}

        {/* Key Feature Markers (Turning Points, Roots, Intercepts) */}
        {keyFeatures.map((feat, idx) => {
          if (feat.type === 'vertex' && !showVertex) return null;
          if (feat.type === 'root' && !showRoots) return null;
          if (feat.type === 'y-intercept' && !showYIntercept) return null;

          const sx = toSvgX(feat.x);
          const sy = toSvgY(feat.y);
          return (
            <g key={`feat-${idx}`}>
              <circle cx={sx} cy={sy} r="5.5" fill={feat.color} stroke="#0A1128" strokeWidth="2" />
              <rect
                x={sx + 8}
                y={sy - 12}
                width={feat.label.length * 6.5 + 8}
                height="18"
                rx="4"
                fill="#0A1128"
                fillOpacity="0.88"
                stroke={feat.color}
                strokeWidth="1"
              />
              <text x={sx + 12} y={sy + 1} fill={feat.color} fontSize="9.5" fontWeight="600" fontFamily="monospace">
                {feat.label}
              </text>
            </g>
          );
        })}

        {/* Student Plotted Points (From Table of Values Workspace) */}
        {studentPoints.map((pt, idx) => {
          if (pt.x < xMin || pt.x > xMax || pt.y < yMin || pt.y > yMax) return null;
          const sx = toSvgX(pt.x);
          const sy = toSvgY(pt.y);
          const isCorrect = pt.isCorrect ?? true;
          return (
            <g key={`student-pt-${idx}`}>
              <circle
                cx={sx}
                cy={sy}
                r="6"
                fill={isCorrect ? '#10B981' : '#EF4444'}
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />
              <line x1={sx - 3} y1={sy - 3} x2={sx + 3} y2={sy + 3} stroke="#FFFFFF" strokeWidth="1.2" />
              <line x1={sx - 3} y1={sy + 3} x2={sx + 3} y2={sy - 3} stroke="#FFFFFF" strokeWidth="1.2" />
              <text
                x={sx}
                y={sy - 9}
                fill={isCorrect ? '#A7F3D0' : '#FECACA'}
                fontSize="9"
                fontFamily="monospace"
                textAnchor="middle"
              >
                ({pt.x}, {pt.y})
              </text>
            </g>
          );
        })}

        {/* Highlighted Point (e.g. from user hover or focus) */}
        {highlightPoint && (
          <g>
            <circle
              cx={toSvgX(highlightPoint.x)}
              cy={toSvgY(highlightPoint.y)}
              r="7"
              fill="#F43F5E"
              stroke="#FFF"
              strokeWidth="2"
            />
            {highlightPoint.label && (
              <text
                x={toSvgX(highlightPoint.x)}
                y={toSvgY(highlightPoint.y) - 12}
                fill="#FDA4AF"
                fontSize="11"
                fontWeight="bold"
                textAnchor="middle"
                fontFamily="monospace"
              >
                {highlightPoint.label}
              </text>
            )}
          </g>
        )}

        {/* Tangent Line & Slope Triangle (Signature IGCSE Skill) */}
        {tangentData && (
          <g>
            {/* Tangent line */}
            <line
              x1={tangentData.svgX1}
              y1={tangentData.svgY1}
              x2={tangentData.svgX2}
              y2={tangentData.svgY2}
              stroke="#F43F5E"
              strokeWidth="2.4"
              strokeDasharray="6 3"
            />
            {/* Tangency contact point */}
            <circle
              cx={tangentData.svgX0}
              cy={tangentData.svgY0}
              r="6.5"
              fill="#F43F5E"
              stroke="#FFF"
              strokeWidth="2"
            />
            {/* Tangent Info Card inside SVG */}
            <g transform={`translate(${padding + 10}, ${height - padding - 45})`}>
              <rect width="210" height="38" rx="6" fill="#0A1128" stroke="#F43F5E" strokeWidth="1.2" fillOpacity="0.9" />
              <text x="10" y="16" fill="#FDA4AF" fontSize="10" fontWeight="600">
                Tangent at x = {tangentData.x0.toFixed(2)}
              </text>
              <text x="10" y="30" fill="#FFFFFF" fontSize="10" fontFamily="monospace">
                Gradient m = {tangentData.m.toFixed(2)}
              </text>
            </g>
          </g>
        )}
      </svg>

      {/* Tangent Interactive Control Slider (if showTangent enabled) */}
      {showTangent && (
        <div className="w-full mt-2 pt-2 border-t border-[#23324C] flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Tangent Position x:</span>
            <span className="font-mono text-rose-400 font-bold">{activeTangentX.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={xMin + 0.5}
            max={xMax - 0.5}
            step="0.1"
            value={activeTangentX}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              if (onTangentXChange) onTangentXChange(val);
              setInternalHoverX(val);
            }}
            className="w-48 accent-rose-500 cursor-pointer"
          />
          <span className="text-slate-400 font-mono">
            m ≈ <strong className="text-rose-300 font-bold">{evaluateDerivative(activeTangentX)?.toFixed(2)}</strong>
          </span>
        </div>
      )}
    </div>
  );
};
