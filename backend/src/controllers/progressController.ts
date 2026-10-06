import type { Request, Response } from "express";
import { pool } from "../database/db.js";

export async function getExerciseProgress(
  req: Request,
  res: Response
) {
  const exerciseId = Number(req.params.exerciseId);

  if (!Number.isInteger(exerciseId) || exerciseId <= 0) {
    return res.status(400).json({
      message: "Invalid exercise ID"
    });
  }

  try {
    const exerciseResult = await pool.query(
      `
        SELECT
          id,
          name,
          muscle_group AS "muscleGroup"
        FROM exercises
        WHERE id = $1
      `,
      [exerciseId]
    );

    if (exerciseResult.rows.length === 0) {
      return res.status(404).json({
        message: "Exercise not found"
      });
    }

    const summaryResult = await pool.query(
      `
        SELECT
          COUNT(DISTINCT we.workout_id)::int AS "workoutCount",
          COUNT(ws.id)::int AS "setCount",
          MAX(ws.weight) AS "bestWeight",
          MAX(ws.reps)::int AS "bestReps"
        FROM workout_exercises we
        LEFT JOIN workout_sets ws
          ON ws.workout_exercise_id = we.id
        WHERE we.exercise_id = $1
      `,
      [exerciseId]
    );

    const historyResult = await pool.query(
      `
        SELECT
          w.id AS "workoutId",
          w.performed_at AS "performedAt",
          ws.id AS "setId",
          ws.set_number AS "setNumber",
          ws.reps,
          ws.weight
        FROM workout_exercises we
        INNER JOIN workouts w
          ON w.id = we.workout_id
        INNER JOIN workout_sets ws
          ON ws.workout_exercise_id = we.id
        WHERE we.exercise_id = $1
        ORDER BY
          w.performed_at DESC,
          ws.set_number ASC
      `,
      [exerciseId]
    );

    return res.status(200).json({
      exercise: exerciseResult.rows[0],
      summary: summaryResult.rows[0],
      history: historyResult.rows
    });
  } catch (error) {
    console.error("Failed to get exercise progress:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
}