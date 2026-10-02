import { useEffect, useState } from "react";
import ExerciseForm from "./components/ExerciseForm";
import ExerciseList from "./components/ExerciseList";
import type { Exercise } from "./types/Exercise";

function App() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

  async function loadExercises() {
    try {
      const response = await fetch("http://localhost:3000/api/exercises");

      if (!response.ok) {
        throw new Error("Failed to load exercises");
      }

      const data: Exercise[] = await response.json();

      setExercises(data);
      setError(null);
    } catch {
      setError("No se pudieron cargar los ejercicios.");
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteExercise(id: number) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/exercises/${id}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete exercise");
      }

      await loadExercises();
    } catch {
      setError("No se pudo eliminar el ejercicio.");
    }
  }

  function startEditingExercise(exercise: Exercise) {
    setEditingExercise(exercise);
  }

  function cancelEditingExercise() {
  setEditingExercise(null);
  }

  useEffect(() => {
    loadExercises();
  }, []);

  return (
    <main>
      <h1>GymTrack</h1>
      <p>Gestiona tus entrenamientos y sigue tu progreso.</p>

      <ExerciseForm
        onExerciseCreated={loadExercises}
        editingExercise={editingExercise}
        onCancelEdit={cancelEditingExercise}
      />

      <h2>Ejercicios</h2>

      {isLoading && <p>Cargando ejercicios...</p>}

      {error && <p>{error}</p>}

      {!isLoading && !error && (
        <ExerciseList
          exercises={exercises}
          onDeleteExercise={deleteExercise}
          onEditExercise={startEditingExercise}
        />
      )}
    </main>
  );
}

export default App;