import { Router } from "express";
import {
  createWorkout,
  getWorkoutById,
  getWorkouts,
  deleteWorkout,
  updateWorkout,
  addExerciseToWorkout,
  addSetToWorkoutExercise
} from "../controllers/workoutController.js";

export const workoutRouter = Router();

workoutRouter.get("/", getWorkouts);
workoutRouter.post("/", createWorkout);
workoutRouter.get("/:id", getWorkoutById);
workoutRouter.patch("/:id", updateWorkout);
workoutRouter.delete("/:id", deleteWorkout);
workoutRouter.post("/:id/exercises", addExerciseToWorkout);
workoutRouter.post(
  "/exercises/:workoutExerciseId/sets",
  addSetToWorkoutExercise
);