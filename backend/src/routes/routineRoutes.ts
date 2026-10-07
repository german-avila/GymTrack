import { Router } from "express";
import {
  addExerciseToRoutine,
  createRoutine,
  deleteRoutine,
  getRoutineById,
  getRoutines,
  updateRoutine,
  removeExerciseFromRoutine
} from "../controllers/routineController.js";

export const routineRouter =
  Router();

routineRouter.get(
  "/",
  getRoutines
);

routineRouter.get(
  "/:id",
  getRoutineById
);

routineRouter.post(
  "/",
  createRoutine
);

routineRouter.patch(
  "/:id",
  updateRoutine
);

routineRouter.delete(
  "/:id",
  deleteRoutine
);

routineRouter.post(
  "/:id/exercises",
  addExerciseToRoutine
);

routineRouter.delete(
  "/:id/exercises/:exerciseId",
  removeExerciseFromRoutine
);