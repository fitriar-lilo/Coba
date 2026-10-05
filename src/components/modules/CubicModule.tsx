import React, { useState } from 'react';
import { InteractiveGraph } from '../InteractiveGraph.tsx';
import { MathView } from '../MathView.tsx';
import { Sliders, HelpCircle, Eye, Sparkles, Compass } from 'lucide-react';

interface CubicModuleProps {
  onGoToPractice?: () => void;
}

export const CubicModule: React.FC<CubicModuleProps> = ({ onGoToPractice }) => {
  const [a, setA] = useState<number>(1);
  const [b, setB] = useState<number>(0);
  const [c, setC] = useState<number>(-3);
  const [d, setD] = useState<number>(1);

  const [solveK, setSolveK] = useState<number>(0);
  const [showExtrema, setShowExtrema] = useState<boolean>(true);
  const [showTangent, setShowTangent] = useState<boolean>(false);
  const [tangentX, setTangentX] = useState<number>(1);

  const handlePreset = (newA: number, newB: number, newC: number, newD: number) => {
    setA(newA);
    setB(newB);
    setC(newC);
    setD(newD);
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
              <span>Cubic Functions</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Cubic Graphs: <MathView math="y = ax^3 + bx^2 + cx + d" className="text-[#4CC9F0]" />
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Presets:</span>
            <button
              onClick={() => handlePreset(1, 0, -3, 1)}
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-[#1C2541] hover:bg-[#2A3B5C] text-cyan-300 border border-[#2A3B5C] transition-colors"
            >
              Exam Q2: x³ - 3x + 1
            </button>
            <button
              onClick={() => handlePreset(-1, 0, 3, 0)}
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-[#1C2541] hover:bg-[#2A3B5C] text-slate-200 border border-[#2A3B5C] transition-colors"
            >
              Inverted: -x³ + 3x
            </button>
            <button
              onClick={() => handlePreset(1, 0, 0, 0)}
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-[#1C2541] hover:bg-[#2A3B5C] text-slate-200 border border-[#2A3B5C] transition-colors"
            >
              Inflection: y = x³
            </button>
          </div>
        </div>

        {/* Two-Zone Layout: Interactive Stage on Left, Controls & Concept Deck on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Visual Interactive Graph Stage */}
          <div className="lg:col-span-7 space-y-4">
            <InteractiveGraph
              type="cubic"
              params={{ a, b, c, d }}
              xDomain={[-3.5, 3.5]}
              yDomain={[-7, 7]}
              showVertex={showExtrema}
              showRoots={true}
              showYIntercept={true}
              showSymmetry={false}
              showTangent={showTangent}
              tangentX={tangentX}
              onTangentXChange={setTangentX}
            />

            {/* Feature Toggles & Line y = k Solver */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#0D152D] rounded-xl border border-[#23324C] text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-[#4CC9F0]" /> Overlays:
                </span>
                <button
                  onClick={() => setShowExtrema(!showExtrema)}
                  className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                    showExtrema ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-[#1C2541] text-slate-400'
                  }`}
                >
                  Turning Points
                </button>
                <button
                  onClick={() => setShowTangent(!showTangent)}
                  className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                    showTangent ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-[#1C2541] text-slate-400'
                  }`}
                >
                  Tangent Line
                </button>
              </div>

              {/* Graphical Equation Solving Tool */}
              <div className="flex items-center gap-2 text-slate-300">
                <span className="text-slate-400">Solve f(x) = k:</span>
                <input
                  type="number"
                  min="-6"
                  max="6"
                  value={solveK}
                  onChange={(e) => setSolveK(parseFloat(e.target.value) || 0)}
                  className="w-14 px-2 py-0.5 bg-[#1C2541] border border-[#2A3B5C] rounded font-mono text-center text-cyan-300 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* Controls & Real-time Mathematical Analysis Deck */}
          <div className="lg:col-span-5 space-y-4">
            {/* Interactive Sliders Panel */}
            <div className="bg-[#0D152D] rounded-xl p-4 border border-[#23324C] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#4CC9F0]" /> Cubic Parameters
                </span>
                <span className="font-mono text-xs text-[#4CC9F0] font-bold">
                  y = {a === 1 ? '' : a === -1 ? '-' : `${a}`}x³ {b !== 0 ? `${b > 0 ? `+ ${b}` : `- ${Math.abs(b)}`}x²` : ''} {c !== 0 ? `${c > 0 ? `+ ${c}` : `- ${Math.abs(c)}`}x` : ''} {d !== 0 ? `${d > 0 ? `+ ${d}` : `- ${Math.abs(d)}`}` : ''}
                </span>
              </div>

              {/* Slider for 'a' */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">Cubic Term (a)</span>
                  <span className="font-mono font-bold text-cyan-300">{a}</span>
                </div>
                <input
                  type="range"
                  min="-2"
                  max="2"
                  step="0.5"
                  value={a}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setA(val === 0 ? (a < 0 ? 0.5 : -0.5) : val);
                  }}
                  className="w-full accent-[#4CC9F0] cursor-pointer"
                />
              </div>

              {/* Slider for 'c' (linear) */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">Linear Term (c)</span>
                  <span className="font-mono font-bold text-cyan-300">{c}</span>
                </div>
                <input
                  type="range"
                  min="-6"
                  max="6"
                  step="1"
                  value={c}
                  onChange={(e) => setC(parseFloat(e.target.value))}
                  className="w-full accent-[#4CC9F0] cursor-pointer"
                />
                <span className="text-[10px] text-slate-500">
                  Controls whether graph has 2 turning points (c &lt; 0) or monotonic bend (c &ge; 0).
                </span>
              </div>

              {/* Slider for 'd' (vertical shift / y-intercept) */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">Vertical Shift (d = y-intercept)</span>
                  <span className="font-mono font-bold text-amber-300">{d}</span>
                </div>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="1"
                  value={d}
                  onChange={(e) => setD(parseFloat(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
            </div>

            {/* End Behavior Analysis Card */}
            <div className="bg-[#0D152D] rounded-xl p-4 border border-[#23324C] space-y-3">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-cyan-400" /> End Behavior & S-Curve Flow
              </h3>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-[#141E38] border border-[#23324C]">
                  <span className="text-slate-400 block text-[11px]">As x &rarr; -&infin;</span>
                  <span className="font-mono text-cyan-300 font-bold">
                    {a > 0 ? 'y → -∞' : 'y → +∞'}
                  </span>
                  <span className="block text-[10px] text-slate-500 mt-0.5">
                    {a > 0 ? 'Starts in Quadrant 3' : 'Starts in Quadrant 2'}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#141E38] border border-[#23324C]">
                  <span className="text-slate-400 block text-[11px]">As x &rarr; +&infin;</span>
                  <span className="font-mono text-cyan-300 font-bold">
                    {a > 0 ? 'y → +∞' : 'y → -∞'}
                  </span>
                  <span className="block text-[10px] text-slate-500 mt-0.5">
                    {a > 0 ? 'Exits in Quadrant 1' : 'Exits in Quadrant 4'}
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#141E38] border border-[#23324C] text-xs">
                <span className="text-slate-400 block text-[11px]">Number of Solutions to f(x) = {solveK}</span>
                <p className="text-[11px] text-slate-300 mt-1">
                  A cubic equation can have <strong>1, 2, or 3 real solutions</strong> depending on the horizontal line <MathView math={`y = ${solveK}`} />.
                  For <MathView math="y = x^3 - 3x + 1" /> when <MathView math="k = 0" />, the curve crosses the x-axis exactly <strong>3 times</strong> (at approx x = -1.88, 0.35, 1.53).
                </p>
              </div>
            </div>

            {/* Cambridge Exam Quick Advice */}
            <div className="bg-[#142142] border border-cyan-500/30 rounded-xl p-3.5 text-xs text-slate-300 space-y-1.5">
              <div className="flex items-center gap-1.5 text-cyan-300 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Cambridge 0580 Exam Focus: Question 2</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-300">
                In Question 2, you are asked to complete the table for <MathView math="y = x^3 - 3x + 1" /> and state the number of solutions to <MathView math="x^3 - 3x + 1 = 0" />.
                Always look at where the curve cuts the horizontal line <MathView math="y = 0" />!
              </p>
              {onGoToPractice && (
                <button
                  onClick={onGoToPractice}
                  className="mt-1 text-[11px] text-[#4CC9F0] hover:text-white font-medium flex items-center gap-1 underline underline-offset-2"
                >
                  Solve Question 2 in the Workspace &rarr;
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Anatomy of Cubic Functions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#101B38] border border-[#23324C] rounded-xl p-4 space-y-2">
          <h3 className="font-semibold text-white text-sm">1. S-Curve Geometry</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Unlike parabolas which have only one bend, cubic graphs possess an <strong>"S-bend"</strong>.
            When <MathView math="a > 0" />, the curve travels uphill overall from bottom-left to top-right.
            When <MathView math="a < 0" />, it flips upside-down.
          </p>
        </div>

        <div className="bg-[#101B38] border border-[#23324C] rounded-xl p-4 space-y-2">
          <h3 className="font-semibold text-white text-sm">2. Local Max & Min Turning Points</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            In general cubic curves like <MathView math="y = x^3 - 3x + 1" />, there is a <strong>local maximum</strong> (at <MathView math="(-1, 3)" />) and a <strong>local minimum</strong> (at <MathView math="(1, -1)" />).
            At these peaks and troughs, the gradient of the curve is exactly zero (<MathView math="m = 0" />).
          </p>
        </div>

        <div className="bg-[#101B38] border border-[#23324C] rounded-xl p-4 space-y-2">
          <h3 className="font-semibold text-white text-sm">3. Point of Inflection</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            A point of inflection is where the curvature changes from concave down (n-like) to concave up (U-like). For <MathView math="y = x^3" />, the origin <MathView math="(0,0)" /> is a <strong>stationary point of inflection</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};
