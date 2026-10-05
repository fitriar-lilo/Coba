import React from 'react';
import { QuestionData } from '../types/math.ts';

interface PrintSheetProps {
  questions: QuestionData[];
  studentName: string;
}

export const PrintSheet: React.FC<PrintSheetProps> = ({ questions, studentName }) => {
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="print-only text-slate-900 bg-white p-8 font-sans max-w-4xl mx-auto">
      {/* Header with Cambridge Exam styling */}
      <div className="border-b-2 border-slate-900 pb-4 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              CAMBRIDGE INTERNATIONAL MATHEMATICS 0580
            </h1>
            <p className="text-sm font-semibold text-slate-700">
              Paper 2 & 4 Core/Extended: Curved Graphs Laboratory Worksheet
            </p>
          </div>
          <div className="text-right text-xs">
            <span className="block font-bold">SYLLABUS 0580</span>
            <span className="text-slate-600">{currentDate}</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-300 flex justify-between text-xs">
          <div>
            <span className="font-semibold text-slate-600">CANDIDATE NAME: </span>
            <span className="font-mono font-bold text-sm border-b border-dotted border-slate-800 px-3">
              {studentName || '__________________________'}
            </span>
          </div>
          <div>
            <span className="font-semibold text-slate-600">MAXIMUM MARKS: </span>
            <span className="font-mono font-bold">25 MARKS</span>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {questions.map((q, idx) => (
          <div key={`p-q-${q.id}`} className="print-card border border-slate-300 rounded-lg p-4">
            <div className="flex justify-between items-baseline border-b border-slate-200 pb-2 mb-3">
              <h2 className="font-bold text-sm text-slate-900">
                {idx + 1}. {q.title}
              </h2>
              <span className="font-mono text-xs font-bold text-slate-700">
                [{q.totalMarks} Marks]
              </span>
            </div>

            <p className="text-xs text-slate-800 mb-3">{q.description}</p>

            {/* Table of values */}
            {q.table.length > 0 && (
              <div className="mb-4">
                <span className="text-xs font-semibold block mb-1">
                  (a) Complete the table of values for <span className="font-mono">{q.formulaLatex}</span>:
                </span>
                <table className="w-full text-xs font-mono border-collapse border border-slate-400 text-center">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border border-slate-400 p-1.5 font-bold">x</th>
                      {q.table.map((r) => (
                        <th key={`p-th-${r.x}`} className="border border-slate-400 p-1.5">
                          {r.x}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-400 p-1.5 font-bold bg-slate-50">y</td>
                      {q.table.map((r) => (
                        <td key={`p-td-${r.x}`} className="border border-slate-400 p-1.5 font-bold">
                          {r.userY || '_____'}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Sub-questions */}
            <div className="space-y-2 mb-3">
              {q.subQuestions.map((sub, sIdx) => (
                <div key={`p-sub-${sIdx}`} className="text-xs">
                  <span className="font-semibold">
                    ({String.fromCharCode(98 + sIdx)}) {sub.prompt}
                  </span>
                  <div className="mt-1 font-mono font-bold text-slate-900 bg-slate-50 p-1.5 border border-slate-300 rounded">
                    Answer: {sub.userAnswer || '[No answer recorded]'}
                  </div>
                </div>
              ))}
            </div>

            {/* Working Out */}
            <div className="text-xs pt-2 border-t border-slate-200">
              <span className="font-semibold block mb-1 text-slate-700">
                Candidate Working Out / Method:
              </span>
              <div className="font-mono text-xs whitespace-pre-wrap bg-slate-50 p-2 border border-slate-300 rounded min-h-[40px]">
                {q.workingOut || '[No working out entered]'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t-2 border-slate-900 flex justify-between items-center text-xs text-slate-500">
        <span>Cambridge Assessment International Education · IGCSE 0580</span>
        <span>Curved Graphs Laboratory Record</span>
      </div>
    </div>
  );
};
