import { useEffect, useState } from "react";

import WorkoutForm from "../components/WorkoutForm";
import WorkoutList from "../components/WorkoutList";
import WorkoutDetail from "../components/WorkoutDetail";

import type { Exercise } from "../types/Exercise";
import type { Routine } from "../types/Routine";
import type { Workout } from "../types/Workout";

import { getExercises } from "../services/exerciseService";
import { getRoutines } from "../services/routineService";

import {
  addExerciseToWorkout,
  addSetToWorkoutExercise,
  deleteWorkout as deleteWorkoutRequest,
  getWorkoutById,
  getWorkouts
} from "../services/workoutService";

function WorkoutsPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  const [editingWorkout, setEditingWorkout] =
    useState<Workout | null>(null);

  const [selectedWorkout, setSelectedWorkout] =
    useState<Workout | null>(null);

  const [workoutError, setWorkoutError] =
    useState<string | null>(null);

  async function loadExercises() {
    try {
      const data = await getExercises();
      setExercises(data);
    } catch (error) {
      console.error(error);
      setWorkoutError("No se pudieron cargar los ejercicios");
    }
  }

  async function loadRoutines() {
    try {
      const data = await getRoutines();
      setRoutines(data);
    } catch (error) {
      console.error(error);
      setWorkoutError("No se pudieron cargar las rutinas");
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

  function startEditingWorkout(workout: Workout) {
    setEditingWorkout(workout);
  }

  function cancelEditingWorkout() {
    setEditingWorkout(null);
  }

  async function handleWorkoutSaved() {
    await loadWorkouts();
    setEditingWorkout(null);
  }

  async function deleteWorkout(id: number) {
    try {
      await deleteWorkoutRequest(id);
      await loadWorkouts();

      if (editingWorkout?.id === id) {
        setEditingWorkout(null);
      }

      if (selectedWorkout?.id === id) {
        setSelectedWorkout(null);
      }
    } catch (error) {
      console.error(error);
      setWorkoutError("No se pudo eliminar el entrenamiento");
    }
  }

  async function viewWorkout(id: number) {
    try {
      const workout = await getWorkoutById(id);

      setSelectedWorkout(workout);
      setWorkoutError(null);
    } catch (error) {
      console.error(error);
      setWorkoutError("No se pudo cargar el entrenamiento");
    }
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

      const updatedWorkout =
        await getWorkoutById(selectedWorkout.id);

      setSelectedWorkout(updatedWorkout);
      setWorkoutError(null);
    } catch (error) {
      console.error(error);

      setWorkoutError(
        "No se pudo añadir el ejercicio al entrenamiento"
      );
    }
  }

  async function addSetToSelectedWorkoutExercise(
    workoutExerciseId: number,
    setNumber: number,
    reps: number,
    weight: number | null
  ) {
    if (!selectedWorkout) {
      return;
    }

    try {
      await addSetToWorkoutExercise(
        workoutExerciseId,
        setNumber,
        reps,
        weight
      );

      const updatedWorkout =
        await getWorkoutById(selectedWorkout.id);

      setSelectedWorkout(updatedWorkout);
      setWorkoutError(null);
    } catch (error) {
      console.error(error);
      setWorkoutError("No se pudo añadir la serie");
    }
  }

  useEffect(() => {
    loadExercises();
    loadRoutines();
    loadWorkouts();
  }, []);

  return (
    <section>
      <h2>Entrenamientos</h2>

      <WorkoutForm
        routines={routines}
        editingWorkout={editingWorkout}
        onWorkoutSaved={handleWorkoutSaved}
        onCancelEdit={cancelEditingWorkout}
      />

      {workoutError && <p>{workoutError}</p>}

      <WorkoutList
        workouts={workouts}
        onViewWorkout={viewWorkout}
        onEditWorkout={startEditingWorkout}
        onDeleteWorkout={deleteWorkout}
      />

      {selectedWorkout && (
        <WorkoutDetail
          workout={selectedWorkout}
          exercises={exercises}
          onAddExercise={addExerciseToSelectedWorkout}
          onAddSet={addSetToSelectedWorkoutExercise}
        />
      )}
    </section>
  );
}

export default WorkoutsPage;