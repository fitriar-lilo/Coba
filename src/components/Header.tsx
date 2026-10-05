import React from 'react';
import { TabType } from '../types/math.ts';
import { Download, CheckSquare, User, BookOpen } from 'lucide-react';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  studentName: string;
  setStudentName: (name: string) => void;
  onSubmitWork: () => void;
  onDownloadPdf: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  studentName,
  setStudentName,
  onSubmitWork,
  onDownloadPdf,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0A1128]/90 backdrop-blur-md border-b border-[#1E293B] px-4 lg:px-8 py-3 no-print">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Zone 1: Brand title wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('quadratic')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <span className="text-lg font-bold tracking-tight text-white group-hover:text-[#4CC9F0] transition-colors whitespace-nowrap">
              IGCSE 0580: Curved Graphs
            </span>
          </button>
          <span className="hidden sm:inline-block text-xs font-mono text-[#4CC9F0] bg-[#142142] px-2 py-0.5 rounded border border-cyan-500/30">
            Topic 2.11
          </span>
        </div>

        {/* Zone 2: Navigation Tabs */}
        <nav className="flex items-center gap-1 p-1 bg-[#101B38] rounded-xl border border-[#23324C] overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('quadratic')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'quadratic'
                ? 'bg-[#4CC9F0] text-[#0A1128] font-bold shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Quadratic (ax²)
          </button>

          <button
            onClick={() => setActiveTab('cubic')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'cubic'
                ? 'bg-[#4CC9F0] text-[#0A1128] font-bold shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Cubic (ax³)
          </button>

          <button
            onClick={() => setActiveTab('hyperbola')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'hyperbola'
                ? 'bg-[#4CC9F0] text-[#0A1128] font-bold shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Hyperbola (a/x)
          </button>

          <button
            onClick={() => setActiveTab('sandbox')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'sandbox'
                ? 'bg-[#4CC9F0] text-[#0A1128] font-bold shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Sandbox Lab
          </button>

          <button
            onClick={() => setActiveTab('practice')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'practice'
                ? 'bg-gradient-to-r from-[#4CC9F0] to-[#4895EF] text-[#0A1128] font-bold shadow-md shadow-cyan-500/20'
                : 'text-amber-300 hover:text-amber-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Practice Workspace</span>
          </button>
        </nav>

        {/* Zone 3: Student Name & Action Toolbar */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {/* Candidate Name Input */}
          <div className="relative flex items-center">
            <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Candidate Name..."
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="pl-8 pr-2.5 py-1.5 text-xs font-medium bg-[#101B38] border border-[#23324C] rounded-lg text-white placeholder-slate-400 w-36 sm:w-44 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          {/* Download as PDF Button */}
          <button
            onClick={onDownloadPdf}
            title="Download Worksheet as PDF / Print"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1C2541] hover:bg-[#2A3B5C] border border-[#2A3B5C] text-slate-200 text-xs font-medium rounded-lg transition-colors whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">PDF</span>
          </button>

          {/* Submit Work Button */}
          <button
            onClick={onSubmitWork}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-[#4CC9F0] to-[#4895EF] text-[#0A1128] text-xs font-bold rounded-lg shadow-md shadow-cyan-500/25 hover:opacity-95 transition-all whitespace-nowrap cursor-pointer"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Submit Work</span>
          </button>
        </div>
      </div>
    </header>
  );
};
