import { Router } from "express";
import {
  createExercise,
  getExerciseById,
  getExercises,
  updateExercise,
  deleteExercise
} from "../controllers/exerciseController.js";

export const exerciseRouter = Router();

exerciseRouter.get("/", getExercises);
exerciseRouter.get("/:id", getExerciseById);
exerciseRouter.post("/", createExercise);
exerciseRouter.patch("/:id", updateExercise);
exerciseRouter.delete("/:id", deleteExercise);