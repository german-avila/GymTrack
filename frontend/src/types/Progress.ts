export type ExerciseProgressSummary = {
  workoutCount: number;
  setCount: number;
  bestWeight: string | null;
  bestReps: number | null;
};

export type ExerciseProgressHistoryItem = {
  workoutId: number;
  performedAt: string;
  setId: number;
  setNumber: number;
  reps: number;
  weight: string | null;
};

export type ExerciseProgress = {
  exercise: {
    id: number;
    name: string;
    muscleGroup: string;
  };

  summary: ExerciseProgressSummary;

  history: ExerciseProgressHistoryItem[];
};