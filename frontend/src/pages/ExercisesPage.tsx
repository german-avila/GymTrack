import { useEffect, useState } from "react";

import ExerciseForm from "../components/ExerciseForm";
import ExerciseList from "../components/ExerciseList";

import type { Exercise } from "../types/Exercise";

import {
  deleteExercise as deleteExerciseRequest,
  getExercises
} from "../services/exerciseService";

function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingExercise, setEditingExercise] =
    useState<Exercise | null>(null);

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

      if (editingExercise?.id === id) {
        setEditingExercise(null);
      }
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

  async function handleExerciseSaved() {
    await loadExercises();
    setEditingExercise(null);
  }

  useEffect(() => {
    loadExercises();
  }, []);

  return (
    <section>
      <h2>Ejercicios</h2>

      <ExerciseForm
        onExerciseCreated={handleExerciseSaved}
        editingExercise={editingExercise}
        onCancelEdit={cancelEditingExercise}
      />

      {isLoading && <p>Cargando ejercicios...</p>}

      {error && <p>{error}</p>}

      {!isLoading && !error && (
        <ExerciseList
          exercises={exercises}
          onDeleteExercise={deleteExercise}
          onEditExercise={startEditingExercise}
        />
      )}
    </section>
  );
}

export default ExercisesPage;