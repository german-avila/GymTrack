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
import RoutineExerciseManager from "./components/RoutineExerciseManager";
import WorkoutForm from "./components/WorkoutForm";
import WorkoutList from "./components/WorkoutList";
import type { Workout } from "./types/Workout";
import { getWorkouts } from "./services/workoutService";


function App() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);
  const [routineError, setRoutineError] = useState<string | null>(null);
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [workoutError, setWorkoutError] = useState<string | null>(null);


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

  async function loadWorkouts() {
    try {
      const data = await getWorkouts();
      setWorkouts(data);
      setWorkoutError(null);
    } catch (error) {
      console.error(error);
      setWorkoutError("No se pudieron cargar los entrenamientos");
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
    loadWorkouts();
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
          <RoutineExerciseManager
            routine={selectedRoutine}
            exercises={exercises}
            onAddExercise={addExerciseToSelectedRoutine}
            onRemoveExercise={removeExerciseFromSelectedRoutine}
          />
        )}

      </section>
      
      <section>
        <WorkoutForm
          routines={routines}
          onWorkoutCreated={loadWorkouts}
        />

        <h2>Entrenamientos</h2>

        {workoutError && <p>{workoutError}</p>}

        <WorkoutList workouts={workouts} />
      </section>

    </main>
  );
}

export default App;