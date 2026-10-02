import { Router } from "express";
import {
  createExercise,
  getExerciseById,
  getExercises
} from "../controllers/exerciseController.js";

export const exerciseRouter = Router();

exerciseRouter.get("/", getExercises);
exerciseRouter.get("/:id", getExerciseById);
exerciseRouter.post("/", createExercise);