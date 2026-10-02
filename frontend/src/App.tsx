import { useEffect, useState } from "react";
import ExerciseForm from "./components/ExerciseForm";
import ExerciseList from "./components/ExerciseList";
import type { Exercise } from "./types/Exercise";
import {
  deleteExercise as deleteExerciseRequest,
  getExercises
} from "./services/exerciseService";

function App() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

  async function loadExercises() {
    try {
      const data = await getExercises();

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
      await deleteExerciseRequest(id);
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