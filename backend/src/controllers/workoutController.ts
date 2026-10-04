import type { Request, Response } from "express";
import { pool } from "../database/db.js";

export async function getWorkouts(req: Request, res: Response) {
  try {
    const result = await pool.query(`
      SELECT
        id,
        routine_id AS "routineId",
        performed_at AS "performedAt",
        notes
      FROM workouts
      ORDER BY performed_at DESC
    `);

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Failed to get workouts:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
}

export async function getWorkoutById(req: Request, res: Response) {
  const workoutId = Number(req.params.id);

  if (!Number.isInteger(workoutId) || workoutId <= 0) {
    return res.status(400).json({
      message: "Invalid workout ID"
    });
  }

  try {
    const result = await pool.query(
      `
        SELECT
          id,
          routine_id AS "routineId",
          performed_at AS "performedAt",
          notes
        FROM workouts
        WHERE id = $1
      `,
      [workoutId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Workout not found"
      });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Failed to get workout:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
}

export async function createWorkout(req: Request, res: Response) {
  const { routineId, notes } = req.body;

  if (
    routineId !== undefined &&
    routineId !== null &&
    (!Number.isInteger(routineId) || routineId <= 0)
  ) {
    return res.status(400).json({
      message: "Invalid routine ID"
    });
  }

  if (notes !== undefined && typeof notes !== "string") {
    return res.status(400).json({
      message: "Notes must be a string"
    });
  }

  try {
    const result = await pool.query(
      `
        INSERT INTO workouts (routine_id, notes)
        VALUES ($1, $2)
        RETURNING
          id,
          routine_id AS "routineId",
          performed_at AS "performedAt",
          notes
      `,
      [
        routineId ?? null,
        notes?.trim() ?? null
      ]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Failed to create workout:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
}

export async function updateWorkout(req: Request, res: Response) {
  const workoutId = Number(req.params.id);
  const { routineId, notes } = req.body;

  if (!Number.isInteger(workoutId) || workoutId <= 0) {
    return res.status(400).json({
      message: "Invalid workout ID"
    });
  }

  if (
    routineId !== undefined &&
    routineId !== null &&
    (!Number.isInteger(routineId) || routineId <= 0)
  ) {
    return res.status(400).json({
      message: "Invalid routine ID"
    });
  }

  if (notes !== undefined && typeof notes !== "string") {
    return res.status(400).json({
      message: "Notes must be a string"
    });
  }

  try {
    const result = await pool.query(
      `
        UPDATE workouts
        SET
          routine_id = COALESCE($1, routine_id),
          notes = COALESCE($2, notes)
        WHERE id = $3
        RETURNING
          id,
          routine_id AS "routineId",
          performed_at AS "performedAt",
          notes
      `,
      [
        routineId ?? null,
        notes?.trim() ?? null,
        workoutId
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Workout not found"
      });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Failed to update workout:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
}

export async function deleteWorkout(req: Request, res: Response) {
  const workoutId = Number(req.params.id);

  if (!Number.isInteger(workoutId) || workoutId <= 0) {
    return res.status(400).json({
      message: "Invalid workout ID"
    });
  }

  try {
    const result = await pool.query(
      `
        DELETE FROM workouts
        WHERE id = $1
      `,
      [workoutId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Workout not found"
      });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("Failed to delete workout:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
}