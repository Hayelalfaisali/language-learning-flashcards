
export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
}

export interface QuizState {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  score: number;
  timeLeft: number;
  isQuizStarted: boolean;
  isQuizCompleted: boolean;
  selectedAnswer: number | null;
  categories: string[];
  selectedCategory: string | null;
}
