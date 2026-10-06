import "dotenv/config";

import express from "express";
import cors from "cors";

import { pool } from "./database/db.js";

import { exerciseRouter } from "./routes/exerciseRoutes.js";
import { routineRouter } from "./routes/routineRoutes.js";
import { workoutRouter } from "./routes/workoutRoutes.js";
import { progressRouter } from "./routes/progressRoutes.js";

const app = express();

const port = Number(process.env.PORT) || 3000;

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

try {
  const result = await pool.query("SELECT NOW()");

  console.log(
    "Database connected:",
    result.rows[0]
  );
} catch (error) {
  console.error(
    "Database connection failed:",
    error
  );
}

app.listen(port, () => {
  console.log(
    `GymTrack backend running on port ${port}`
  );
});