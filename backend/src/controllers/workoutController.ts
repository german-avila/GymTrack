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
    const workoutResult = await pool.query(
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

    if (workoutResult.rows.length === 0) {
      return res.status(404).json({
        message: "Workout not found"
      });
    }

    const exercisesResult = await pool.query(
      `
        SELECT
          we.id,
          we.exercise_id AS "exerciseId",
          e.name,
          e.muscle_group AS "muscleGroup"
        FROM workout_exercises we
        INNER JOIN exercises e
          ON we.exercise_id = e.id
        WHERE we.workout_id = $1
        ORDER BY we.id
      `,
      [workoutId]
    );

    const workoutExercises = [];

    for (const exercise of exercisesResult.rows) {
      const setsResult = await pool.query(
        `
          SELECT
            id,
            set_number AS "setNumber",
            reps,
            weight
          FROM workout_sets
          WHERE workout_exercise_id = $1
          ORDER BY set_number
        `,
        [exercise.id]
      );

      workoutExercises.push({
        ...exercise,
        sets: setsResult.rows
      });
    }

    return res.status(200).json({
      ...workoutResult.rows[0],
      exercises: workoutExercises
    });
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

export async function addExerciseToWorkout(req: Request, res: Response) {
  const workoutId = Number(req.params.id);
  const { exerciseId } = req.body;

  if (!Number.isInteger(workoutId) || workoutId <= 0) {
    return res.status(400).json({
      message: "Invalid workout ID"
    });
  }

  if (!Number.isInteger(exerciseId) || exerciseId <= 0) {
    return res.status(400).json({
      message: "Invalid exercise ID"
    });
  }

  try {
    const result = await pool.query(
      `
        INSERT INTO workout_exercises (
          workout_id,
          exercise_id
        )
        VALUES ($1, $2)
        RETURNING
          id,
          workout_id AS "workoutId",
          exercise_id AS "exerciseId"
      `,
      [workoutId, exerciseId]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Failed to add exercise to workout:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
}

export async function addSetToWorkoutExercise(req: Request, res: Response) {
  const workoutExerciseId = Number(req.params.workoutExerciseId);
  const { setNumber, reps, weight } = req.body;

  if (
    !Number.isInteger(workoutExerciseId) ||
    workoutExerciseId <= 0
  ) {
    return res.status(400).json({
      message: "Invalid workout exercise ID"
    });
  }

  if (!Number.isInteger(setNumber) || setNumber <= 0) {
    return res.status(400).json({
      message: "Invalid set number"
    });
  }

  if (!Number.isInteger(reps) || reps <= 0) {
    return res.status(400).json({
      message: "Invalid reps"
    });
  }

  if (
    weight !== undefined &&
    weight !== null &&
    (typeof weight !== "number" || weight < 0)
  ) {
    return res.status(400).json({
      message: "Invalid weight"
    });
  }

  try {
    const result = await pool.query(
      `
        INSERT INTO workout_sets (
          workout_exercise_id,
          set_number,
          reps,
          weight
        )
        VALUES ($1, $2, $3, $4)
        RETURNING
          id,
          workout_exercise_id AS "workoutExerciseId",
          set_number AS "setNumber",
          reps,
          weight
      `,
      [
        workoutExerciseId,
        setNumber,
        reps,
        weight ?? null
      ]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Failed to add set:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
}