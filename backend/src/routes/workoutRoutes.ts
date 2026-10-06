import { Router } from "express";
import {
  createWorkout,
  getWorkoutById,
  getWorkouts,
  deleteWorkout,
  updateWorkout,
  addExerciseToWorkout,
  addSetToWorkoutExercise,
  removeExerciseFromWorkout,
  deleteWorkoutSet,
  updateWorkoutSet,
  createWorkoutFromRoutine
} from "../controllers/workoutController.js";

export const workoutRouter = Router();

workoutRouter.get("/", getWorkouts);
workoutRouter.post("/", createWorkout);
workoutRouter.post(
  "/from-routine/:routineId",
  createWorkoutFromRoutine
);
workoutRouter.get("/:id", getWorkoutById);
workoutRouter.patch("/:id", updateWorkout);
workoutRouter.delete("/:id", deleteWorkout);
workoutRouter.post("/:id/exercises", addExerciseToWorkout);
workoutRouter.post(
  "/exercises/:workoutExerciseId/sets",
  addSetToWorkoutExercise
);
workoutRouter.delete(
  "/:id/exercises/:workoutExerciseId",
  removeExerciseFromWorkout
);
workoutRouter.patch("/sets/:setId", updateWorkoutSet);
workoutRouter.delete("/sets/:setId", deleteWorkoutSet);
