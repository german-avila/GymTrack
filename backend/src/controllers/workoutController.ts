import type { Request, Response } from "express";
import { pool } from "../database/db.js";

async function getWorkoutStatusByWorkoutExerciseId(
  workoutExerciseId: number
) {
  const result = await pool.query(
    `
      SELECT
        w.status
      FROM workout_exercises we
      JOIN workouts w
        ON w.id = we.workout_id
      WHERE we.id = $1
    `,
    [workoutExerciseId]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0].status as
    | "active"
    | "completed";
}

async function getWorkoutStatusBySetId(
  setId: number
) {
  const result = await pool.query(
    `
      SELECT
        w.status
      FROM workout_sets ws
      JOIN workout_exercises we
        ON we.id = ws.workout_exercise_id
      JOIN workouts w
        ON w.id = we.workout_id
      WHERE ws.id = $1
    `,
    [setId]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0].status as
    | "active"
    | "completed";
}


export async function getWorkouts(req: Request, res: Response) {
  try {
    const result = await pool.query(`
      SELECT
        id,
        routine_id AS "routineId",
        performed_at AS "performedAt",
        notes,
        status,
        started_at AS "startedAt",
        ended_at AS "endedAt"
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
          notes,
          status,
          started_at AS "startedAt",
          ended_at AS "endedAt"
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

export async function createWorkout(
  req: Request,
  res: Response
) {
  const {
    routineId = null,
    notes = ""
  } = req.body;

  if (
    routineId !== null &&
    (
      !Number.isInteger(routineId) ||
      routineId <= 0
    )
  ) {
    return res.status(400).json({
      message: "Invalid routine ID"
    });
  }

  try {
    const activeWorkoutResult =
      await pool.query(
        `
          SELECT id
          FROM workouts
          WHERE status = 'active'
          LIMIT 1
        `
      );

    if (
      activeWorkoutResult.rows.length > 0
    ) {
      return res.status(409).json({
        message:
          "There is already an active workout"
      });
    }

    const result =
      await pool.query(
        `
          INSERT INTO workouts (
            routine_id,
            notes,
            status,
            started_at
          )
          VALUES (
            $1,
            $2,
            'active',
            NOW()
          )
          RETURNING
            id,
            routine_id AS "routineId",
            performed_at AS "performedAt",
            notes,
            status,
            started_at AS "startedAt",
            ended_at AS "endedAt"
        `,
        [
          routineId,
          typeof notes === "string" &&
          notes.trim() !== ""
            ? notes.trim()
            : null
        ]
      );

    return res
      .status(201)
      .json(result.rows[0]);
  } catch (error) {
    console.error(
      "Failed to create workout:",
      error
    );

    return res.status(500).json({
      message:
        "Internal server error"
    });
  }
}

export async function updateWorkout(
  req: Request,
  res: Response
) {
  const workoutId = Number(req.params.id);

  const {
    routineId,
    notes
  } = req.body;

  if (
    !Number.isInteger(workoutId) ||
    workoutId <= 0
  ) {
    return res.status(400).json({
      message: "Invalid workout ID"
    });
  }

  if (
    routineId !== undefined &&
    routineId !== null &&
    (
      !Number.isInteger(routineId) ||
      routineId <= 0
    )
  ) {
    return res.status(400).json({
      message: "Invalid routine ID"
    });
  }

  if (
    notes !== undefined &&
    typeof notes !== "string"
  ) {
    return res.status(400).json({
      message:
        "Notes must be a string"
    });
  }

  try {
    const workoutResult =
      await pool.query(
        `
          SELECT status
          FROM workouts
          WHERE id = $1
        `,
        [workoutId]
      );

    if (
      workoutResult.rows.length === 0
    ) {
      return res.status(404).json({
        message:
          "Workout not found"
      });
    }

    if (
      workoutResult.rows[0].status !==
      "active"
    ) {
      return res.status(403).json({
        message:
          "Completed workouts cannot be modified"
      });
    }

    const result =
      await pool.query(
        `
          UPDATE workouts
          SET
            routine_id =
              COALESCE($1, routine_id),
            notes =
              COALESCE($2, notes)
          WHERE id = $3
          RETURNING
            id,
            routine_id
              AS "routineId",
            performed_at
              AS "performedAt",
            notes,
            status,
            started_at
              AS "startedAt",
            ended_at
              AS "endedAt"
        `,
        [
          routineId ?? null,
          notes?.trim() ?? null,
          workoutId
        ]
      );

    return res.status(200).json(
      result.rows[0]
    );
  } catch (error) {
    console.error(
      "Failed to update workout:",
      error
    );

    return res.status(500).json({
      message:
        "Internal server error"
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

export async function addExerciseToWorkout(
  req: Request,
  res: Response
) {
  const workoutId =
    Number(req.params.id);

  const exerciseId =
    Number(req.body.exerciseId);

  if (
    !Number.isInteger(workoutId) ||
    workoutId <= 0 ||
    !Number.isInteger(exerciseId) ||
    exerciseId <= 0
  ) {
    return res.status(400).json({
      message:
        "Invalid workout or exercise ID"
    });
  }

  try {
    const workoutResult =
      await pool.query(
        `
          SELECT status
          FROM workouts
          WHERE id = $1
        `,
        [workoutId]
      );

    if (
      workoutResult.rows.length === 0
    ) {
      return res.status(404).json({
        message:
          "Workout not found"
      });
    }

    if (
      workoutResult.rows[0].status !==
      "active"
    ) {
      return res.status(403).json({
        message:
          "Completed workouts cannot be modified"
      });
    }

    const exerciseResult =
      await pool.query(
        `
          SELECT id
          FROM exercises
          WHERE id = $1
        `,
        [exerciseId]
      );

    if (
      exerciseResult.rows.length === 0
    ) {
      return res.status(404).json({
        message:
          "Exercise not found"
      });
    }

    await pool.query(
      `
        INSERT INTO workout_exercises (
          workout_id,
          exercise_id
        )
        VALUES ($1, $2)
      `,
      [
        workoutId,
        exerciseId
      ]
    );

    return res
      .status(201)
      .json({
        message:
          "Exercise added to workout"
      });
  } catch (error) {
    console.error(
      "Failed to add exercise to workout:",
      error
    );

    return res.status(500).json({
      message:
        "Internal server error"
    });
  }
}

export async function addSetToWorkoutExercise(
  req: Request,
  res: Response
) {
  const workoutExerciseId =
    Number(
      req.params.workoutExerciseId
    );

  const {
    setNumber,
    reps,
    weight
  } = req.body;

  if (
    !Number.isInteger(
      workoutExerciseId
    ) ||
    workoutExerciseId <= 0
  ) {
    return res.status(400).json({
      message:
        "Invalid workout exercise ID"
    });
  }

  if (
    !Number.isInteger(setNumber) ||
    setNumber <= 0 ||
    !Number.isInteger(reps) ||
    reps <= 0
  ) {
    return res.status(400).json({
      message:
        "Invalid set number or reps"
    });
  }

  if (
    weight !== null &&
    weight !== undefined &&
    (
      typeof weight !== "number" ||
      weight < 0
    )
  ) {
    return res.status(400).json({
      message:
        "Invalid weight"
    });
  }

  try {
    const status =
      await getWorkoutStatusByWorkoutExerciseId(
        workoutExerciseId
      );

    if (status === null) {
      return res.status(404).json({
        message:
          "Workout exercise not found"
      });
    }

    if (status !== "active") {
      return res.status(403).json({
        message:
          "Completed workouts cannot be modified"
      });
    }

    const result =
      await pool.query(
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

    return res
      .status(201)
      .json(result.rows[0]);
  } catch (error) {
    console.error(
      "Failed to add workout set:",
      error
    );

    return res.status(500).json({
      message:
        "Internal server error"
    });
  }
}

export async function removeExerciseFromWorkout(
  req: Request,
  res: Response
) {
  const workoutId =
    Number(req.params.id);

  const workoutExerciseId =
    Number(
      req.params.workoutExerciseId
    );

  if (
    !Number.isInteger(workoutId) ||
    workoutId <= 0 ||
    !Number.isInteger(
      workoutExerciseId
    ) ||
    workoutExerciseId <= 0
  ) {
    return res.status(400).json({
      message:
        "Invalid workout exercise ID"
    });
  }

  try {
    const workoutResult =
      await pool.query(
        `
          SELECT status
          FROM workouts
          WHERE id = $1
        `,
        [workoutId]
      );

    if (
      workoutResult.rows.length === 0
    ) {
      return res.status(404).json({
        message:
          "Workout not found"
      });
    }

    if (
      workoutResult.rows[0].status !==
      "active"
    ) {
      return res.status(403).json({
        message:
          "Completed workouts cannot be modified"
      });
    }

    const result =
      await pool.query(
        `
          DELETE FROM workout_exercises
          WHERE
            id = $1
            AND workout_id = $2
          RETURNING id
        `,
        [
          workoutExerciseId,
          workoutId
        ]
      );

    if (
      result.rows.length === 0
    ) {
      return res.status(404).json({
        message:
          "Workout exercise not found"
      });
    }

    return res.status(204).send();
  } catch (error) {
    console.error(
      "Failed to remove exercise from workout:",
      error
    );

    return res.status(500).json({
      message:
        "Internal server error"
    });
  }
}

export async function updateWorkoutSet(
  req: Request,
  res: Response
) {
  const setId =
    Number(req.params.setId);

  const {
    setNumber,
    reps,
    weight
  } = req.body;

  if (
    !Number.isInteger(setId) ||
    setId <= 0
  ) {
    return res.status(400).json({
      message:
        "Invalid set ID"
    });
  }

  if (
    !Number.isInteger(setNumber) ||
    setNumber <= 0 ||
    !Number.isInteger(reps) ||
    reps <= 0
  ) {
    return res.status(400).json({
      message:
        "Invalid set number or reps"
    });
  }

  if (
    weight !== null &&
    weight !== undefined &&
    (
      typeof weight !== "number" ||
      weight < 0
    )
  ) {
    return res.status(400).json({
      message:
        "Invalid weight"
    });
  }

  try {
    const status =
      await getWorkoutStatusBySetId(
        setId
      );

    if (status === null) {
      return res.status(404).json({
        message:
          "Workout set not found"
      });
    }

    if (status !== "active") {
      return res.status(403).json({
        message:
          "Completed workouts cannot be modified"
      });
    }

    const result =
      await pool.query(
        `
          UPDATE workout_sets
          SET
            set_number = $1,
            reps = $2,
            weight = $3
          WHERE id = $4
          RETURNING
            id,
            workout_exercise_id AS "workoutExerciseId",
            set_number AS "setNumber",
            reps,
            weight
        `,
        [
          setNumber,
          reps,
          weight ?? null,
          setId
        ]
      );

    return res
      .status(200)
      .json(result.rows[0]);
  } catch (error) {
    console.error(
      "Failed to update workout set:",
      error
    );

    return res.status(500).json({
      message:
        "Internal server error"
    });
  }
}

export async function deleteWorkoutSet(
  req: Request,
  res: Response
) {
  const setId =
    Number(req.params.setId);

  if (
    !Number.isInteger(setId) ||
    setId <= 0
  ) {
    return res.status(400).json({
      message:
        "Invalid set ID"
    });
  }

  try {
    const status =
      await getWorkoutStatusBySetId(
        setId
      );

    if (status === null) {
      return res.status(404).json({
        message:
          "Workout set not found"
      });
    }

    if (status !== "active") {
      return res.status(403).json({
        message:
          "Completed workouts cannot be modified"
      });
    }

    await pool.query(
      `
        DELETE FROM workout_sets
        WHERE id = $1
      `,
      [setId]
    );

    return res.status(204).send();
  } catch (error) {
    console.error(
      "Failed to delete workout set:",
      error
    );

    return res.status(500).json({
      message:
        "Internal server error"
    });
  }
}

export async function createWorkoutFromRoutine(
  req: Request,
  res: Response
) {
  const routineId =
    Number(req.params.routineId);

  if (
    !Number.isInteger(routineId) ||
    routineId <= 0
  ) {
    return res.status(400).json({
      message: "Invalid routine ID"
    });
  }

  const client =
    await pool.connect();

  try {
    await client.query("BEGIN");

    const activeWorkoutResult =
      await client.query(
        `
          SELECT id
          FROM workouts
          WHERE status = 'active'
          LIMIT 1
        `
      );

    if (
      activeWorkoutResult.rows.length > 0
    ) {
      await client.query(
        "ROLLBACK"
      );

      return res.status(409).json({
        message:
          "There is already an active workout"
      });
    }

    const routineResult =
      await client.query(
        `
          SELECT id
          FROM routines
          WHERE id = $1
        `,
        [routineId]
      );

    if (
      routineResult.rows.length === 0
    ) {
      await client.query(
        "ROLLBACK"
      );

      return res.status(404).json({
        message:
          "Routine not found"
      });
    }

    const workoutResult =
      await client.query(
        `
          INSERT INTO workouts (
            routine_id,
            status,
            started_at
          )
          VALUES (
            $1,
            'active',
            NOW()
          )
          RETURNING
            id,
            routine_id AS "routineId",
            performed_at AS "performedAt",
            notes,
            status,
            started_at AS "startedAt",
            ended_at AS "endedAt"
        `,
        [routineId]
      );

    const workout =
      workoutResult.rows[0];

    await client.query(
      `
        INSERT INTO workout_exercises (
          workout_id,
          exercise_id
        )
        SELECT
          $1,
          exercise_id
        FROM routine_exercises
        WHERE routine_id = $2
      `,
      [
        workout.id,
        routineId
      ]
    );

    await client.query("COMMIT");

    return res
      .status(201)
      .json(workout);
  } catch (error) {
    await client.query(
      "ROLLBACK"
    );

    console.error(
      "Failed to create workout from routine:",
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

export async function completeWorkout(
  req: Request,
  res: Response
) {
  const workoutId =
    Number(req.params.id);

  if (
    !Number.isInteger(workoutId) ||
    workoutId <= 0
  ) {
    return res.status(400).json({
      message: "Invalid workout ID"
    });
  }

  try {
    const workoutResult =
      await pool.query(
        `
          SELECT
            id,
            status
          FROM workouts
          WHERE id = $1
        `,
        [workoutId]
      );

    if (
      workoutResult.rows.length === 0
    ) {
      return res.status(404).json({
        message:
          "Workout not found"
      });
    }

    if (
      workoutResult.rows[0]
        .status === "completed"
    ) {
      return res.status(400).json({
        message:
          "Workout is already completed"
      });
    }

    const result =
      await pool.query(
        `
          UPDATE workouts
          SET
            status = 'completed',
            ended_at = NOW()
          WHERE id = $1
          RETURNING
            id,
            routine_id AS "routineId",
            performed_at AS "performedAt",
            notes,
            status,
            started_at AS "startedAt",
            ended_at AS "endedAt"
        `,
        [workoutId]
      );

    return res
      .status(200)
      .json(result.rows[0]);
  } catch (error) {
    console.error(
      "Failed to complete workout:",
      error
    );

    return res.status(500).json({
      message:
        "Internal server error"
    });
  }
}