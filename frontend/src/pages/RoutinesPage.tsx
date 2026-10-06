import { useEffect, useState } from "react";

import AlertMessage from "../components/AlertMessage";
import RoutineExerciseManager from "../components/RoutineExerciseManager";
import RoutineForm from "../components/RoutineForm";
import RoutineList from "../components/RoutineList";

import type { Exercise } from "../types/Exercise";
import type { Routine } from "../types/Routine";

import { getExercises } from "../services/exerciseService";

import {
  addExerciseToRoutine,
  deleteRoutine as deleteRoutineRequest,
  getRoutineById,
  getRoutines,
  removeExerciseFromRoutine
} from "../services/routineService";

function RoutinesPage() {
  const [routines, setRoutines] =
    useState<Routine[]>([]);

  const [exercises, setExercises] =
    useState<Exercise[]>([]);

  const [editingRoutine, setEditingRoutine] =
    useState<Routine | null>(null);

  const [selectedRoutine, setSelectedRoutine] =
    useState<Routine | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] =
    useState<string | null>(null);

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
    loadRoutines();
    loadExercises();
  }, []);

  function startEditingRoutine(
    routine: Routine
  ) {
    setEditingRoutine(routine);

    setError(null);
    setSuccess(null);
  }

  function cancelEditingRoutine() {
    setEditingRoutine(null);
  }

  async function handleRoutineSaved() {
    try {
      const wasEditing =
        editingRoutine !== null;

      setEditingRoutine(null);

      await loadRoutines();

      setError(null);

      setSuccess(
        wasEditing
          ? "Rutina actualizada correctamente."
          : "Rutina creada correctamente."
      );
    } catch (error) {
      console.error(error);

      setError(
        "La rutina se guardó, pero no se pudo actualizar la lista."
      );

      setSuccess(null);
    }
  }

  async function deleteRoutine(
    routineId: number
  ) {
    try {
      await deleteRoutineRequest(
        routineId
      );

      if (
        editingRoutine?.id ===
        routineId
      ) {
        setEditingRoutine(null);
      }

      if (
        selectedRoutine?.id ===
        routineId
      ) {
        setSelectedRoutine(null);
      }

      await loadRoutines();

      setError(null);

      setSuccess(
        "Rutina eliminada correctamente."
      );
    } catch (error) {
      console.error(error);

      setError(
        "No se pudo eliminar la rutina."
      );

      setSuccess(null);
    }
  }

  async function manageExercises(
    routine: Routine
  ) {
    try {
      const detailedRoutine =
        await getRoutineById(
          routine.id
        );

      setSelectedRoutine(
        detailedRoutine
      );

      setError(null);
      setSuccess(null);
    } catch (error) {
      console.error(error);

      setError(
        "No se pudo cargar la rutina."
      );

      setSuccess(null);
    }
  }

  async function refreshSelectedRoutine() {
    if (!selectedRoutine) {
      return;
    }

    const detailedRoutine =
      await getRoutineById(
        selectedRoutine.id
      );

    setSelectedRoutine(
      detailedRoutine
    );

    await loadRoutines();
  }

  async function addExerciseToSelectedRoutine(
    exerciseId: number
  ) {
    if (!selectedRoutine) {
      return;
    }

    try {
      await addExerciseToRoutine(
        selectedRoutine.id,
        exerciseId
      );

      await refreshSelectedRoutine();

      setError(null);

      setSuccess(
        "Ejercicio añadido a la rutina."
      );
    } catch (error) {
      console.error(error);

      setError(
        "No se pudo añadir el ejercicio a la rutina."
      );

      setSuccess(null);
    }
  }

  async function removeExerciseFromSelectedRoutine(
    exerciseId: number
  ) {
    if (!selectedRoutine) {
      return;
    }

    try {
      await removeExerciseFromRoutine(
        selectedRoutine.id,
        exerciseId
      );

      await refreshSelectedRoutine();

      setError(null);

      setSuccess(
        "Ejercicio eliminado de la rutina."
      );
    } catch (error) {
      console.error(error);

      setError(
        "No se pudo eliminar el ejercicio de la rutina."
      );

      setSuccess(null);
    }
  }

  return (
    <section>
      <div className="dashboard-header">
        <div>
          <span className="workout-date-label">
            Planificación
          </span>

          <h2>Rutinas</h2>

          <p>
            Organiza tus ejercicios en rutinas
            para reutilizarlas en tus
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
        <RoutineForm
          editingRoutine={
            editingRoutine
          }
          onRoutineSaved={
            handleRoutineSaved
          }
          onCancelEdit={
            cancelEditingRoutine
          }
        />
      </div>

      <div className="dashboard-section">
        <h3>Mis rutinas</h3>

        <RoutineList
          routines={routines}
          onDeleteRoutine={
            deleteRoutine
          }
          onEditRoutine={
            startEditingRoutine
          }
          onManageExercises={
            manageExercises
          }
        />
      </div>

      {selectedRoutine && (
        <div className="dashboard-section">
          <RoutineExerciseManager
            routine={
              selectedRoutine
            }
            exercises={exercises}
            onAddExercise={
              addExerciseToSelectedRoutine
            }
            onRemoveExercise={
              removeExerciseFromSelectedRoutine
            }
          />
        </div>
      )}
    </section>
  );
}

export default RoutinesPage;