import type { Workout } from "../types/Workout";

const API_URL =
  `${import.meta.env.VITE_API_URL}/api/workouts`;
  
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

export async function addExerciseToWorkout(
    workoutId: number,
    exerciseId: number
    ): Promise<void> {
    const response = await fetch(
        `${API_URL}/${workoutId}/exercises`,
        {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            exerciseId
        })
        }
    );

    if (!response.ok) {
        throw new Error("Failed to add exercise to workout");
    }
}

export async function addSetToWorkoutExercise(
    workoutExerciseId: number,
    setNumber: number,
    reps: number,
    weight: number | null
  ): Promise<void> {
    const response = await fetch(
      `${API_URL}/exercises/${workoutExerciseId}/sets`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          setNumber,
          reps,
          weight
        })
      }
    );

    if (!response.ok) {
      throw new Error("Failed to add set to workout exercise");
    }
}

export async function removeExerciseFromWorkout(
  workoutId: number,
  workoutExerciseId: number
): Promise<void> {
  const response = await fetch(
    `${API_URL}/${workoutId}/exercises/${workoutExerciseId}`,
    {
      method: "DELETE"
    }
  );

  if (!response.ok) {
    throw new Error("Failed to remove exercise from workout");
  }
}

export async function updateWorkoutSet(
  setId: number,
  setNumber: number,
  reps: number,
  weight: number | null
): Promise<void> {
  const response = await fetch(
    `${API_URL}/sets/${setId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        setNumber,
        reps,
        weight
      })
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update workout set");
  }
}

export async function deleteWorkoutSet(
  setId: number
): Promise<void> {
  const response = await fetch(
    `${API_URL}/sets/${setId}`,
    {
      method: "DELETE"
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete workout set");
  }
}