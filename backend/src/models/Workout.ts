export interface Workout {
  id: number;
  routineId: number | null;
  performedAt: string;
  notes?: string;
}