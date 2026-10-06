import type { ExerciseProgress } from "../types/Progress";

const API_URL = "http://localhost:3000/api/progress";

export async function getExerciseProgress(
  exerciseId: number
): Promise<ExerciseProgress> {
  const response = await fetch(
    `${API_URL}/exercises/${exerciseId}`
  );

  if (!response.ok) {
    throw new Error("Failed to load exercise progress");
  }

  return response.json();
}