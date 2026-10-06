export type WorkoutSet = {
  id: number;
  setNumber: number;
  reps: number;
  weight: string | null;
};

export type WorkoutExercise = {
  id: number;
  exerciseId: number;
  name: string;
  muscleGroup: string;
  sets: WorkoutSet[];
};

export type Workout = {
  id: number;
  routineId: number | null;
  performedAt: string;
  notes: string | null;

  status: "active" | "completed";
  startedAt: string | null;
  endedAt: string | null;

  exercises?: WorkoutExercise[];
};