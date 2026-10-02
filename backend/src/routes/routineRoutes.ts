import { Router } from "express";
import {
  createRoutine,
  deleteRoutine,
  getRoutineById,
  getRoutines,
  updateRoutine
} from "../controllers/routineController.js";

export const routineRouter = Router();

routineRouter.get("/", getRoutines);
routineRouter.get("/:id", getRoutineById);
routineRouter.post("/", createRoutine);
routineRouter.patch("/:id", updateRoutine);
routineRouter.delete("/:id", deleteRoutine);