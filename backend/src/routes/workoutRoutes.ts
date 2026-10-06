import { Router } from "express";

import {
  addExerciseToWorkout,
  addSetToWorkoutExercise,
  completeWorkout,
  createWorkout,
  createWorkoutFromRoutine,
  deleteWorkout,
  deleteWorkoutSet,
  getWorkoutById,
  getWorkouts,
  removeExerciseFromWorkout,
  updateWorkout,
  updateWorkoutSet
} from "../controllers/workoutController.js";

export const workoutRouter =
  Router();

/*
  Workouts created from routines
*/
workoutRouter.post(
  "/from-routine/:routineId",
  createWorkoutFromRoutine
);

/*
  Workout sets
*/
workoutRouter.post(
  "/exercises/:workoutExerciseId/sets",
  addSetToWorkoutExercise
);

workoutRouter.patch(
  "/sets/:setId",
  updateWorkoutSet
);

workoutRouter.delete(
  "/sets/:setId",
  deleteWorkoutSet
);

/*
  General workouts
*/
workoutRouter.get(
  "/",
  getWorkouts
);

workoutRouter.post(
  "/",
  createWorkout
);

/*
  Complete live workout

  Esta ruta debe ir antes de /:id
  para mantener las rutas específicas
  antes de las genéricas.
*/
workoutRouter.patch(
  "/:id/complete",
  completeWorkout
);

/*
  Exercises inside a workout
*/
workoutRouter.post(
  "/:id/exercises",
  addExerciseToWorkout
);

workoutRouter.delete(
  "/:id/exercises/:workoutExerciseId",
  removeExerciseFromWorkout
);

/*
  Workout by ID
*/
workoutRouter.get(
  "/:id",
  getWorkoutById
);

workoutRouter.patch(
  "/:id",
  updateWorkout
);

workoutRouter.delete(
  "/:id",
  deleteWorkout
);