import { useEffect, useState } from "react";

import AlertMessage from "../components/AlertMessage";
import WorkoutDetail from "../components/WorkoutDetail";
import WorkoutForm from "../components/WorkoutForm";
import WorkoutList from "../components/WorkoutList";

import type { Exercise } from "../types/Exercise";
import type { Routine } from "../types/Routine";
import type { Workout } from "../types/Workout";

import { getExercises } from "../services/exerciseService";
import { getRoutines } from "../services/routineService";

import {
  addExerciseToWorkout,
  addSetToWorkoutExercise,
  deleteWorkout as deleteWorkoutRequest,
  deleteWorkoutSet,
  getWorkoutById,
  getWorkouts,
  removeExerciseFromWorkout,
  updateWorkoutSet
} from "../services/workoutService";

function WorkoutsPage() {
  const [exercises, setExercises] =
    useState<Exercise[]>([]);

  const [routines, setRoutines] =
    useState<Routine[]>([]);

  const [workouts, setWorkouts] =
    useState<Workout[]>([]);

  const [selectedWorkout, setSelectedWorkout] =
    useState<Workout | null>(null);

  const [editingWorkout, setEditingWorkout] =
    useState<Workout | null>(null);

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

  async function loadRoutines() {
    try {
      const data = await getRoutines();
      setRoutines(data);
    } catch (error) {
      console.error(error);

      setError(
        "No se pudieron cargar las rutinas."
      );

      setSuccess(null);
    }
  }

  async function loadWorkouts() {
    try {
      const data = await getWorkouts();
      setWorkouts(data);
    } catch (error) {
      console.error(error);

      setError(
        "No se pudieron cargar los entrenamientos."
      );

      setSuccess(null);
    }
  }

  useEffect(() => {
    loadExercises();
    loadRoutines();
    loadWorkouts();
  }, []);

  function startEditingWorkout(
    workout: Workout
  ) {
    setEditingWorkout(workout);

    setError(null);
    setSuccess(null);
  }

  function cancelEditingWorkout() {
    setEditingWorkout(null);
  }

  async function handleWorkoutSaved() {
    try {
      const editedWorkoutId =
        editingWorkout?.id ?? null;

      setEditingWorkout(null);

      await loadWorkouts();

      if (
        selectedWorkout &&
        editedWorkoutId === selectedWorkout.id
      ) {
        const updatedWorkout =
          await getWorkoutById(
            selectedWorkout.id
          );

        setSelectedWorkout(
          updatedWorkout
        );
      }

      setError(null);

      setSuccess(
        editedWorkoutId === null
          ? "Entrenamiento creado correctamente."
          : "Entrenamiento actualizado correctamente."
      );
    } catch (error) {
      console.error(error);

      setError(
        "El entrenamiento se guardó, pero no se pudo actualizar la información de la pantalla."
      );

      setSuccess(null);
    }
  }

  async function deleteWorkout(
    workoutId: number
  ) {
    try {
      await deleteWorkoutRequest(
        workoutId
      );

      if (
        selectedWorkout?.id === workoutId
      ) {
        setSelectedWorkout(null);
      }

      if (
        editingWorkout?.id === workoutId
      ) {
        setEditingWorkout(null);
      }

      await loadWorkouts();

      setError(null);

      setSuccess(
        "Entrenamiento eliminado correctamente."
      );
    } catch (error) {
      console.error(error);

      setError(
        "No se pudo eliminar el entrenamiento."
      );

      setSuccess(null);
    }
  }

  async function viewWorkout(
    workoutId: number
  ) {
    try {
      const workout =
        await getWorkoutById(
          workoutId
        );

      setSelectedWorkout(workout);

      setError(null);
      setSuccess(null);
    } catch (error) {
      console.error(error);

      setError(
        "No se pudo cargar el entrenamiento."
      );

      setSuccess(null);
    }
  }

  async function refreshSelectedWorkout() {
    if (!selectedWorkout) {
      return;
    }

    const updatedWorkout =
      await getWorkoutById(
        selectedWorkout.id
      );

    setSelectedWorkout(
      updatedWorkout
    );
  }

  async function addExerciseToSelectedWorkout(
    exerciseId: number
  ) {
    if (!selectedWorkout) {
      return;
    }

    try {
      await addExerciseToWorkout(
        selectedWorkout.id,
        exerciseId
      );

      await refreshSelectedWorkout();

      setError(null);

      setSuccess(
        "Ejercicio añadido al entrenamiento."
      );
    } catch (error) {
      console.error(error);

      setError(
        "No se pudo añadir el ejercicio."
      );

      setSuccess(null);
    }
  }

  async function removeExerciseFromSelectedWorkout(
    workoutExerciseId: number
  ) {
    if (!selectedWorkout) {
      return;
    }

    try {
      await removeExerciseFromWorkout(
        selectedWorkout.id,
        workoutExerciseId
      );

      await refreshSelectedWorkout();

      setError(null);

      setSuccess(
        "Ejercicio eliminado del entrenamiento."
      );
    } catch (error) {
      console.error(error);

      setError(
        "No se pudo eliminar el ejercicio."
      );

      setSuccess(null);
    }
  }

  async function addSetToSelectedWorkoutExercise(
    workoutExerciseId: number,
    setNumber: number,
    reps: number,
    weight: number | null
  ) {
    try {
      await addSetToWorkoutExercise(
        workoutExerciseId,
        setNumber,
        reps,
        weight
      );

      await refreshSelectedWorkout();

      setError(null);

      setSuccess(
        "Serie añadida correctamente."
      );
    } catch (error) {
      console.error(error);

      setError(
        "No se pudo añadir la serie."
      );

      setSuccess(null);
    }
  }

  async function updateSetInSelectedWorkout(
    setId: number,
    setNumber: number,
    reps: number,
    weight: number | null
  ) {
    try {
      await updateWorkoutSet(
        setId,
        setNumber,
        reps,
        weight
      );

      await refreshSelectedWorkout();

      setError(null);

      setSuccess(
        "Serie actualizada correctamente."
      );
    } catch (error) {
      console.error(error);

      setError(
        "No se pudo actualizar la serie."
      );

      setSuccess(null);
    }
  }

  async function deleteSetFromSelectedWorkout(
    setId: number
  ) {
    try {
      await deleteWorkoutSet(
        setId
      );

      await refreshSelectedWorkout();

      setError(null);

      setSuccess(
        "Serie eliminada correctamente."
      );
    } catch (error) {
      console.error(error);

      setError(
        "No se pudo eliminar la serie."
      );

      setSuccess(null);
    }
  }

  return (
    <section>
      <div className="dashboard-header">
        <div>
          <span className="workout-date-label">
            Entrenamientos
          </span>

          <h2>Mis entrenamientos</h2>

          <p>
            Registra tus sesiones y controla
            los ejercicios y series realizadas.
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
        <WorkoutForm
          routines={routines}
          editingWorkout={editingWorkout}
          onWorkoutSaved={
            handleWorkoutSaved
          }
          onCancelEdit={
            cancelEditingWorkout
          }
        />
      </div>

      <div className="dashboard-section">
        <h3>
          Historial de entrenamientos
        </h3>

        <WorkoutList
          workouts={workouts}
          routines={routines}
          onViewWorkout={
            viewWorkout
          }
          onEditWorkout={
            startEditingWorkout
          }
          onDeleteWorkout={
            deleteWorkout
          }
        />
      </div>

      {selectedWorkout && (
        <div className="dashboard-section">
          <WorkoutDetail
            workout={selectedWorkout}
            exercises={exercises}
            routines={routines}
            onAddExercise={
              addExerciseToSelectedWorkout
            }
            onRemoveExercise={
              removeExerciseFromSelectedWorkout
            }
            onAddSet={
              addSetToSelectedWorkoutExercise
            }
            onUpdateSet={
              updateSetInSelectedWorkout
            }
            onDeleteSet={
              deleteSetFromSelectedWorkout
            }
          />
        </div>
      )}
    </section>
  );
}

export default WorkoutsPage;