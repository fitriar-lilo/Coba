import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { QuestionData } from '../../types/math.ts';
import { Award, CheckCircle, Printer, RotateCcw, X, Sparkles } from 'lucide-react';

interface SubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: QuestionData[];
  studentName: string;
  onDownloadPdf: () => void;
  onResetAll: () => void;
}

export const SubmitModal: React.FC<SubmitModalProps> = ({
  isOpen,
  onClose,
  questions,
  studentName,
  onDownloadPdf,
  onResetAll,
}) => {
  if (!isOpen) return null;

  // Calculate detailed scores
  let totalScore = 0;
  let totalMax = 0;

  const results = questions.map((q) => {
    let qScore = 0;

    // Table marks
    if (q.table.length > 0) {
      const correctCount = q.table.filter((r) => r.userY.trim() === String(r.correctY)).length;
      if (correctCount === q.table.length) qScore += 2;
      else if (correctCount >= q.table.length - 2) qScore += 1;
    }

    // Sub questions
    q.subQuestions.forEach((sub) => {
      const cleanUser = sub.userAnswer.trim().toLowerCase().replace(/\s+/g, '');
      const isMatch = (sub.acceptedAnswers || [sub.expectedAnswer]).some((ans) => {
        const cleanAns = ans.trim().toLowerCase().replace(/\s+/g, '');
        return cleanUser === cleanAns || cleanUser.includes(cleanAns);
      });
      if (isMatch) qScore += sub.marks;
    });

    // Working out
    if (q.workingOut.trim().length > 15) {
      qScore += 1;
    }

    const cappedScore = Math.min(q.totalMarks, qScore);
    totalScore += cappedScore;
    totalMax += q.totalMarks;

    return {
      title: q.title,
      curveType: q.curveType,
      score: cappedScore,
      max: q.totalMarks,
      percentage: Math.round((cappedScore / q.totalMarks) * 100),
    };
  });

  const overallPercentage = Math.round((totalScore / totalMax) * 100);

  // Cambridge Grade Boundary estimation
  let grade = 'U';
  let gradeColor = 'text-rose-400';
  if (overallPercentage >= 88) {
    grade = 'A* (Distinction)';
    gradeColor = 'text-emerald-400';
  } else if (overallPercentage >= 75) {
    grade = 'A (Excellent)';
    gradeColor = 'text-cyan-400';
  } else if (overallPercentage >= 65) {
    grade = 'B (Good Merit)';
    gradeColor = 'text-blue-400';
  } else if (overallPercentage >= 50) {
    grade = 'C (Pass Standard)';
    gradeColor = 'text-amber-400';
  }

  // Trigger confetti on good performance
  useEffect(() => {
    if (overallPercentage >= 60) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // no-op if blocked
      }
    }
  }, [overallPercentage]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#101B38] border border-[#23324C] rounded-2xl w-full max-w-xl p-6 shadow-2xl relative space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg bg-[#1C2541] hover:bg-[#2A3B5C] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-[#4CC9F0] mb-2">
            <Award className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Examination Assessment Summary
          </h2>
          <p className="text-xs text-slate-300">
            Candidate: <strong className="text-cyan-300">{studentName || 'Independent Scholar'}</strong> · Cambridge IGCSE 0580
          </p>
        </div>

        {/* Score & Grade Display */}
        <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#0D152D] border border-[#23324C]">
          <div className="text-center border-r border-[#1E293B]">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Total Marks</span>
            <div className="font-mono text-3xl font-extrabold text-white mt-0.5">
              {totalScore} <span className="text-base text-slate-400 font-normal">/ {totalMax}</span>
            </div>
            <span className="text-xs text-cyan-400 font-semibold">{overallPercentage}% Completed</span>
          </div>

          <div className="text-center">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Estimated IGCSE Grade</span>
            <div className={`font-mono text-2xl font-extrabold mt-1 ${gradeColor}`}>
              {grade}
            </div>
            <span className="text-[11px] text-slate-400">0580 Standard Grading</span>
          </div>
        </div>

        {/* Breakdown by Subtopic */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Subtopic Breakdown
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {results.map((r, idx) => (
              <div
                key={`res-${idx}`}
                className="flex items-center justify-between p-2.5 rounded-lg bg-[#141E38] border border-[#23324C] text-xs"
              >
                <div>
                  <span className="font-semibold text-white block">{r.curveType} Curve</span>
                  <span className="text-[10px] text-slate-400">{r.title}</span>
                </div>
                <div className="text-right font-mono">
                  <span className="font-bold text-cyan-300">{r.score}/{r.max} Marks</span>
                  <div className="w-20 h-1.5 bg-[#0D152D] rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full bg-[#4CC9F0] rounded-full"
                      style={{ width: `${r.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-[#1E293B]">
          <button
            onClick={onResetAll}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-medium text-slate-300 bg-[#1C2541] hover:bg-[#2A3B5C] border border-[#2A3B5C] flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset for Re-attempt</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-[#1C2541] hover:bg-[#243356] transition-colors"
            >
              Review Answers
            </button>
            <button
              onClick={() => {
                onClose();
                onDownloadPdf();
              }}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold text-[#0A1128] bg-gradient-to-r from-[#4CC9F0] to-[#4895EF] shadow-lg shadow-cyan-500/20 hover:opacity-95 flex items-center justify-center gap-1.5 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Download PDF / Print</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
