import React, { useState, useEffect } from 'react';
import { TabType, QuestionData } from './types/math.ts';
import { INITIAL_QUESTIONS } from './data/questionsData.ts';
import { Header } from './components/Header.tsx';
import { QuadraticModule } from './components/modules/QuadraticModule.tsx';
import { CubicModule } from './components/modules/CubicModule.tsx';
import { HyperbolaModule } from './components/modules/HyperbolaModule.tsx';
import { SandboxModule } from './components/modules/SandboxModule.tsx';
import { PracticeWorkspace } from './components/practice/PracticeWorkspace.tsx';
import { SubmitModal } from './components/modals/SubmitModal.tsx';
import { PrintSheet } from './components/PrintSheet.tsx';
import { BookOpen, Sparkles, CheckCircle2, Award } from 'lucide-react';

const STORAGE_KEY_QUESTIONS = 'igcse_0580_curved_graphs_q';
const STORAGE_KEY_NAME = 'igcse_0580_student_name';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('quadratic');
  const [studentName, setStudentName] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_NAME) || '';
  });

  const [questions, setQuestions] = useState<QuestionData[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_QUESTIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with initial data in case new fields were added
        return INITIAL_QUESTIONS.map((initQ) => {
          const matching = parsed.find((p: QuestionData) => p.id === initQ.id);
          if (matching) {
            return {
              ...initQ,
              table: initQ.table.map((row) => {
                const matchedRow = matching.table?.find((mr: any) => mr.x === row.x);
                return { ...row, userY: matchedRow ? matchedRow.userY : '' };
              }),
              subQuestions: initQ.subQuestions.map((sub) => {
                const matchedSub = matching.subQuestions?.find((ms: any) => ms.id === sub.id);
                return { ...sub, userAnswer: matchedSub ? matchedSub.userAnswer : '' };
              }),
              workingOut: matching.workingOut || '',
            };
          }
          return initQ;
        });
      }
    } catch {
      // Fallback
    }
    return INITIAL_QUESTIONS;
  });

  const [activeQIndex, setActiveQIndex] = useState<number>(0);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);

  // Auto-save student name and questions to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_NAME, studentName);
  }, [studentName]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_QUESTIONS, JSON.stringify(questions));
  }, [questions]);

  // Update handlers
  const handleUpdateTableAnswer = (qId: string, x: number, val: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== qId) return q;
        return {
          ...q,
          table: q.table.map((row) => (row.x === x ? { ...row, userY: val } : row)),
        };
      })
    );
  };

  const handleUpdateSubAnswer = (qId: string, subId: string, val: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== qId) return q;
        return {
          ...q,
          subQuestions: q.subQuestions.map((sub) =>
            sub.id === subId ? { ...sub, userAnswer: val } : sub
          ),
        };
      })
    );
  };

  const handleUpdateWorkingOut = (qId: string, text: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === qId ? { ...q, workingOut: text } : q))
    );
  };

  const handleResetAll = () => {
    if (window.confirm('Reset all answers and working out for a clean re-attempt?')) {
      setQuestions(INITIAL_QUESTIONS);
      localStorage.removeItem(STORAGE_KEY_QUESTIONS);
      setIsSubmitModalOpen(false);
    }
  };

  const handleDownloadPdf = () => {
    window.print();
  };

  const handleOpenSubmit = () => {
    setIsSubmitModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0A1128] text-slate-100 flex flex-col font-sans selection:bg-[#4CC9F0]/30 selection:text-white">
      {/* Top Bar Contract Compliant Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        studentName={studentName}
        setStudentName={setStudentName}
        onSubmitWork={handleOpenSubmit}
        onDownloadPdf={handleDownloadPdf}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6 no-print">
        {/* Module Sub-Header & Syllabus Overview */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#101B38]/60 border border-[#23324C]/60 rounded-xl px-4 py-2.5 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-200">Cambridge IGCSE Mathematics (0580)</span>
            <span>·</span>
            <span>Subject Topic: Coordinate Geometry & Curved Graphs</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveTab('practice');
                setActiveQIndex(0);
              }}
              className="text-cyan-300 hover:text-white underline underline-offset-2 flex items-center gap-1 font-medium"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Jump to Exam Exercises (4 Questions)</span>
            </button>
          </div>
        </div>

        {/* Tab Modules */}
        {activeTab === 'quadratic' && (
          <QuadraticModule
            onGoToPractice={() => {
              setActiveTab('practice');
              setActiveQIndex(0);
            }}
          />
        )}

        {activeTab === 'cubic' && (
          <CubicModule
            onGoToPractice={() => {
              setActiveTab('practice');
              setActiveQIndex(1);
            }}
          />
        )}

        {activeTab === 'hyperbola' && (
          <HyperbolaModule
            onGoToPractice={() => {
              setActiveTab('practice');
              setActiveQIndex(2);
            }}
          />
        )}

        {activeTab === 'sandbox' && <SandboxModule />}

        {activeTab === 'practice' && (
          <PracticeWorkspace
            questions={questions}
            onUpdateTableAnswer={handleUpdateTableAnswer}
            onUpdateSubAnswer={handleUpdateSubAnswer}
            onUpdateWorkingOut={handleUpdateWorkingOut}
            activeQIndex={activeQIndex}
            setActiveQIndex={setActiveQIndex}
            onSubmitAll={handleOpenSubmit}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#1E293B] py-5 px-4 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Cambridge IGCSE™ Mathematics 0580 Curved Graphs Laboratory</span>
          <div className="flex items-center gap-3">
            <span>Quadratic</span>
            <span>·</span>
            <span>Cubic</span>
            <span>·</span>
            <span>Reciprocal Hyperbola</span>
            <span>·</span>
            <span>Tangents</span>
          </div>
        </div>
      </footer>

      {/* Submission Modal */}
      <SubmitModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        questions={questions}
        studentName={studentName}
        onDownloadPdf={handleDownloadPdf}
        onResetAll={handleResetAll}
      />

      {/* Clean Examination Worksheet Rendered Strictly for Printing/PDF */}
      <PrintSheet questions={questions} studentName={studentName} />
    </div>
  );
}
