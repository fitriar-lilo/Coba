export type TabType = 'quadratic' | 'cubic' | 'hyperbola' | 'sandbox' | 'practice';

export interface TableRow {
  x: number;
  correctY: number;
  userY: string;
}

export interface QuestionData {
  id: string;
  title: string;
  syllabusCode: string;
  curveType: 'Quadratic' | 'Cubic' | 'Hyperbola' | 'Tangent';
  description: string;
  formulaLatex: string;
  table: TableRow[];
  totalMarks: number;
  hints: string[];
  markScheme: {
    rule: string;
    marks: number;
    code: string; // e.g. B2, M1, A1
  }[];
  // Sub-question specific fields
  subQuestions: {
    id: string;
    prompt: string;
    expectedAnswer: string;
    acceptedAnswers?: string[];
    userAnswer: string;
    marks: number;
    explanation: string;
  }[];
  workingOut: string;
}

export interface StudentState {
  studentName: string;
  startedAt: string;
  questions: {
    [questionId: string]: {
      tableAnswers: { [xKey: string]: string };
      subAnswers: { [subId: string]: string };
      workingOut: string;
      isSubmitted: boolean;
      checked: boolean;
    };
  };
  scoreTotal: number;
  maxScoreTotal: number;
  feedbackNotes: string[];
  isFullySubmitted: boolean;
}

export interface CurvePoint {
  x: number;
  y: number;
}
