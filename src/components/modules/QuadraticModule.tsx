import React, { useState } from 'react';
import { InteractiveGraph } from '../InteractiveGraph.tsx';
import { MathView } from '../MathView.tsx';
import { Sliders, Eye, HelpCircle, Sparkles } from 'lucide-react';

interface QuadraticModuleProps {
  onGoToPractice?: () => void;
}

export const QuadraticModule: React.FC<QuadraticModuleProps> = ({ onGoToPractice }) => {
  const [a, setA] = useState<number>(1);
  const [b, setB] = useState<number>(-3);
  const [c, setC] = useState<number>(-4);

  const [showVertex, setShowVertex] = useState<boolean>(true);
  const [showRoots, setShowRoots] = useState<boolean>(true);
  const [showYIntercept, setShowYIntercept] = useState<boolean>(true);
  const [showSymmetry, setShowSymmetry] = useState<boolean>(true);
  const [showTangent, setShowTangent] = useState<boolean>(false);
  const [tangentX, setTangentX] = useState<number>(3);

  // Derived mathematical properties
  const vertexX = -b / (2 * a);
  const vertexY = a * vertexX * vertexX + b * vertexX + c;
  const discriminant = b * b - 4 * a * c;

  const handlePreset = (newA: number, newB: number, newC: number) => {
    setA(newA);
    setB(newB);
    setC(newC);
  };

  return (
    <div className="space-y-6">
      {/* Concept Hero Card */}
      <div className="bg-[#101B38] border border-[#23324C] rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E293B] pb-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#4CC9F0] uppercase tracking-wider mb-1">
              <span>IGCSE Syllabus Topic 2.11</span>
              <span>·</span>
              <span>Curved Functions</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Quadratic Graphs: <MathView math="y = ax^2 + bx + c" className="text-[#4CC9F0]" />
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Presets:</span>
            <button
              onClick={() => handlePreset(1, -3, -4)}
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-[#1C2541] hover:bg-[#2A3B5C] text-cyan-300 border border-[#2A3B5C] transition-colors"
            >
              Exam Q1: x² - 3x - 4
            </button>
            <button
              onClick={() => handlePreset(-1, 0, 4)}
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-[#1C2541] hover:bg-[#2A3B5C] text-slate-200 border border-[#2A3B5C] transition-colors"
            >
              Inverted: -x² + 4
            </button>
            <button
              onClick={() => handlePreset(1, -4, 4)}
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-[#1C2541] hover:bg-[#2A3B5C] text-slate-200 border border-[#2A3B5C] transition-colors"
            >
              Touch x-axis: (x-2)²
            </button>
          </div>
        </div>

        {/* Two-Zone Layout: Interactive Stage on Left, Controls & Concept Deck on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Visual Interactive Graph Stage */}
          <div className="lg:col-span-7 space-y-4">
            <InteractiveGraph
              type="quadratic"
              params={{ a, b, c }}
              xDomain={[-5, 6]}
              yDomain={[-9, 12]}
              showVertex={showVertex}
              showRoots={showRoots}
              showYIntercept={showYIntercept}
              showSymmetry={showSymmetry}
              showTangent={showTangent}
              tangentX={tangentX}
              onTangentXChange={setTangentX}
            />

            {/* Feature Toggles */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-[#0D152D] rounded-xl border border-[#23324C] text-xs">
              <span className="text-slate-400 font-medium flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#4CC9F0]" /> Key Overlays:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setShowVertex(!showVertex)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    showVertex ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-[#1C2541] text-slate-400'
                  }`}
                >
                  Turning Point
                </button>
                <button
                  onClick={() => setShowRoots(!showRoots)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    showRoots ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-[#1C2541] text-slate-400'
                  }`}
                >
                  Roots (x-intercepts)
                </button>
                <button
                  onClick={() => setShowSymmetry(!showSymmetry)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    showSymmetry ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-[#1C2541] text-slate-400'
                  }`}
                >
                  Line of Symmetry
                </button>
                <button
                  onClick={() => setShowTangent(!showTangent)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    showTangent ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-[#1C2541] text-slate-400'
                  }`}
                >
                  Tangent Ruler
                </button>
              </div>
            </div>
          </div>

          {/* Controls & Real-time Mathematical Analysis Deck */}
          <div className="lg:col-span-5 space-y-4">
            {/* Interactive Sliders Panel */}
            <div className="bg-[#0D152D] rounded-xl p-4 border border-[#23324C] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#4CC9F0]" /> Parameter Controls
                </span>
                <span className="font-mono text-sm text-[#4CC9F0] font-bold">
                  y = {a === 1 ? '' : a === -1 ? '-' : `${a}`}x² {b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`}x {c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`}
                </span>
              </div>

              {/* Slider for 'a' */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">Leading Coefficient (a)</span>
                  <span className="font-mono font-bold text-cyan-300">{a}</span>
                </div>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.5"
                  value={a}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setA(val === 0 ? (a < 0 ? 0.5 : -0.5) : val); // prevent a=0 for quadratic
                  }}
                  className="w-full accent-[#4CC9F0] cursor-pointer"
                />
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>{a > 0 ? '🟢 a > 0: U-shape (minimum turning point)' : '🔴 a < 0: n-shape (maximum turning point)'}</span>
                </div>
              </div>

              {/* Slider for 'b' */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">Linear Coefficient (b)</span>
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

              {/* Slider for 'c' */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">Constant Term (c = y-intercept)</span>
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
            </div>

            {/* Live Key Features Readout Card */}
            <div className="bg-[#0D152D] rounded-xl p-4 border border-[#23324C] space-y-3">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Live Key Properties (Cambridge 0580)
              </h3>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-[#141E38] border border-[#23324C]">
                  <span className="text-slate-400 block text-[11px]">Turning Point</span>
                  <span className="font-mono text-[#4CC9F0] font-bold">
                    ({vertexX.toFixed(2)}, {vertexY.toFixed(2)})
                  </span>
                  <span className="block text-[10px] text-slate-500 mt-0.5">
                    {a > 0 ? 'Minimum' : 'Maximum'} point
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#141E38] border border-[#23324C]">
                  <span className="text-slate-400 block text-[11px]">Line of Symmetry</span>
                  <span className="font-mono text-amber-300 font-bold">
                    x = {vertexX.toFixed(2)}
                  </span>
                  <span className="block text-[10px] text-slate-500 mt-0.5">
                    x = -b / (2a)
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#141E38] border border-[#23324C]">
                  <span className="text-slate-400 block text-[11px]">y-Intercept</span>
                  <span className="font-mono text-yellow-300 font-bold">
                    (0, {c})
                  </span>
                  <span className="block text-[10px] text-slate-500 mt-0.5">
                    When x = 0
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#141E38] border border-[#23324C]">
                  <span className="text-slate-400 block text-[11px]">Roots (y = 0)</span>
                  <span className="font-mono text-emerald-300 font-bold">
                    {discriminant > 0
                      ? `${((-b - Math.sqrt(discriminant)) / (2 * a)).toFixed(1)}, ${((-b + Math.sqrt(discriminant)) / (2 * a)).toFixed(1)}`
                      : discriminant === 0
                      ? `${(-b / (2 * a)).toFixed(1)} (1 root)`
                      : 'No real roots'}
                  </span>
                  <span className="block text-[10px] text-slate-500 mt-0.5">
                    Δ = {discriminant}
                  </span>
                </div>
              </div>
            </div>

            {/* Cambridge Exam Quick Advice */}
            <div className="bg-[#142142] border border-cyan-500/30 rounded-xl p-3.5 text-xs text-slate-300 space-y-1.5">
              <div className="flex items-center gap-1.5 text-cyan-300 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Examiner Tip: Drawing the Curve</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-300">
                In IGCSE Paper 2 and Paper 4, marks are awarded for plotting points accurately within 1 mm ($\pm 1$ small square) and drawing a <strong>single continuous smooth curve</strong>. Never use a ruler to connect points or make flat bottom turning points!
              </p>
              {onGoToPractice && (
                <button
                  onClick={onGoToPractice}
                  className="mt-1 text-[11px] text-[#4CC9F0] hover:text-white font-medium flex items-center gap-1 underline underline-offset-2"
                >
                  Test this in Question 1 Workspace &rarr;
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Concept Breakdown Grid: Parabola Anatomy */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Shape & Orientation */}
        <div className="bg-[#101B38] border border-[#23324C] rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white text-sm">1. Parabola Orientation</h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#1C2541] text-cyan-300">
              Sign of a
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            The sign of <MathView math="a" /> dictates the curve's direction:
          </p>
          <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
            <li>
              <strong className="text-emerald-400">If a &gt; 0:</strong> Parabola opens upwards (<strong>U-shape</strong>). The turning point is a <em>minimum</em>.
            </li>
            <li>
              <strong className="text-rose-400">If a &lt; 0:</strong> Parabola opens downwards (<strong>n-shape</strong>). The turning point is a <em>maximum</em>.
            </li>
          </ul>
        </div>

        {/* Card 2: Turning Point & Symmetry */}
        <div className="bg-[#101B38] border border-[#23324C] rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white text-sm">2. Turning Point & Symmetry</h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#1C2541] text-amber-300">
              x = -b / 2a
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Every quadratic parabola is symmetrical about a vertical line:
          </p>
          <div className="p-2 rounded bg-[#0D152D] text-xs font-mono text-slate-300 text-center">
            <MathView math="x = -\frac{b}{2a}" />
          </div>
          <p className="text-[11px] text-slate-400">
            Substitute this <MathView math="x" /> value back into <MathView math="y = ax^2 + bx + c" /> to find the <MathView math="y" />-coordinate of the turning point.
          </p>
        </div>

        {/* Card 3: Roots & Intercepts */}
        <div className="bg-[#101B38] border border-[#23324C] rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white text-sm">3. Roots & Solving Graphically</h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#1C2541] text-yellow-300">
              y = 0
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            The roots (solutions to <MathView math="ax^2 + bx + c = 0" />) are where the curve cuts the <MathView math="x" />-axis.
          </p>
          <div className="text-[11px] text-slate-300 space-y-1">
            <p>• If curve cuts x-axis twice: <strong>2 distinct roots</strong>.</p>
            <p>• If turning point touches x-axis: <strong>1 repeated root</strong>.</p>
            <p>• If curve stays above/below x-axis: <strong>no real roots</strong>.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
