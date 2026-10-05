import React, { useState } from 'react';
import { InteractiveGraph } from '../InteractiveGraph.tsx';
import { MathView } from '../MathView.tsx';
import { Sliders, HelpCircle, Eye, Sparkles, AlertTriangle } from 'lucide-react';

interface HyperbolaModuleProps {
  onGoToPractice?: () => void;
}

export const HyperbolaModule: React.FC<HyperbolaModuleProps> = ({ onGoToPractice }) => {
  const [a, setA] = useState<number>(6);
  const [graphKind, setGraphKind] = useState<'hyperbola' | 'reciprocal_sq'>('hyperbola');
  const [showAsymptotes, setShowAsymptotes] = useState<boolean>(true);
  const [showTangent, setShowTangent] = useState<boolean>(false);
  const [tangentX, setTangentX] = useState<number>(2);

  const handlePreset = (newA: number, kind: 'hyperbola' | 'reciprocal_sq') => {
    setA(newA);
    setGraphKind(kind);
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
              <span>Reciprocal Functions</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Reciprocal Graphs: <MathView math={graphKind === 'hyperbola' ? 'y = \\frac{a}{x}' : 'y = \\frac{a}{x^2}'} className="text-[#4CC9F0]" />
            </h2>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400">Presets:</span>
            <button
              onClick={() => handlePreset(6, 'hyperbola')}
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-[#1C2541] hover:bg-[#2A3B5C] text-cyan-300 border border-[#2A3B5C] transition-colors"
            >
              Exam Q3: y = 6/x
            </button>
            <button
              onClick={() => handlePreset(-6, 'hyperbola')}
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-[#1C2541] hover:bg-[#2A3B5C] text-slate-200 border border-[#2A3B5C] transition-colors"
            >
              Inverted: y = -6/x
            </button>
            <button
              onClick={() => handlePreset(4, 'reciprocal_sq')}
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-[#1C2541] hover:bg-[#2A3B5C] text-slate-200 border border-[#2A3B5C] transition-colors"
            >
              Volcano: y = 4/x²
            </button>
          </div>
        </div>

        {/* Two-Zone Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Visual Interactive Graph Stage */}
          <div className="lg:col-span-7 space-y-4">
            <InteractiveGraph
              type={graphKind}
              params={{ a }}
              xDomain={[-7, 7]}
              yDomain={[-8, 8]}
              showAsymptotes={showAsymptotes}
              showTangent={showTangent}
              tangentX={tangentX}
              onTangentXChange={setTangentX}
            />

            {/* Feature Toggles & Quadrant Identifiers */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#0D152D] rounded-xl border border-[#23324C] text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-[#4CC9F0]" /> Overlays:
                </span>
                <button
                  onClick={() => setShowAsymptotes(!showAsymptotes)}
                  className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                    showAsymptotes ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-[#1C2541] text-slate-400'
                  }`}
                >
                  Asymptotes (x=0, y=0)
                </button>
                <button
                  onClick={() => setShowTangent(!showTangent)}
                  className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                    showTangent ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-[#1C2541] text-slate-400'
                  }`}
                >
                  Tangent Ruler
                </button>
              </div>

              {/* Curve Family Switcher */}
              <div className="flex items-center gap-1 bg-[#1C2541] p-1 rounded-lg border border-[#2A3B5C]">
                <button
                  onClick={() => setGraphKind('hyperbola')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    graphKind === 'hyperbola' ? 'bg-[#4CC9F0] text-[#0A1128] font-bold shadow-sm' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  y = a/x
                </button>
                <button
                  onClick={() => setGraphKind('reciprocal_sq')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    graphKind === 'reciprocal_sq' ? 'bg-[#4CC9F0] text-[#0A1128] font-bold shadow-sm' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  y = a/x²
                </button>
              </div>
            </div>
          </div>

          {/* Controls & Concept Deck */}
          <div className="lg:col-span-5 space-y-4">
            {/* Slider Panel */}
            <div className="bg-[#0D152D] rounded-xl p-4 border border-[#23324C] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#4CC9F0]" /> Numerator Parameter (a)
                </span>
                <span className="font-mono text-sm text-[#4CC9F0] font-bold">
                  {graphKind === 'hyperbola' ? `y = ${a}/x` : `y = ${a}/x²`}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">Constant 'a'</span>
                  <span className="font-mono font-bold text-cyan-300">{a}</span>
                </div>
                <input
                  type="range"
                  min="-12"
                  max="12"
                  step="1"
                  value={a}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setA(val === 0 ? (a < 0 ? 1 : -1) : val);
                  }}
                  className="w-full accent-[#4CC9F0] cursor-pointer"
                />
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>
                    {a > 0 ? '🟢 a > 0: Quadrants 1 & 3' : '🔴 a < 0: Quadrants 2 & 4'}
                  </span>
                  <span className="text-slate-500">|a| expands curve</span>
                </div>
              </div>
            </div>

            {/* Crucial Concept: Why x ≠ 0? */}
            <div className="bg-[#0D152D] rounded-xl p-4 border border-rose-500/30 space-y-2">
              <div className="flex items-center gap-1.5 text-rose-400 font-semibold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Why x ≠ 0? (Core Exam Question 3c)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Dividing by zero is mathematically <strong>undefined</strong>.
                As <MathView math="x" /> gets closer to 0 from the positive side (<MathView math="x \to 0^+" />), <MathView math="y \to +\infty" />.
                From the negative side (<MathView math="x \to 0^-" />), <MathView math="y \to -\infty" />.
                The curve never touches the <MathView math="y" />-axis!
              </p>
            </div>

            {/* Asymptotes Card */}
            <div className="bg-[#0D152D] rounded-xl p-4 border border-[#23324C] space-y-3">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Asymptote Equations
              </h3>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-[#141E38] border border-[#23324C]">
                  <span className="text-slate-400 block text-[11px]">Vertical Asymptote</span>
                  <span className="font-mono text-rose-400 font-bold text-sm">
                    x = 0
                  </span>
                  <span className="block text-[10px] text-slate-500 mt-0.5">
                    The y-axis line
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#141E38] border border-[#23324C]">
                  <span className="text-slate-400 block text-[11px]">Horizontal Asymptote</span>
                  <span className="font-mono text-rose-400 font-bold text-sm">
                    y = 0
                  </span>
                  <span className="block text-[10px] text-slate-500 mt-0.5">
                    The x-axis line
                  </span>
                </div>
              </div>
            </div>

            {/* Cambridge Exam Quick Advice */}
            <div className="bg-[#142142] border border-cyan-500/30 rounded-xl p-3.5 text-xs text-slate-300 space-y-1.5">
              <div className="flex items-center gap-1.5 text-cyan-300 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Cambridge 0580 Exam Focus: Question 3</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-300">
                In Question 3, you are asked to complete the table for <MathView math="y = \frac{6}{x}" /> for <MathView math="x \in \{-6, -3, -2, -1, 1, 2, 3, 6\}" /> and state the equations of the asymptotes. Remember: <MathView math="x = 0" /> must be left blank because division by zero is undefined!
              </p>
              {onGoToPractice && (
                <button
                  onClick={onGoToPractice}
                  className="mt-1 text-[11px] text-[#4CC9F0] hover:text-white font-medium flex items-center gap-1 underline underline-offset-2"
                >
                  Complete Question 3 Practice &rarr;
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Anatomy of Reciprocal Functions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#101B38] border border-[#23324C] rounded-xl p-4 space-y-2">
          <h3 className="font-semibold text-white text-sm">1. Two Disjoint Branches</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            The graph of <MathView math="y = \frac{a}{x}" /> consists of two separate, non-connecting branches.
            Because <MathView math="x = 0" /> is not in the domain, the curve never crosses between left and right branches.
          </p>
        </div>

        <div className="bg-[#101B38] border border-[#23324C] rounded-xl p-4 space-y-2">
          <h3 className="font-semibold text-white text-sm">2. Quadrant Placement Rules</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            • When <strong className="text-emerald-400">a &gt; 0</strong>: Positive <MathView math="x" /> gives positive <MathView math="y" /> (Quad 1); negative <MathView math="x" /> gives negative <MathView math="y" /> (Quad 3).
            <br />
            • When <strong className="text-rose-400">a &lt; 0</strong>: Branches flip into Quadrants 2 and 4.
          </p>
        </div>

        <div className="bg-[#101B38] border border-[#23324C] rounded-xl p-4 space-y-2">
          <h3 className="font-semibold text-white text-sm">3. Reciprocal Squared (y = a/x²)</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Because <MathView math="x^2 \ge 0" /> for all <MathView math="x \neq 0" />, the denominator is always positive!
            When <MathView math="a > 0" />, both branches are strictly positive in Quadrants 1 and 2, creating a symmetric "volcano" shape.
          </p>
        </div>
      </div>
    </div>
  );
};
