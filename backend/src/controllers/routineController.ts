import type { Request, Response } from "express";
import { pool } from "../database/db.js";

function validateExerciseIds(
  exerciseIds: unknown
): number[] | null {
  if (exerciseIds === undefined) {
    return [];
  }

  if (!Array.isArray(exerciseIds)) {
    return null;
  }

  const parsedIds = exerciseIds.map(
    (id) => Number(id)
  );

  const allValid = parsedIds.every(
    (id) =>
      Number.isInteger(id) &&
      id > 0
  );

  if (!allValid) {
    return null;
  }

  return parsedIds;
}

export async function getRoutines(
  req: Request,
  res: Response
) {
  try {
    const result = await pool.query(`
      SELECT
        r.id,
        r.name,
        r.description,
        COALESCE(
          json_agg(
            json_build_object(
              'id', e.id,
              'name', e.name,
              'muscleGroup', e.muscle_group,
              'description', e.description,
              'isSystem', e.is_system
            )
          ) FILTER (
            WHERE e.id IS NOT NULL
          ),
          '[]'
        ) AS exercises
      FROM routines r
      LEFT JOIN routine_exercises re
        ON re.routine_id = r.id
      LEFT JOIN exercises e
        ON e.id = re.exercise_id
      GROUP BY
        r.id,
        r.name,
        r.description
      ORDER BY r.id
    `);

    return res.status(200).json(
      result.rows
    );
  } catch (error) {
    console.error(
      "Failed to get routines:",
      error
    );

    return res.status(500).json({
      message:
        "Internal server error"
    });
  }
}

export async function getRoutineById(
  req: Request,
  res: Response
) {
  const id = Number(req.params.id);

  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {
    return res.status(400).json({
      message:
        "Invalid routine ID"
    });
  }

  try {
    const routineResult =
      await pool.query(
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

    if (
      routineResult.rows.length === 0
    ) {
      return res.status(404).json({
        message:
          "Routine not found"
      });
    }

    const exercisesResult =
      await pool.query(
        `
          SELECT
            e.id,
            e.name,
            e.muscle_group
              AS "muscleGroup",
            e.description,
            e.is_system
              AS "isSystem"
          FROM exercises e
          INNER JOIN routine_exercises re
            ON e.id =
               re.exercise_id
          WHERE
            re.routine_id = $1
          ORDER BY e.id
        `,
        [id]
      );

    return res.status(200).json({
      ...routineResult.rows[0],
      exercises:
        exercisesResult.rows
    });
  } catch (error) {
    console.error(
      "Failed to get routine:",
      error
    );

    return res.status(500).json({
      message:
        "Internal server error"
    });
  }
}

export async function createRoutine(
  req: Request,
  res: Response
) {
  const {
    name,
    description,
    exerciseIds
  } = req.body;

  if (
    typeof name !== "string" ||
    name.trim() === ""
  ) {
    return res.status(400).json({
      message:
        "Name must be a non-empty string"
    });
  }

  if (
    description !== undefined &&
    typeof description !== "string"
  ) {
    return res.status(400).json({
      message:
        "Description must be a string"
    });
  }

  const parsedExerciseIds =
    validateExerciseIds(
      exerciseIds
    );

  if (
    parsedExerciseIds === null
  ) {
    return res.status(400).json({
      message:
        "exerciseIds must be an array of valid IDs"
    });
  }

  const client =
    await pool.connect();

  try {
    await client.query("BEGIN");

    if (
      parsedExerciseIds.length > 0
    ) {
      const existingExercises =
        await client.query(
          `
            SELECT id
            FROM exercises
            WHERE id = ANY($1::int[])
          `,
          [parsedExerciseIds]
        );

      if (
        existingExercises.rows
          .length !==
        parsedExerciseIds.length
      ) {
        await client.query(
          "ROLLBACK"
        );

        return res
          .status(400)
          .json({
            message:
              "One or more exercises do not exist"
          });
      }
    }

    const routineResult =
      await client.query(
        `
          INSERT INTO routines (
            name,
            description
          )
          VALUES ($1, $2)
          RETURNING
            id,
            name,
            description
        `,
        [
          name.trim(),
          description?.trim() ??
            null
        ]
      );

    const routine =
      routineResult.rows[0];

    for (
      const exerciseId of
      parsedExerciseIds
    ) {
      await client.query(
        `
          INSERT INTO routine_exercises (
            routine_id,
            exercise_id
          )
          VALUES ($1, $2)
        `,
        [
          routine.id,
          exerciseId
        ]
      );
    }

    await client.query("COMMIT");

    return res.status(201).json({
      ...routine,
      exercises:
        parsedExerciseIds
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error(
      "Failed to create routine:",
      error
    );

    return res.status(500).json({
      message:
        "Internal server error"
    });
  } finally {
    client.release();
  }
}

export async function updateRoutine(
  req: Request,
  res: Response
) {
  const id = Number(req.params.id);

  const {
    name,
    description,
    exerciseIds
  } = req.body;

  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {
    return res.status(400).json({
      message:
        "Invalid routine ID"
    });
  }

  if (
    typeof name !== "string" ||
    name.trim() === ""
  ) {
    return res.status(400).json({
      message:
        "Name must be a non-empty string"
    });
  }

  if (
    description !== undefined &&
    typeof description !== "string"
  ) {
    return res.status(400).json({
      message:
        "Description must be a string"
    });
  }

  const parsedExerciseIds =
    validateExerciseIds(
      exerciseIds
    );

  if (
    parsedExerciseIds === null
  ) {
    return res.status(400).json({
      message:
        "exerciseIds must be an array of valid IDs"
    });
  }

  const client =
    await pool.connect();

  try {
    await client.query("BEGIN");

    const routineResult =
      await client.query(
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
          description?.trim() ??
            null,
          id
        ]
      );

    if (
      routineResult.rows
        .length === 0
    ) {
      await client.query(
        "ROLLBACK"
      );

      return res.status(404).json({
        message:
          "Routine not found"
      });
    }

    if (
      parsedExerciseIds.length > 0
    ) {
      const existingExercises =
        await client.query(
          `
            SELECT id
            FROM exercises
            WHERE id = ANY($1::int[])
          `,
          [parsedExerciseIds]
        );

      if (
        existingExercises.rows
          .length !==
        parsedExerciseIds.length
      ) {
        await client.query(
          "ROLLBACK"
        );

        return res
          .status(400)
          .json({
            message:
              "One or more exercises do not exist"
          });
      }
    }

    await client.query(
      `
        DELETE FROM routine_exercises
        WHERE routine_id = $1
      `,
      [id]
    );

    for (
      const exerciseId of
      parsedExerciseIds
    ) {
      await client.query(
        `
          INSERT INTO routine_exercises (
            routine_id,
            exercise_id
          )
          VALUES ($1, $2)
        `,
        [
          id,
          exerciseId
        ]
      );
    }

    await client.query("COMMIT");

    return res.status(200).json({
      ...routineResult.rows[0],
      exercises:
        parsedExerciseIds
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error(
      "Failed to update routine:",
      error
    );

    return res.status(500).json({
      message:
        "Internal server error"
    });
  } finally {
    client.release();
  }
}

export async function deleteRoutine(
  req: Request,
  res: Response
) {
  const id = Number(req.params.id);

  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {
    return res.status(400).json({
      message:
        "Invalid routine ID"
    });
  }

  try {
    const result =
      await pool.query(
        `
          DELETE FROM routines
          WHERE id = $1
          RETURNING id
        `,
        [id]
      );

    if (
      result.rows.length === 0
    ) {
      return res.status(404).json({
        message:
          "Routine not found"
      });
    }

    return res.status(204).send();
  } catch (error) {
    console.error(
      "Failed to delete routine:",
      error
    );

    return res.status(500).json({
      message:
        "Internal server error"
    });
  }
}