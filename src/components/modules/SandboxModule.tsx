import React, { useState, useMemo } from 'react';
import { InteractiveGraph } from '../InteractiveGraph.tsx';
import { MathView } from '../MathView.tsx';
import { Sliders, Eye, Table as TableIcon, Sparkles, RotateCcw } from 'lucide-react';

export const SandboxModule: React.FC = () => {
  const [curveType, setCurveType] = useState<'quadratic' | 'cubic' | 'hyperbola' | 'reciprocal_sq'>('quadratic');
  const [a, setA] = useState<number>(1);
  const [b, setB] = useState<number>(-2);
  const [c, setC] = useState<number>(-3);
  const [d, setD] = useState<number>(0);

  const [showTangent, setShowTangent] = useState<boolean>(true);
  const [tangentX, setTangentX] = useState<number>(2);

  // Table of values generator settings
  const [tableStart, setTableStart] = useState<number>(-3);
  const [tableEnd, setTableEnd] = useState<number>(3);
  const [tableStep, setTableStep] = useState<number>(1);

  // Compute table of values
  const generatedTable = useMemo(() => {
    const rows: { x: number; y: number | null }[] = [];
    const step = tableStep > 0 ? tableStep : 1;
    for (let x = tableStart; x <= tableEnd + 0.001; x += step) {
      const roundedX = parseFloat(x.toFixed(2));
      let yVal: number | null = null;
      if (curveType === 'quadratic') {
        yVal = a * roundedX * roundedX + b * roundedX + c;
      } else if (curveType === 'cubic') {
        yVal = a * roundedX * roundedX * roundedX + b * roundedX * roundedX + c * roundedX + d;
      } else if (curveType === 'hyperbola') {
        if (Math.abs(roundedX) > 0.001) yVal = a / roundedX;
      } else if (curveType === 'reciprocal_sq') {
        if (Math.abs(roundedX) > 0.001) yVal = a / (roundedX * roundedX);
      }
      rows.push({ x: roundedX, y: yVal !== null ? parseFloat(yVal.toFixed(2)) : null });
    }
    return rows;
  }, [curveType, a, b, c, d, tableStart, tableEnd, tableStep]);

  const resetSandbox = () => {
    setCurveType('quadratic');
    setA(1);
    setB(-2);
    setC(-3);
    setD(0);
    setTangentX(2);
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#101B38] border border-[#23324C] rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E293B] pb-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#4CC9F0] uppercase tracking-wider mb-1">
              <span>Interactive Graphing Laboratory</span>
              <span>·</span>
              <span>Free Exploration</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Curved Graphs Sandbox & Tangent Analyzer
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Curve Type Selector */}
            <div className="flex items-center gap-1 bg-[#1C2541] p-1 rounded-lg border border-[#2A3B5C]">
              {(['quadratic', 'cubic', 'hyperbola', 'reciprocal_sq'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setCurveType(type);
                    if (type === 'hyperbola') setA(6);
                    if (type === 'reciprocal_sq') setA(4);
                    if (type === 'cubic') {
                      setA(1);
                      setB(0);
                      setC(-3);
                      setD(1);
                    }
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    curveType === type
                      ? 'bg-[#4CC9F0] text-[#0A1128] font-bold shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {type === 'quadratic'
                    ? 'Quadratic'
                    : type === 'cubic'
                    ? 'Cubic'
                    : type === 'hyperbola'
                    ? 'Reciprocal (a/x)'
                    : 'Volcano (a/x²)'}
                </button>
              ))}
            </div>

            <button
              onClick={resetSandbox}
              title="Reset parameters"
              className="p-2 rounded-lg bg-[#1C2541] hover:bg-[#2A3B5C] text-slate-300 border border-[#2A3B5C] transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Two-Zone Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Graph Stage */}
          <div className="lg:col-span-7 space-y-4">
            <InteractiveGraph
              type={curveType}
              params={{ a, b, c, d }}
              xDomain={[-6, 6]}
              yDomain={[-10, 12]}
              showVertex={true}
              showRoots={true}
              showYIntercept={true}
              showSymmetry={curveType === 'quadratic'}
              showAsymptotes={curveType === 'hyperbola' || curveType === 'reciprocal_sq'}
              showTangent={showTangent}
              tangentX={tangentX}
              onTangentXChange={setTangentX}
            />

            {/* Tangent Toggle */}
            <div className="flex items-center justify-between p-3 bg-[#0D152D] rounded-xl border border-[#23324C] text-xs">
              <span className="text-slate-300 font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-400" />
                Tangent Line & Gradient Tool (IGCSE 0580 Examination Essential)
              </span>
              <button
                onClick={() => setShowTangent(!showTangent)}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  showTangent
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'bg-[#1C2541] text-slate-400'
                }`}
              >
                {showTangent ? 'Tangent Active' : 'Enable Tangent'}
              </button>
            </div>
          </div>

          {/* Controls & Table Generator Deck */}
          <div className="lg:col-span-5 space-y-4">
            {/* Sliders Panel */}
            <div className="bg-[#0D152D] rounded-xl p-4 border border-[#23324C] space-y-3">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#4CC9F0]" /> Parameter Tuning
              </span>

              {/* Slider for a */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">Leading Coefficient (a)</span>
                  <span className="font-mono font-bold text-cyan-300">{a}</span>
                </div>
                <input
                  type="range"
                  min="-4"
                  max="4"
                  step="0.5"
                  value={a}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setA(val === 0 ? (a < 0 ? 0.5 : -0.5) : val);
                  }}
                  className="w-full accent-[#4CC9F0] cursor-pointer"
                />
              </div>

              {(curveType === 'quadratic' || curveType === 'cubic') && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">Coefficient (b)</span>
                    <span className="font-mono font-bold text-cyan-300">{b}</span>
                  </div>
                  <input
                    type="range"
                    min="-6"
                    max="6"
                    step="1"
                    value={b}
                    onChange={(e) => setB(parseFloat(e.target.value))}
                    className="w-full accent-[#4CC9F0] cursor-pointer"
                  />
                </div>
              )}

              {(curveType === 'quadratic' || curveType === 'cubic') && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">Constant (c)</span>
                    <span className="font-mono font-bold text-amber-300">{c}</span>
                  </div>
                  <input
                    type="range"
                    min="-8"
                    max="8"
                    step="1"
                    value={c}
                    onChange={(e) => setC(parseFloat(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>
              )}

              {curveType === 'cubic' && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">Vertical Shift (d)</span>
                    <span className="font-mono font-bold text-amber-300">{d}</span>
                  </div>
                  <input
                    type="range"
                    min="-6"
                    max="6"
                    step="1"
                    value={d}
                    onChange={(e) => setD(parseFloat(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Dynamic Table Generator */}
            <div className="bg-[#0D152D] rounded-xl p-4 border border-[#23324C] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <TableIcon className="w-3.5 h-3.5 text-cyan-400" /> Dynamic Table of Values
                </span>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500">Step:</span>
                  <select
                    value={tableStep}
                    onChange={(e) => setTableStep(parseFloat(e.target.value))}
                    className="bg-[#1C2541] border border-[#2A3B5C] rounded px-1.5 py-0.5 text-cyan-300 font-mono text-xs"
                  >
                    <option value={1}>1.0</option>
                    <option value={0.5}>0.5</option>
                    <option value={2}>2.0</option>
                  </select>
                </div>
              </div>

              {/* Range controls */}
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-1">
                  <span>Start x:</span>
                  <input
                    type="number"
                    value={tableStart}
                    onChange={(e) => setTableStart(parseInt(e.target.value) || -5)}
                    className="w-12 bg-[#1C2541] border border-[#2A3B5C] rounded px-1 py-0.5 font-mono text-center text-white"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <span>End x:</span>
                  <input
                    type="number"
                    value={tableEnd}
                    onChange={(e) => setTableEnd(parseInt(e.target.value) || 5)}
                    className="w-12 bg-[#1C2541] border border-[#2A3B5C] rounded px-1 py-0.5 font-mono text-center text-white"
                  />
                </div>
              </div>

              {/* Table Data View */}
              <div className="max-h-48 overflow-y-auto rounded-lg border border-[#1E293B]">
                <table className="w-full text-xs font-mono tabular-nums text-center">
                  <thead className="bg-[#141E38] text-slate-300 sticky top-0 border-b border-[#23324C]">
                    <tr>
                      <th className="py-1.5 px-3">x</th>
                      <th className="py-1.5 px-3">y = f(x)</th>
                      <th className="py-1.5 px-3">Coordinate (x, y)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1A2644]">
                    {generatedTable.map((row) => (
                      <tr key={`tbl-${row.x}`} className="hover:bg-[#162244]/60 transition-colors">
                        <td className="py-1 text-slate-300 font-bold">{row.x}</td>
                        <td className="py-1 text-[#4CC9F0]">
                          {row.y !== null ? row.y : <span className="text-rose-400">Undefined</span>}
                        </td>
                        <td className="py-1 text-slate-400 text-[11px]">
                          {row.y !== null ? `(${row.x}, ${row.y})` : 'None (Asymptote)'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
