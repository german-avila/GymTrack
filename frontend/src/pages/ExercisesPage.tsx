import { useEffect, useState } from "react";

import AlertMessage from "../components/AlertMessage";
import ExerciseForm from "../components/ExerciseForm";
import ExerciseList from "../components/ExerciseList";

import type { Exercise } from "../types/Exercise";

import {
  deleteExercise as deleteExerciseRequest,
  getExercises
} from "../services/exerciseService";

function ExercisesPage() {
  const [exercises, setExercises] =
    useState<Exercise[]>([]);

  const [editingExercise, setEditingExercise] =
    useState<Exercise | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] =
    useState<string | null>(null);

  async function loadExercises() {
    try {
      const data = await getExercises();

      setExercises(data);
    } catch (error) {
      console.error(error);

      setError(
        "No se pudieron cargar los ejercicios."
      );

      setSuccess(null);
    }
  }

  useEffect(() => {
    loadExercises();
  }, []);

  function startEditingExercise(
    exercise: Exercise
  ) {
    setEditingExercise(exercise);

    setError(null);
    setSuccess(null);
  }

  function cancelEditingExercise() {
    setEditingExercise(null);
  }

  async function handleExerciseSaved() {
    try {
      const wasEditing =
        editingExercise !== null;

      setEditingExercise(null);

      await loadExercises();

      setError(null);

      setSuccess(
        wasEditing
          ? "Ejercicio actualizado correctamente."
          : "Ejercicio creado correctamente."
      );
    } catch (error) {
      console.error(error);

      setError(
        "El ejercicio se guardó, pero no se pudo actualizar la lista."
      );

      setSuccess(null);
    }
  }

  async function deleteExercise(
    exerciseId: number
  ) {
    try {
      await deleteExerciseRequest(
        exerciseId
      );

      if (
        editingExercise?.id ===
        exerciseId
      ) {
        setEditingExercise(null);
      }

      await loadExercises();

      setError(null);

      setSuccess(
        "Ejercicio eliminado correctamente."
      );
    } catch (error) {
      console.error(error);

      setError(
        "No se pudo eliminar el ejercicio."
      );

      setSuccess(null);
    }
  }

  return (
    <section>
      <div className="dashboard-header">
        <div>
          <span className="workout-date-label">
            Biblioteca
          </span>

          <h2>Ejercicios</h2>

          <p>
            Crea y organiza los ejercicios
            disponibles para tus rutinas y
            entrenamientos.
          </p>
        </div>
      </div>

      {error && (
        <AlertMessage
          type="error"
          message={error}
        />
      )}

      {success && (
        <AlertMessage
          type="success"
          message={success}
        />
      )}

      <div className="dashboard-section">
        <ExerciseForm
          editingExercise={
            editingExercise
          }
          onExerciseCreated={
            handleExerciseSaved
          }
          onCancelEdit={
            cancelEditingExercise
          }
        />
      </div>

      <div className="dashboard-section">
        <h3>Mis ejercicios</h3>

        <ExerciseList
          exercises={exercises}
          onEditExercise={
            startEditingExercise
          }
          onDeleteExercise={
            deleteExercise
          }
        />
      </div>
    </section>
  );
}

export default ExercisesPage;