import { Router } from "express";
import { getExerciseProgress } from "../controllers/progressController.js";

export const progressRouter = Router();

progressRouter.get(
  "/exercises/:exerciseId",
  getExerciseProgress
);