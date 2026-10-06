import {
  useEffect,
  useState
} from "react";

import {
  useSearchParams
} from "react-router-dom";

import AlertMessage from "../components/AlertMessage";
import WorkoutForm from "../components/WorkoutForm";
import WorkoutList from "../components/WorkoutList";
import WorkoutDetail from "../components/WorkoutDetail";

import type { Exercise } from "../types/Exercise";
import type { Routine } from "../types/Routine";
import type { Workout } from "../types/Workout";

import {
  getExercises
} from "../services/exerciseService";

import {
  getRoutines
} from "../services/routineService";

import {
  addExerciseToWorkout,
  addSetToWorkoutExercise,
  deleteWorkout,
  deleteWorkoutSet,
  getWorkoutById,
  getWorkouts,
  removeExerciseFromWorkout,
  updateWorkoutSet
} from "../services/workoutService";

function WorkoutsPage() {
  const [searchParams] =
    useSearchParams();

  const [workouts, setWorkouts] =
    useState<Workout[]>([]);

  const [routines, setRoutines] =
    useState<Routine[]>([]);

  const [exercises, setExercises] =
    useState<Exercise[]>([]);

  const [
    selectedWorkout,
    setSelectedWorkout
  ] = useState<Workout | null>(null);

  const [
    editingWorkout,
    setEditingWorkout
  ] = useState<Workout | null>(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

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

  async function loadWorkouts() {
    try {
      const data =
        await getWorkouts();

      setWorkouts(data);
    } catch (error) {
      console.error(error);

      setError(
        "No se pudieron cargar los entrenamientos."
      );
    }
  }

  useEffect(() => {
    loadExercises();
    loadRoutines();
    loadWorkouts();
  }, []);

  useEffect(() => {
    const workoutId =
      Number(
        searchParams.get(
          "workout"
        )
      );

    if (
      Number.isInteger(
        workoutId
      ) &&
      workoutId > 0
    ) {
      viewWorkout(
        workoutId
      );
    }
  }, [searchParams]);

  function startEditingWorkout(
    workout: Workout
  ) {
    setEditingWorkout(
      workout
    );
  }

  function cancelEditingWorkout() {
    setEditingWorkout(null);
  }

  async function handleWorkoutSaved() {
    setEditingWorkout(null);

    setError("");
    setSuccess(
      "Entrenamiento guardado correctamente."
    );

    await loadWorkouts();
  }

  async function handleDeleteWorkout(
    id: number
  ) {
    try {
      await deleteWorkout(id);

      if (
        selectedWorkout?.id === id
      ) {
        setSelectedWorkout(null);
      }

      if (
        editingWorkout?.id === id
      ) {
        setEditingWorkout(null);
      }

      setError("");
      setSuccess(
        "Entrenamiento eliminado correctamente."
      );

      await loadWorkouts();
    } catch (error) {
      console.error(error);

      setSuccess("");
      setError(
        "No se pudo eliminar el entrenamiento."
      );
    }
  }

  async function viewWorkout(
    id: number
  ) {
    try {
      const workout =
        await getWorkoutById(id);

      setSelectedWorkout(
        workout
      );

      setError("");
    } catch (error) {
      console.error(error);

      setError(
        "No se pudo cargar el entrenamiento."
      );
    }
  }

  function closeWorkoutDetail() {
    setSelectedWorkout(null);
  }

  async function refreshSelectedWorkout() {
    if (!selectedWorkout) {
      return;
    }

    try {
      const workout =
        await getWorkoutById(
          selectedWorkout.id
        );

      setSelectedWorkout(
        workout
      );
    } catch (error) {
      console.error(error);

      setError(
        "No se pudo actualizar el entrenamiento."
      );
    }
  }

  async function handleAddExercise(
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

      setError("");
      setSuccess(
        "Ejercicio añadido al entrenamiento."
      );

      await refreshSelectedWorkout();
    } catch (error) {
      console.error(error);

      setSuccess("");
      setError(
        "No se pudo añadir el ejercicio."
      );
    }
  }

  async function handleRemoveExercise(
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

      setError("");
      setSuccess(
        "Ejercicio eliminado del entrenamiento."
      );

      await refreshSelectedWorkout();
    } catch (error) {
      console.error(error);

      setSuccess("");
      setError(
        "No se pudo eliminar el ejercicio."
      );
    }
  }

  async function handleAddSet(
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

      setError("");
      setSuccess(
        "Serie añadida correctamente."
      );

      await refreshSelectedWorkout();
    } catch (error) {
      console.error(error);

      setSuccess("");
      setError(
        "No se pudo añadir la serie."
      );
    }
  }

  async function handleUpdateSet(
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

      setError("");
      setSuccess(
        "Serie actualizada correctamente."
      );

      await refreshSelectedWorkout();
    } catch (error) {
      console.error(error);

      setSuccess("");
      setError(
        "No se pudo actualizar la serie."
      );
    }
  }

  async function handleDeleteSet(
    setId: number
  ) {
    try {
      await deleteWorkoutSet(
        setId
      );

      setError("");
      setSuccess(
        "Serie eliminada correctamente."
      );

      await refreshSelectedWorkout();
    } catch (error) {
      console.error(error);

      setSuccess("");
      setError(
        "No se pudo eliminar la serie."
      );
    }
  }

  return (
    <main className="page-content">
      <div className="page-header">
        <div>
          <span className="section-eyebrow">
            Entrenamientos
          </span>

          <h1>
            Historial de entrenamientos
          </h1>

          <p>
            Registra y consulta tus sesiones
            de entrenamiento.
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

      <WorkoutForm
        routines={routines}
        editingWorkout={
          editingWorkout
        }
        onWorkoutSaved={
          handleWorkoutSaved
        }
        onCancelEdit={
          cancelEditingWorkout
        }
      />

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
          handleDeleteWorkout
        }
      />

      {selectedWorkout && (
        <div
          className="workout-modal-backdrop"
          onMouseDown={
            closeWorkoutDetail
          }
        >
          <div
            className="workout-modal"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <div className="workout-modal-topbar">
              <div>
                <span className="section-eyebrow">
                  Entrenamiento
                </span>

                <h2>
                  Detalle de la sesión
                </h2>
              </div>

              <button
                type="button"
                className="workout-modal-close"
                onClick={
                  closeWorkoutDetail
                }
                aria-label="Cerrar detalle"
              >
                ×
              </button>
            </div>

            <div className="workout-modal-content">
              <WorkoutDetail
                workout={
                  selectedWorkout
                }
                exercises={
                  exercises
                }
                routines={
                  routines
                }
                onAddExercise={
                  handleAddExercise
                }
                onRemoveExercise={
                  handleRemoveExercise
                }
                onAddSet={
                  handleAddSet
                }
                onUpdateSet={
                  handleUpdateSet
                }
                onDeleteSet={
                  handleDeleteSet
                }
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default WorkoutsPage;