import type { Request, Response } from "express";
import { pool } from "../database/db.js";

export async function getRoutines(req: Request, res: Response) {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        description
      FROM routines
      ORDER BY id
    `);

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Failed to get routines:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
}

export async function deleteRoutine(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "Invalid routine ID"
    });
  }

  try {
    const result = await pool.query(
      `
        DELETE FROM routines
        WHERE id = $1
        RETURNING id
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Routine not found"
      });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("Failed to delete routine:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
}

export async function updateRoutine(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { name, description } = req.body;

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "Invalid routine ID"
    });
  }

  if (typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({
      message: "Name must be a non-empty string"
    });
  }

  if (description !== undefined && typeof description !== "string") {
    return res.status(400).json({
      message: "Description must be a string"
    });
  }

  try {
    const result = await pool.query(
      `
        UPDATE routines
        SET
          name = $1,
          description = $2
        WHERE id = $3
        RETURNING
          id,
          name,
          description
      `,
      [
        name.trim(),
        description?.trim() ?? null,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Routine not found"
      });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Failed to update routine:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
}

export async function getRoutineById(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "Invalid routine ID"
    });
  }

  try {
    const routineResult = await pool.query(
      `
        SELECT
          id,
          name,
          description
        FROM routines
        WHERE id = $1
      `,
      [id]
    );

    if (routineResult.rows.length === 0) {
      return res.status(404).json({
        message: "Routine not found"
      });
    }

    const exercisesResult = await pool.query(
      `
        SELECT
          e.id,
          e.name,
          e.muscle_group AS "muscleGroup",
          e.description
        FROM exercises e
        INNER JOIN routine_exercises re
          ON e.id = re.exercise_id
        WHERE re.routine_id = $1
        ORDER BY e.id
      `,
      [id]
    );

    return res.status(200).json({
      ...routineResult.rows[0],
      exercises: exercisesResult.rows
    });
  } catch (error) {
    console.error("Failed to get routine:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
}

export async function createRoutine(req: Request, res: Response) {
  const { name, description } = req.body;

  if (typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({
      message: "Name must be a non-empty string"
    });
  }

  if (description !== undefined && typeof description !== "string") {
    return res.status(400).json({
      message: "Description must be a string"
    });
  }

  try {
    const result = await pool.query(
      `
        INSERT INTO routines (name, description)
        VALUES ($1, $2)
        RETURNING
          id,
          name,
          description
      `,
      [
        name.trim(),
        description?.trim() ?? null
      ]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Failed to create routine:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
    }
}
  export async function addExerciseToRoutine(req: Request, res: Response) {
  const routineId = Number(req.params.id);
  const exerciseId = Number(req.body.exerciseId);

  if (
    !Number.isInteger(routineId) ||
    routineId <= 0 ||
    !Number.isInteger(exerciseId) ||
    exerciseId <= 0
  ) {
    return res.status(400).json({
      message: "Invalid routine or exercise ID"
    });
  }

  try {
    const result = await pool.query(
      `
        INSERT INTO routine_exercises (routine_id, exercise_id)
        VALUES ($1, $2)
        RETURNING
          routine_id AS "routineId",
          exercise_id AS "exerciseId"
      `,
      [routineId, exerciseId]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Failed to add exercise to routine:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
}
  export async function removeExerciseFromRoutine(req: Request, res: Response) {
  const routineId = Number(req.params.id);
  const exerciseId = Number(req.params.exerciseId);

  if (
    !Number.isInteger(routineId) ||
    routineId <= 0 ||
    !Number.isInteger(exerciseId) ||
    exerciseId <= 0
  ) {
    return res.status(400).json({
      message: "Invalid routine or exercise ID"
    });
  }

  try {
    const result = await pool.query(
      `
        DELETE FROM routine_exercises
        WHERE routine_id = $1
          AND exercise_id = $2
        RETURNING
          routine_id AS "routineId",
          exercise_id AS "exerciseId"
      `,
      [routineId, exerciseId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Exercise is not part of this routine"
      });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("Failed to remove exercise from routine:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
}

  

