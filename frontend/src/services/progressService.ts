import type { ExerciseProgress } from "../types/Progress";

const API_URL =
  `${import.meta.env.VITE_API_URL}/api/progress`;
  
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