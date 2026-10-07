import request from "supertest";

import {
  afterAll,
  afterEach,
  beforeEach,
  describe,
  expect,
  it
} from "vitest";

import { app } from "../src/app.js";
import { pool } from "../src/database/db.js";

describe("Workout API", () => {
  let exerciseIds: number[] = [];

  const createdRoutineIds: number[] = [];

  beforeEach(async () => {
    // Queremos empezar cada test sin workouts anteriores.
    await pool.query(
      "DELETE FROM workouts"
    );

    const result = await pool.query(`
      SELECT id
      FROM exercises
      ORDER BY id
      LIMIT 2
    `);

    exerciseIds = result.rows.map(
      (row) => row.id
    );
  });

  afterEach(async () => {
    // Limpia workouts y, gracias a CASCADE,
    // también workout_exercises y workout_sets.
    await pool.query(
      "DELETE FROM workouts"
    );

    for (
      const routineId of
      createdRoutineIds
    ) {
      await pool.query(
        `
          DELETE FROM routines
          WHERE id = $1
        `,
        [routineId]
      );
    }

    createdRoutineIds.length = 0;
  });

  afterAll(async () => {
    await pool.end();
  });

  it("should create an active workout", async () => {
    const response = await request(app)
      .post("/api/workouts")
      .send({
        notes:
          "Workout created by automated test"
      });

    expect(response.status)
      .toBe(201);

    expect(response.body.status)
      .toBe("active");

    expect(response.body.startedAt)
      .not.toBeNull();

    expect(response.body.endedAt)
      .toBeNull();

    const databaseResult =
      await pool.query(
        `
          SELECT
            status,
            started_at,
            ended_at
          FROM workouts
          WHERE id = $1
        `,
        [response.body.id]
      );

    expect(
      databaseResult.rows
    ).toHaveLength(1);

    expect(
      databaseResult.rows[0].status
    ).toBe("active");

    expect(
      databaseResult.rows[0]
        .started_at
    ).not.toBeNull();

    expect(
      databaseResult.rows[0]
        .ended_at
    ).toBeNull();
  });

  it("should not allow two active workouts", async () => {
    const firstResponse =
      await request(app)
        .post("/api/workouts")
        .send({
          notes:
            "First active workout"
        });

    expect(firstResponse.status)
      .toBe(201);

    const secondResponse =
      await request(app)
        .post("/api/workouts")
        .send({
          notes:
            "Second active workout"
        });

    expect(secondResponse.status)
      .toBe(409);

    expect(
      secondResponse.body.message
    ).toBe(
      "There is already an active workout"
    );

    const databaseResult =
      await pool.query(`
        SELECT COUNT(*)::int AS count
        FROM workouts
        WHERE status = 'active'
      `);

    expect(
      databaseResult.rows[0].count
    ).toBe(1);
  });

  it("should create a workout from a routine with its exercises", async () => {
    const routineResponse =
      await request(app)
        .post("/api/routines")
        .send({
          name:
            "Test Workout Routine",
          description:
            "Routine used by workout tests",
          exerciseIds
        });

    expect(routineResponse.status)
      .toBe(201);

    const routineId =
      routineResponse.body.id;

    createdRoutineIds.push(
      routineId
    );

    const workoutResponse =
      await request(app)
        .post(
          `/api/workouts/from-routine/${routineId}`
        );

    expect(workoutResponse.status)
      .toBe(201);

    expect(
      workoutResponse.body.status
    ).toBe("active");

    expect(
      workoutResponse.body.routineId
    ).toBe(routineId);

    const exercisesResult =
      await pool.query(
        `
          SELECT exercise_id
          FROM workout_exercises
          WHERE workout_id = $1
          ORDER BY exercise_id
        `,
        [workoutResponse.body.id]
      );

    const workoutExerciseIds =
      exercisesResult.rows.map(
        (row) =>
          row.exercise_id
      );

    expect(
      workoutExerciseIds
    ).toEqual(
      [...exerciseIds].sort(
        (a, b) => a - b
      )
    );
  });

  it("should complete an active workout", async () => {
    const createResponse =
      await request(app)
        .post("/api/workouts")
        .send({
          notes:
            "Workout to complete"
        });

    expect(createResponse.status)
      .toBe(201);

    const workoutId =
      createResponse.body.id;

    const completeResponse =
      await request(app)
        .patch(
          `/api/workouts/${workoutId}/complete`
        );

    expect(
      completeResponse.status
    ).toBe(200);

    expect(
      completeResponse.body.status
    ).toBe("completed");

    expect(
      completeResponse.body.endedAt
    ).not.toBeNull();

    const databaseResult =
      await pool.query(
        `
          SELECT
            status,
            ended_at
          FROM workouts
          WHERE id = $1
        `,
        [workoutId]
      );

    expect(
      databaseResult.rows[0].status
    ).toBe("completed");

    expect(
      databaseResult.rows[0]
        .ended_at
    ).not.toBeNull();
  });

  it("should not add exercises to a completed workout", async () => {
    const createResponse =
      await request(app)
        .post("/api/workouts")
        .send({});

    expect(createResponse.status)
      .toBe(201);

    const workoutId =
      createResponse.body.id;

    const completeResponse =
      await request(app)
        .patch(
          `/api/workouts/${workoutId}/complete`
        );

    expect(
      completeResponse.status
    ).toBe(200);

    const addExerciseResponse =
      await request(app)
        .post(
          `/api/workouts/${workoutId}/exercises`
        )
        .send({
          exerciseId:
            exerciseIds[0]
        });

    expect(
      addExerciseResponse.status
    ).toBe(403);

    expect(
      addExerciseResponse.body
        .message
    ).toBe(
      "Completed workouts cannot be modified"
    );

    const relationResult =
      await pool.query(
        `
          SELECT id
          FROM workout_exercises
          WHERE workout_id = $1
        `,
        [workoutId]
      );

    expect(
      relationResult.rows
    ).toHaveLength(0);
  });
});