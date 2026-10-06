import type { Exercise } from "../types/Exercise";

const API_URL =
  `${import.meta.env.VITE_API_URL}/api/exercises`;
  
export async function getExercises(): Promise<Exercise[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to load exercises");
  }

  return response.json();
}

export async function createExercise(
  name: string,
  muscleGroup: string,
  description: string
): Promise<Exercise> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name,
      muscleGroup,
      description
    })
  });

  if (!response.ok) {
    throw new Error("Failed to create exercise");
  }

  return response.json();
}

export async function updateExercise(
  id: number,
  name: string,
  muscleGroup: string,
  description: string
): Promise<Exercise> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name,
      muscleGroup,
      description
    })
  });

  if (!response.ok) {
    throw new Error("Failed to update exercise");
  }

  return response.json();
}

export async function deleteExercise(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    throw new Error("Failed to delete exercise");
  }
}