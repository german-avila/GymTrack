import type { Routine } from "../types/Routine";

const API_URL = "http://localhost:3000/api/routines";

export async function getRoutines(): Promise<Routine[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to load routines");
  }

  return response.json();
}

export async function createRoutine(
  name: string,
  description: string
): Promise<Routine> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name,
      description
    })
  });

  if (!response.ok) {
    throw new Error("Failed to create routine");
  }

  return response.json();
}

export async function updateRoutine(
  id: number,
  name: string,
  description: string
): Promise<Routine> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name,
      description
    })
  });

  if (!response.ok) {
    throw new Error("Failed to update routine");
  }

  return response.json();
}

export async function deleteRoutine(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    throw new Error("Failed to delete routine");
  }
}

export async function getRoutineById(id: number): Promise<Routine> {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Failed to load routine");
  }

  return response.json();
}

export async function addExerciseToRoutine(
  routineId: number,
  exerciseId: number
): Promise<void> {
  const response = await fetch(`${API_URL}/${routineId}/exercises`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      exerciseId
    })
  });

  if (!response.ok) {
    throw new Error("Failed to add exercise to routine");
  }
}

export async function removeExerciseFromRoutine(
  routineId: number,
  exerciseId: number
): Promise<void> {
  const response = await fetch(
    `${API_URL}/${routineId}/exercises/${exerciseId}`,
    {
      method: "DELETE"
    }
  );

  if (!response.ok) {
    throw new Error("Failed to remove exercise from routine");
  }
}