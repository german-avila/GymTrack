import { useEffect, useState } from "react";

import RoutineForm from "../components/RoutineForm";
import RoutineList from "../components/RoutineList";
import RoutineExerciseManager from "../components/RoutineExerciseManager";

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
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const [editingRoutine, setEditingRoutine] =
    useState<Routine | null>(null);

  const [selectedRoutine, setSelectedRoutine] =
    useState<Routine | null>(null);

  const [routineError, setRoutineError] =
    useState<string | null>(null);

  async function loadRoutines() {
    try {
      const data = await getRoutines();

      setRoutines(data);
      setRoutineError(null);
    } catch {
      setRoutineError("No se pudieron cargar las rutinas.");
    }
  }

  async function loadExercises() {
    try {
      const data = await getExercises();
      setExercises(data);
    } catch {
      setRoutineError("No se pudieron cargar los ejercicios.");
    }
  }

  async function deleteRoutine(id: number) {
    try {
      await deleteRoutineRequest(id);
      await loadRoutines();

      if (editingRoutine?.id === id) {
        setEditingRoutine(null);
      }

      if (selectedRoutine?.id === id) {
        setSelectedRoutine(null);
      }
    } catch {
      setRoutineError("No se pudo eliminar la rutina.");
    }
  }

  function startEditingRoutine(routine: Routine) {
    setEditingRoutine(routine);
  }

  function cancelEditingRoutine() {
    setEditingRoutine(null);
  }

  async function handleRoutineSaved() {
    await loadRoutines();
    setEditingRoutine(null);
  }

  async function manageRoutineExercises(routine: Routine) {
    try {
      const fullRoutine = await getRoutineById(routine.id);

      setSelectedRoutine(fullRoutine);
      setRoutineError(null);
    } catch {
      setRoutineError("No se pudo cargar la rutina.");
    }
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

      const updatedRoutine =
        await getRoutineById(selectedRoutine.id);

      setSelectedRoutine(updatedRoutine);
      setRoutineError(null);
    } catch {
      setRoutineError(
        "No se pudo añadir el ejercicio a la rutina."
      );
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

      const updatedRoutine =
        await getRoutineById(selectedRoutine.id);

      setSelectedRoutine(updatedRoutine);
      setRoutineError(null);
    } catch {
      setRoutineError(
        "No se pudo quitar el ejercicio de la rutina."
      );
    }
  }

  useEffect(() => {
    loadRoutines();
    loadExercises();
  }, []);

  return (
    <section>
      <h2>Rutinas</h2>

      <RoutineForm
        onRoutineSaved={handleRoutineSaved}
        editingRoutine={editingRoutine}
        onCancelEdit={cancelEditingRoutine}
      />

      {routineError && <p>{routineError}</p>}

      <RoutineList
        routines={routines}
        onDeleteRoutine={deleteRoutine}
        onEditRoutine={startEditingRoutine}
        onManageExercises={manageRoutineExercises}
      />

      {selectedRoutine && (
        <RoutineExerciseManager
          routine={selectedRoutine}
          exercises={exercises}
          onAddExercise={addExerciseToSelectedRoutine}
          onRemoveExercise={removeExerciseFromSelectedRoutine}
        />
      )}
    </section>
  );
}

export default RoutinesPage;