import express from "express";
import { pool } from "./database/db.js";
import { exerciseRouter } from "./routes/exerciseRoutes.js";
import cors from "cors";
import { routineRouter } from "./routes/routineRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

const port = 3000;

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "GymTrack API is running correctly"
  });
});

app.use("/api/exercises", exerciseRouter);
app.use("/api/routines", routineRouter);

try {
  const result = await pool.query("SELECT NOW()");
  console.log("Database connected:", result.rows[0]);
} catch (error) {
  console.error("Database connection failed:", error);
}

app.listen(port, () => {
  console.log(`GymTrack backend running on port ${port}`);
});