import type { Workout } from "../types/Workout";

const API_URL = "http://localhost:3000/api/workouts";

export async function getWorkouts(): Promise<Workout[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to load workouts");
  }

  return response.json();
}

export async function getWorkoutById(id: number): Promise<Workout> {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Failed to load workout");
  }

  return response.json();
}

export async function createWorkout(
  routineId: number | null,
  notes: string
): Promise<Workout> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      routineId,
      notes
    })
  });

  if (!response.ok) {
    throw new Error("Failed to create workout");
  }

  return response.json();
}

export async function updateWorkout(
    id: number,
    routineId: number | null,
    notes: string
    ): Promise<Workout> {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({
        routineId,
        notes
        })
    });

    if (!response.ok) {
        throw new Error("Failed to update workout");
    }

    return response.json();
    }

    export async function deleteWorkout(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error("Failed to delete workout");
    }
}