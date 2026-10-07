import type { Routine } from "../types/Routine";

const API_URL =
  `${import.meta.env.VITE_API_URL}/api/routines`;

export async function getRoutines(): Promise<Routine[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(
      "Failed to get routines"
    );
  }

  return response.json();
}

export async function getRoutineById(
  id: number
): Promise<Routine> {
  const response = await fetch(
    `${API_URL}/${id}`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to get routine"
    );
  }

  return response.json();
}

export async function createRoutine(
  name: string,
  description: string,
  exerciseIds: number[]
): Promise<Routine> {
  const response = await fetch(
    API_URL,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json"
      },

      body: JSON.stringify({
        name,
        description,
        exerciseIds
      })
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to create routine"
    );
  }

  return response.json();
}

export async function updateRoutine(
  id: number,
  name: string,
  description: string,
  exerciseIds: number[]
): Promise<Routine> {
  const response = await fetch(
    `${API_URL}/${id}`,
    {
      method: "PATCH",

      headers: {
        "Content-Type":
          "application/json"
      },

      body: JSON.stringify({
        name,
        description,
        exerciseIds
      })
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to update routine"
    );
  }

  return response.json();
}

export async function deleteRoutine(
  id: number
): Promise<void> {
  const response = await fetch(
    `${API_URL}/${id}`,
    {
      method: "DELETE"
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to delete routine"
    );
  }
}

