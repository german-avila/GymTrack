import express from "express";
import cors from "cors";

import { exerciseRouter } from "./routes/exerciseRoutes.js";
import { routineRouter } from "./routes/routineRoutes.js";
import { workoutRouter } from "./routes/workoutRoutes.js";
import { progressRouter } from "./routes/progressRoutes.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "GymTrack API is running correctly"
  });
});

app.use("/api/exercises", exerciseRouter);
app.use("/api/routines", routineRouter);
app.use("/api/workouts", workoutRouter);
app.use("/api/progress", progressRouter);