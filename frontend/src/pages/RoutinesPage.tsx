import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import AlertMessage
  from "../components/AlertMessage";

import FormModal
  from "../components/FormModal";

import RoutineForm
  from "../components/RoutineForm";

import RoutineList
  from "../components/RoutineList";

import type {
  Exercise
} from "../types/Exercise";

import type {
  Routine
} from "../types/Routine";

import {
  getExercises
} from "../services/exerciseService";

import {
  deleteRoutine as deleteRoutineRequest,
  getRoutineById,
  getRoutines
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
    isFormOpen,
    setIsFormOpen
  ] = useState(false);

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

  function startCreatingRoutine() {
    setEditingRoutine(null);
    setIsFormOpen(true);

    setError("");
    setSuccess("");
  }

  async function startEditingRoutine(
    routine: Routine
  ) {
    try {
      const fullRoutine =
        await getRoutineById(
          routine.id
        );

      setEditingRoutine(
        fullRoutine
      );

      setIsFormOpen(true);

      setError("");
      setSuccess("");
    } catch (error) {
      console.error(error);

      setError(
        "No se pudo cargar la rutina."
      );
    }
  }

  function closeRoutineForm() {
    setEditingRoutine(null);
    setIsFormOpen(false);
  }

  async function handleRoutineSaved() {
    const wasEditing =
      editingRoutine !== null;

    closeRoutineForm();

    try {
      await loadRoutines();

      setError("");

      setSuccess(
        wasEditing
          ? "Rutina actualizada correctamente."
          : "Rutina creada correctamente."
      );
    } catch (error) {
      console.error(error);

      setSuccess("");

      setError(
        "La rutina se guardó, pero no se pudo actualizar la lista."
      );
    }
  }

  async function deleteRoutine(
    id: number
  ) {
    try {
      await deleteRoutineRequest(
        id
      );

      await loadRoutines();

      setError("");

      setSuccess(
        "Rutina eliminada correctamente."
      );
    } catch (error) {
      console.error(error);

      setSuccess("");

      setError(
        "No se pudo eliminar la rutina."
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
      <header className="page-header">
        <div>
          <span className="page-kicker">
            Planificación
          </span>

          <h1>
            Rutinas
          </h1>

          <p>
            Construye tus entrenamientos
            habituales y empieza una sesión
            directamente desde aquí.
          </p>
        </div>

        <div className="page-header-actions">
          <div className="page-counter">
            <strong>
              {routines.length}
            </strong>

            <span>
              creadas
            </span>
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={
              startCreatingRoutine
            }
          >
            + Nueva rutina
          </button>
        </div>
      </header>

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

      <section className="content-section">
        <div className="section-heading">
          <div>
            <span>
              Entrenamiento
            </span>

            <h2>
              Tus rutinas
            </h2>
          </div>
        </div>

        <RoutineList
          routines={routines}
          onDeleteRoutine={
            deleteRoutine
          }
          onEditRoutine={
            startEditingRoutine
          }
          onStartWorkout={
            handleStartWorkout
          }
        />
      </section>

      {isFormOpen && (
        <FormModal
          wide
          eyebrow={
            editingRoutine
              ? "Editar rutina"
              : "Nueva rutina"
          }
          title={
            editingRoutine
              ? editingRoutine.name
              : "Crear rutina"
          }
          onClose={
            closeRoutineForm
          }
        >
          <RoutineForm
            exercises={exercises}
            editingRoutine={
              editingRoutine
            }
            onRoutineSaved={
              handleRoutineSaved
            }
            onCancelEdit={
              closeRoutineForm
            }
          />
        </FormModal>
      )}
    </main>
  );
}

export default RoutinesPage;