import React, { useState } from 'react';
import { QuestionData } from '../../types/math.ts';
import { MathView } from '../MathView.tsx';
import { InteractiveGraph } from '../InteractiveGraph.tsx';
import {
  HelpCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Award,
  Edit3,
  Lightbulb,
  Check,
  X,
  Sparkles,
} from 'lucide-react';

interface PracticeWorkspaceProps {
  questions: QuestionData[];
  onUpdateTableAnswer: (qId: string, x: number, val: string) => void;
  onUpdateSubAnswer: (qId: string, subId: string, val: string) => void;
  onUpdateWorkingOut: (qId: string, text: string) => void;
  activeQIndex: number;
  setActiveQIndex: (idx: number) => void;
  onSubmitAll: () => void;
}

export const PracticeWorkspace: React.FC<PracticeWorkspaceProps> = ({
  questions,
  onUpdateTableAnswer,
  onUpdateSubAnswer,
  onUpdateWorkingOut,
  activeQIndex,
  setActiveQIndex,
  onSubmitAll,
}) => {
  const [hintIndex, setHintIndex] = useState<{ [qId: string]: number }>({});
  const [revealedSolutions, setRevealedSolutions] = useState<{ [qId: string]: boolean }>({});
  const [checkedQuestions, setCheckedQuestions] = useState<{ [qId: string]: boolean }>({});

  const currentQ = questions[activeQIndex];

  // Helper to toggle hint progression
  const toggleNextHint = (qId: string, maxHints: number) => {
    setHintIndex((prev) => {
      const current = prev[qId] ?? 0;
      return { ...prev, [qId]: current >= maxHints ? 0 : current + 1 };
    });
  };

  const toggleSolution = (qId: string) => {
    setRevealedSolutions((prev) => ({ ...prev, [qId]: !prev[qId] }));
    setCheckedQuestions((prev) => ({ ...prev, [qId]: true }));
  };

  // Extract student points for live graph visualization
  const studentPlottedPoints = currentQ.table
    .filter((row) => row.userY.trim() !== '' && !isNaN(Number(row.userY)))
    .map((row) => ({
      x: row.x,
      y: Number(row.userY),
      isCorrect: checkedQuestions[currentQ.id] ? Number(row.userY) === row.correctY : true,
    }));

  // Calculate question marks if checked
  const calculateQuestionScore = (q: QuestionData) => {
    let score = 0;

    // Table marks
    if (q.table.length > 0) {
      const correctTableCount = q.table.filter((r) => r.userY.trim() === String(r.correctY)).length;
      if (correctTableCount === q.table.length) score += 2;
      else if (correctTableCount >= q.table.length - 2) score += 1;
    }

    // Sub-question marks
    q.subQuestions.forEach((sub) => {
      const cleanUser = sub.userAnswer.trim().toLowerCase().replace(/\s+/g, '');
      const isMatch = (sub.acceptedAnswers || [sub.expectedAnswer]).some((ans) => {
        const cleanAns = ans.trim().toLowerCase().replace(/\s+/g, '');
        return cleanUser === cleanAns || cleanUser.includes(cleanAns);
      });
      if (isMatch) score += sub.marks;
    });

    // Working out bonus mark
    if (q.workingOut.trim().length > 15) {
      score += 1;
    }

    return Math.min(q.totalMarks, score);
  };

  return (
    <div className="space-y-6">
      {/* Top Question Navigation Bar */}
      <div className="bg-[#101B38] border border-[#23324C] rounded-2xl p-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {questions.map((q, idx) => {
              const isCurrent = idx === activeQIndex;
              const hasAnsweredSomething =
                q.table.some((r) => r.userY.trim() !== '') ||
                q.subQuestions.some((s) => s.userAnswer.trim() !== '');
              const isChecked = checkedQuestions[q.id];

              return (
                <button
                  key={q.id}
                  onClick={() => setActiveQIndex(idx)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                    isCurrent
                      ? 'bg-[#4CC9F0] text-[#0A1128] font-bold shadow-md shadow-cyan-500/20'
                      : 'bg-[#1C2541] text-slate-300 hover:bg-[#243356]'
                  }`}
                >
                  <span>Q{idx + 1}: {q.curveType}</span>
                  {isChecked && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#0A1128]/30 font-mono">
                      {calculateQuestionScore(q)}/{q.totalMarks}m
                    </span>
                  )}
                  {!isChecked && hasAnsweredSomething && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">Total Available: <strong>25 Marks</strong></span>
            <button
              onClick={onSubmitAll}
              className="px-4 py-2 bg-gradient-to-r from-[#4CC9F0] to-[#4895EF] text-[#0A1128] font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-opacity"
            >
              Submit All Work & Check Marks
            </button>
          </div>
        </div>
      </div>

      {/* Active Question Main Card */}
      <div className="bg-[#101B38] border border-[#23324C] rounded-2xl p-6 shadow-xl space-y-6">
        {/* Header of Active Question */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-[#1E293B] pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#4CC9F0] uppercase tracking-wider mb-1">
              <span>Cambridge IGCSE 0580</span>
              <span>·</span>
              <span className="font-mono text-slate-400">{currentQ.syllabusCode}</span>
              <span>·</span>
              <span className="text-amber-400 font-bold">[{currentQ.totalMarks} Marks]</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {currentQ.title}
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {currentQ.description}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Need a Hint Button */}
            <button
              onClick={() => toggleNextHint(currentQ.id, currentQ.hints.length)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1C2541] hover:bg-[#26375E] text-amber-300 border border-amber-500/30 rounded-lg text-xs font-medium transition-colors"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>
                {(hintIndex[currentQ.id] ?? 0) === 0
                  ? 'Need a Hint?'
                  : `Hint ${(hintIndex[currentQ.id] ?? 0)}/${currentQ.hints.length}`}
              </span>
            </button>

            {/* Check / Solution Button */}
            <button
              onClick={() => toggleSolution(currentQ.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1C2541] hover:bg-[#26375E] text-[#4CC9F0] border border-cyan-500/30 rounded-lg text-xs font-medium transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{revealedSolutions[currentQ.id] ? 'Hide Solution' : 'Check / Show Solution'}</span>
            </button>
          </div>
        </div>

        {/* Expandable Hint Banner */}
        {(hintIndex[currentQ.id] ?? 0) > 0 && (
          <div className="bg-amber-950/30 border border-amber-500/40 rounded-xl p-4 text-xs text-amber-200 space-y-2">
            <div className="flex items-center justify-between font-semibold">
              <span className="flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                Step-by-Step Progressive Hint
              </span>
              <span className="text-[11px] text-amber-400/80">
                Click "Need a Hint" again for next clue
              </span>
            </div>
            <p className="leading-relaxed">
              {currentQ.hints[(hintIndex[currentQ.id] ?? 1) - 1]}
            </p>
          </div>
        )}

        {/* Two-Column Grid: Left is Digital Inputs & Table, Right is Interactive Live Graph Plotter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Digital Work Area */}
          <div className="lg:col-span-7 space-y-6">
            {/* Formula Banner */}
            <div className="bg-[#0D152D] rounded-xl p-3.5 border border-[#23324C] flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Function Equation:</span>
              <MathView math={currentQ.formulaLatex} className="text-[#4CC9F0] text-base font-bold" />
            </div>

            {/* Part A: Table of Values (if applicable) */}
            {currentQ.table.length > 0 && (
              <div className="bg-[#0D152D] rounded-xl p-4 border border-[#23324C] space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Part (a): Complete Table of Values [2 Marks]
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Values plot automatically on the preview graph
                  </span>
                </div>

                <div className="overflow-x-auto pb-1">
                  <table className="w-full text-xs font-mono tabular-nums text-center border-collapse">
                    <thead>
                      <tr className="bg-[#141E38] text-slate-300 border-b border-[#23324C]">
                        <th className="py-2 px-3 text-left">x</th>
                        {currentQ.table.map((row) => (
                          <th key={`th-${row.x}`} className="py-2 px-2.5 min-w-[42px]">
                            {row.x}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="divide-x divide-[#1E293B]">
                        <td className="py-2 px-3 text-left text-slate-400 font-bold bg-[#141E38]/50">
                          y
                        </td>
                        {currentQ.table.map((row) => {
                          const isChecked = checkedQuestions[currentQ.id];
                          const isCorrect = isChecked && row.userY.trim() === String(row.correctY);
                          const isWrong = isChecked && row.userY.trim() !== '' && row.userY.trim() !== String(row.correctY);

                          return (
                            <td key={`td-${row.x}`} className="py-1 px-1">
                              <input
                                type="text"
                                value={row.userY}
                                placeholder="?"
                                onChange={(e) => onUpdateTableAnswer(currentQ.id, row.x, e.target.value)}
                                className={`w-full py-1 text-center font-mono text-xs rounded transition-colors ${
                                  isCorrect
                                    ? 'bg-emerald-950/60 border border-emerald-500 text-emerald-300 font-bold'
                                    : isWrong
                                    ? 'bg-rose-950/60 border border-rose-500 text-rose-300 font-bold'
                                    : 'bg-[#1C2541] border border-[#2A3B5C] text-cyan-300 focus:outline-none focus:border-cyan-400'
                                }`}
                              />
                            </td>
                          );
                        })}
                      </tr>
                    </tbody>
                  </table>
                </div>

                {checkedQuestions[currentQ.id] && (
                  <div className="text-[11px] text-slate-400 pt-1 flex items-center justify-between">
                    <span>
                      Correct values:{' '}
                      <span className="font-mono text-emerald-400">
                        {currentQ.table.map((r) => `${r.x}→${r.correctY}`).join(', ')}
                      </span>
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Part B & Sub-Questions */}
            <div className="bg-[#0D152D] rounded-xl p-4 border border-[#23324C] space-y-4">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Part (b) & Analytical Questions
              </h3>

              <div className="space-y-3">
                {currentQ.subQuestions.map((sub, sIdx) => {
                  const isChecked = checkedQuestions[currentQ.id];
                  const cleanUser = sub.userAnswer.trim().toLowerCase().replace(/\s+/g, '');
                  const isCorrect =
                    isChecked &&
                    (sub.acceptedAnswers || [sub.expectedAnswer]).some((ans) => {
                      const cleanAns = ans.trim().toLowerCase().replace(/\s+/g, '');
                      return cleanUser === cleanAns || cleanUser.includes(cleanAns);
                    });

                  return (
                    <div key={sub.id} className="space-y-1.5 p-3 rounded-lg bg-[#141E38] border border-[#23324C]">
                      <div className="flex items-center justify-between text-xs">
                        <label className="text-slate-300 font-medium">{sub.prompt}</label>
                        <span className="text-amber-400 font-mono text-[11px]">[{sub.marks}m]</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={sub.userAnswer}
                          placeholder="Type your final answer..."
                          onChange={(e) => onUpdateSubAnswer(currentQ.id, sub.id, e.target.value)}
                          className={`flex-1 px-3 py-1.5 text-xs font-mono rounded-lg transition-colors ${
                            isChecked
                              ? isCorrect
                                ? 'bg-emerald-950/60 border border-emerald-500 text-emerald-300'
                                : 'bg-rose-950/60 border border-rose-500 text-rose-300'
                              : 'bg-[#1C2541] border border-[#2A3B5C] text-white focus:outline-none focus:border-cyan-400'
                          }`}
                        />
                        {isChecked && (
                          <div className="shrink-0">
                            {isCorrect ? (
                              <Check className="w-5 h-5 text-emerald-400" />
                            ) : (
                              <X className="w-5 h-5 text-rose-400" />
                            )}
                          </div>
                        )}
                      </div>
                      {revealedSolutions[currentQ.id] && (
                        <p className="text-[11px] text-cyan-300 bg-[#0A1128]/60 p-2 rounded border border-cyan-500/20 mt-1 leading-relaxed">
                          <strong>Expected:</strong> {sub.expectedAnswer} — {sub.explanation}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Part C: Working Out Text Box */}
            <div className="bg-[#0D152D] rounded-xl p-4 border border-[#23324C] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-[#4CC9F0]" /> Digital Working Out Area [M1 Method Mark]
                </span>
                <span className="text-slate-500 text-[11px]">
                  Write your substitutions, factoring, or formula steps
                </span>
              </div>
              <textarea
                rows={3}
                value={currentQ.workingOut}
                placeholder="Show your step-by-step working out here (e.g. for turning point: x = -(-3)/(2*1) = 1.5, y = (1.5)^2 - 3(1.5) - 4 = -6.25)..."
                onChange={(e) => onUpdateWorkingOut(currentQ.id, e.target.value)}
                className="w-full p-2.5 text-xs font-mono bg-[#1C2541] border border-[#2A3B5C] rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Right Column: Live Interactive SVG Graph Verification */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#0D152D] rounded-xl p-3 border border-[#23324C]">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#4CC9F0]" /> Live Verification Plot
                </span>
                <span className="text-[10px] text-slate-400">
                  {studentPlottedPoints.length} points plotted
                </span>
              </div>

              {currentQ.id === 'q1' && (
                <InteractiveGraph
                  type="quadratic"
                  params={{ a: 1, b: -3, c: -4 }}
                  xDomain={[-3, 6]}
                  yDomain={[-8, 8]}
                  studentPoints={studentPlottedPoints}
                  showVertex={revealedSolutions[currentQ.id]}
                  showRoots={revealedSolutions[currentQ.id]}
                />
              )}

              {currentQ.id === 'q2' && (
                <InteractiveGraph
                  type="cubic"
                  params={{ a: 1, b: 0, c: -3, d: 1 }}
                  xDomain={[-3, 3]}
                  yDomain={[-5, 5]}
                  studentPoints={studentPlottedPoints}
                  showVertex={revealedSolutions[currentQ.id]}
                />
              )}

              {currentQ.id === 'q3' && (
                <InteractiveGraph
                  type="hyperbola"
                  params={{ a: 6 }}
                  xDomain={[-7, 7]}
                  yDomain={[-7, 7]}
                  studentPoints={studentPlottedPoints}
                  showAsymptotes={true}
                />
              )}

              {currentQ.id === 'q4' && (
                <InteractiveGraph
                  type="quadratic"
                  params={{ a: 1, b: -3, c: -4 }}
                  xDomain={[-1, 6]}
                  yDomain={[-8, 6]}
                  showTangent={true}
                  tangentX={3}
                />
              )}

              <p className="text-[11px] text-slate-400 text-center mt-2">
                {studentPlottedPoints.length > 0
                  ? 'Your table values appear as numbered points. Check if they sit smoothly on the curve!'
                  : 'Type values into the table of values on the left to see your points appear on the grid.'}
              </p>
            </div>

            {/* Revealed Mark Scheme Criteria Card */}
            {revealedSolutions[currentQ.id] && (
              <div className="bg-[#142142] border border-cyan-500/40 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-cyan-400" /> Cambridge Official Mark Scheme
                  </span>
                  <span className="font-mono text-xs text-amber-300 font-bold">
                    Score: {calculateQuestionScore(currentQ)} / {currentQ.totalMarks} Marks
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  {currentQ.markScheme.map((crit, cIdx) => (
                    <div key={`crit-${cIdx}`} className="flex items-start gap-2 p-1.5 rounded bg-[#0A1128]/50">
                      <span className="font-mono font-bold text-amber-400 shrink-0">[{crit.code}]</span>
                      <span className="text-slate-300 leading-snug">{crit.rule}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
