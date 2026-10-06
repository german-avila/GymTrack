import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import AlertMessage from "../components/AlertMessage";
import RoutineForm from "../components/RoutineForm";
import RoutineList from "../components/RoutineList";
import RoutineExerciseManager from "../components/RoutineExerciseManager";

import type { Exercise } from "../types/Exercise";
import type { Routine } from "../types/Routine";

import {
  getExercises
} from "../services/exerciseService";

import {
  addExerciseToRoutine,
  deleteRoutine as deleteRoutineRequest,
  getRoutineById,
  getRoutines,
  removeExerciseFromRoutine
} from "../services/routineService";

import {
  createWorkoutFromRoutine
} from "../services/workoutService";

function RoutinesPage() {
  const navigate =
    useNavigate();

  const [routines, setRoutines] =
    useState<Routine[]>([]);

  const [exercises, setExercises] =
    useState<Exercise[]>([]);

  const [
    editingRoutine,
    setEditingRoutine
  ] = useState<Routine | null>(null);

  const [
    selectedRoutine,
    setSelectedRoutine
  ] = useState<Routine | null>(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  async function loadRoutines() {
    try {
      const data =
        await getRoutines();

      setRoutines(data);
    } catch (error) {
      console.error(error);

      setError(
        "No se pudieron cargar las rutinas."
      );
    }
  }

  async function loadExercises() {
    try {
      const data =
        await getExercises();

      setExercises(data);
    } catch (error) {
      console.error(error);

      setError(
        "No se pudieron cargar los ejercicios."
      );
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
  }

  function cancelEditingRoutine() {
    setEditingRoutine(null);
  }

  async function handleRoutineSaved() {
    setEditingRoutine(null);

    setError("");
    setSuccess(
      "Rutina guardada correctamente."
    );

    await loadRoutines();
  }

  async function deleteRoutine(
    id: number
  ) {
    try {
      await deleteRoutineRequest(
        id
      );

      if (
        selectedRoutine?.id === id
      ) {
        setSelectedRoutine(null);
      }

      if (
        editingRoutine?.id === id
      ) {
        setEditingRoutine(null);
      }

      setError("");
      setSuccess(
        "Rutina eliminada correctamente."
      );

      await loadRoutines();
    } catch (error) {
      console.error(error);

      setSuccess("");
      setError(
        "No se pudo eliminar la rutina."
      );
    }
  }

  async function manageRoutineExercises(
    routine: Routine
  ) {
    try {
      const fullRoutine =
        await getRoutineById(
          routine.id
        );

      setSelectedRoutine(
        fullRoutine
      );

      setError("");
    } catch (error) {
      console.error(error);

      setError(
        "No se pudo cargar la rutina."
      );
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
        await getRoutineById(
          selectedRoutine.id
        );

      setSelectedRoutine(
        updatedRoutine
      );

      setError("");
      setSuccess(
        "Ejercicio añadido a la rutina."
      );

      await loadRoutines();
    } catch (error) {
      console.error(error);

      setSuccess("");
      setError(
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
        await getRoutineById(
          selectedRoutine.id
        );

      setSelectedRoutine(
        updatedRoutine
      );

      setError("");
      setSuccess(
        "Ejercicio eliminado de la rutina."
      );

      await loadRoutines();
    } catch (error) {
      console.error(error);

      setSuccess("");
      setError(
        "No se pudo quitar el ejercicio de la rutina."
      );
    }
  }

  async function handleStartWorkout(
    routine: Routine
  ) {
    try {
      const workout =
        await createWorkoutFromRoutine(
          routine.id
        );

      navigate(
        `/workouts?workout=${workout.id}`
      );
    } catch (error) {
      console.error(error);

      setSuccess("");
      setError(
        "No se pudo iniciar el entrenamiento."
      );
    }
  }

  return (
    <main className="page-content">
      <div className="page-header">
        <div>
          <span className="section-eyebrow">
            Rutinas
          </span>

          <h1>
            Mis rutinas
          </h1>

          <p>
            Crea plantillas de entrenamiento
            y organiza sus ejercicios.
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

      <RoutineList
        routines={routines}
        onDeleteRoutine={
          deleteRoutine
        }
        onEditRoutine={
          startEditingRoutine
        }
        onManageExercises={
          manageRoutineExercises
        }
        onStartWorkout={
          handleStartWorkout
        }
      />

      {selectedRoutine && (
        <RoutineExerciseManager
          routine={
            selectedRoutine
          }
          exercises={
            exercises
          }
          onAddExercise={
            addExerciseToSelectedRoutine
          }
          onRemoveExercise={
            removeExerciseFromSelectedRoutine
          }
        />
      )}
    </main>
  );
}

export default RoutinesPage;