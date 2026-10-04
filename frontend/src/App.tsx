import { useEffect, useState } from "react";
import ExerciseForm from "./components/ExerciseForm";
import ExerciseList from "./components/ExerciseList";
import type { Exercise } from "./types/Exercise";
import {
  deleteExercise as deleteExerciseRequest,
  getExercises
} from "./services/exerciseService";
import "./App.css";
import RoutineForm from "./components/RoutineForm";
import RoutineList from "./components/RoutineList";
import type { Routine } from "./types/Routine";
import {
  deleteRoutine as deleteRoutineRequest,
  getRoutineById,
  getRoutines,
  removeExerciseFromRoutine,
  addExerciseToRoutine
} from "./services/routineService";

function App() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);
  const [routineError, setRoutineError] = useState<string | null>(null);
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);

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

  async function handleExerciseSaved() {
    await loadExercises();
    setEditingExercise(null);
    }

  async function loadRoutines() {
    try {
      const data = await getRoutines();

      setRoutines(data);
      setRoutineError(null);
    } catch {
      setRoutineError("No se pudieron cargar las rutinas.");
    }
  }

  async function deleteRoutine(id: number) {
    try {
      await deleteRoutineRequest(id);
      await loadRoutines();
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

  async function addExerciseToSelectedRoutine(exerciseId: number) {
  if (!selectedRoutine) {
    return;
  }

  try {
    await addExerciseToRoutine(selectedRoutine.id, exerciseId);

    const updatedRoutine = await getRoutineById(selectedRoutine.id);
    setSelectedRoutine(updatedRoutine);
    setRoutineError(null);
  } catch {
    setRoutineError("No se pudo añadir el ejercicio a la rutina.");
  }
}

async function removeExerciseFromSelectedRoutine(exerciseId: number) {
  if (!selectedRoutine) {
    return;
  }

  try {
    await removeExerciseFromRoutine(selectedRoutine.id, exerciseId);

    const updatedRoutine = await getRoutineById(selectedRoutine.id);
    setSelectedRoutine(updatedRoutine);
    setRoutineError(null);
  } catch {
    setRoutineError("No se pudo quitar el ejercicio de la rutina.");
  }
}

  useEffect(() => {
    loadExercises();
    loadRoutines();
  }, []);

  return (
    <main>
      <h1>GymTrack</h1>
      <p>Gestiona tus entrenamientos y sigue tu progreso.</p>

      <ExerciseForm
        onExerciseCreated={handleExerciseSaved}
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
          <section>
            <h3>Ejercicios de {selectedRoutine.name}</h3>

            <h4>En la rutina</h4>

            {selectedRoutine.exercises &&
            selectedRoutine.exercises.length > 0 ? (
              <ul>
                {selectedRoutine.exercises.map((exercise) => (
                  <li key={exercise.id}>
                    <strong>{exercise.name}</strong> - {exercise.muscleGroup}

                    <button
                      className="danger-button"
                      onClick={() =>
                        removeExerciseFromSelectedRoutine(exercise.id)
                      }
                    >
                      Quitar
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Esta rutina todavía no tiene ejercicios.</p>
            )}

            <h4>Añadir ejercicios</h4>

            <ul>
              {exercises.map((exercise) => {
                const isInRoutine = selectedRoutine.exercises?.some(
                  (routineExercise) => routineExercise.id === exercise.id
                );

                if (isInRoutine) {
                  return null;
                }

                return (
                  <li key={exercise.id}>
                    <strong>{exercise.name}</strong> - {exercise.muscleGroup}

                    <button
                      className="primary-button"
                      onClick={() =>
                        addExerciseToSelectedRoutine(exercise.id)
                      }
                    >
                      Añadir
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

      </section>

    </main>
  );
}

export default App;