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

describe("Progress API", () => {
  let exerciseId: number;

  const createdWorkoutIds: number[] = [];

  beforeEach(async () => {
    const exerciseResult =
      await pool.query(
        `
          INSERT INTO exercises (
            name,
            muscle_group,
            description
          )
          VALUES ($1, $2, $3)
          RETURNING id
        `,
        [
          "Progress Test Exercise",
          "Pecho",
          "Exercise used by progress tests"
        ]
      );

    exerciseId =
      exerciseResult.rows[0].id;
  });

  afterEach(async () => {
    for (
      const workoutId of
      createdWorkoutIds
    ) {
      await pool.query(
        `
          DELETE FROM workouts
          WHERE id = $1
        `,
        [workoutId]
      );
    }

    createdWorkoutIds.length = 0;

    await pool.query(
      `
        DELETE FROM exercises
        WHERE id = $1
      `,
      [exerciseId]
    );
  });

  afterAll(async () => {
    await pool.end();
  });

  async function createCompletedWorkout(
    performedAt: string
  ): Promise<number> {
    const result = await pool.query(
      `
        INSERT INTO workouts (
          performed_at,
          status,
          started_at,
          ended_at
        )
        VALUES (
          $1,
          'completed',
          $1,
          $1
        )
        RETURNING id
      `,
      [performedAt]
    );

    const workoutId =
      result.rows[0].id;

    createdWorkoutIds.push(
      workoutId
    );

    return workoutId;
  }

  async function addExerciseToWorkout(
    workoutId: number
  ): Promise<number> {
    const result = await pool.query(
      `
        INSERT INTO workout_exercises (
          workout_id,
          exercise_id
        )
        VALUES ($1, $2)
        RETURNING id
      `,
      [
        workoutId,
        exerciseId
      ]
    );

    return result.rows[0].id;
  }

  async function addSet(
    workoutExerciseId: number,
    setNumber: number,
    reps: number,
    weight: number
  ) {
    await pool.query(
      `
        INSERT INTO workout_sets (
          workout_exercise_id,
          set_number,
          reps,
          weight
        )
        VALUES ($1, $2, $3, $4)
      `,
      [
        workoutExerciseId,
        setNumber,
        reps,
        weight
      ]
    );
  }

  it("should reject an invalid exercise ID", async () => {
    const response =
      await request(app)
        .get(
          "/api/progress/exercises/0"
        );

    expect(response.status)
      .toBe(400);

    expect(response.body.message)
      .toBe(
        "Invalid exercise ID"
      );
  });

  it("should return 404 when the exercise does not exist", async () => {
    const response =
      await request(app)
        .get(
          "/api/progress/exercises/999999"
        );

    expect(response.status)
      .toBe(404);

    expect(response.body.message)
      .toBe(
        "Exercise not found"
      );
  });

  it("should return empty progress for an exercise without workouts", async () => {
    const response =
      await request(app)
        .get(
          `/api/progress/exercises/${exerciseId}`
        );

    expect(response.status)
      .toBe(200);

    expect(
      response.body.exercise.id
    ).toBe(exerciseId);

    expect(
      response.body.exercise.name
    ).toBe(
      "Progress Test Exercise"
    );

    expect(
      response.body.summary.workoutCount
    ).toBe(0);

    expect(
      response.body.summary.setCount
    ).toBe(0);

    expect(
      response.body.summary.bestWeight
    ).toBeNull();

    expect(
      response.body.summary.bestReps
    ).toBeNull();

    expect(
      response.body.history
    ).toEqual([]);
  });

  it("should calculate workout and set counts correctly", async () => {
    const firstWorkoutId =
      await createCompletedWorkout(
        "2026-10-01T10:00:00Z"
      );

    const secondWorkoutId =
      await createCompletedWorkout(
        "2026-10-03T10:00:00Z"
      );

    const firstWorkoutExerciseId =
      await addExerciseToWorkout(
        firstWorkoutId
      );

    const secondWorkoutExerciseId =
      await addExerciseToWorkout(
        secondWorkoutId
      );

    await addSet(
      firstWorkoutExerciseId,
      1,
      10,
      60
    );

    await addSet(
      firstWorkoutExerciseId,
      2,
      8,
      70
    );

    await addSet(
      secondWorkoutExerciseId,
      1,
      6,
      80
    );

    const response =
      await request(app)
        .get(
          `/api/progress/exercises/${exerciseId}`
        );

    expect(response.status)
      .toBe(200);

    expect(
      response.body.summary.workoutCount
    ).toBe(2);

    expect(
      response.body.summary.setCount
    ).toBe(3);
  });

  it("should calculate best weight and best reps correctly", async () => {
    const workoutId =
      await createCompletedWorkout(
        "2026-10-04T10:00:00Z"
      );

    const workoutExerciseId =
      await addExerciseToWorkout(
        workoutId
      );

    await addSet(
      workoutExerciseId,
      1,
      12,
      60
    );

    await addSet(
      workoutExerciseId,
      2,
      8,
      90
    );

    await addSet(
      workoutExerciseId,
      3,
      5,
      100
    );

    const response =
      await request(app)
        .get(
          `/api/progress/exercises/${exerciseId}`
        );

    expect(response.status)
      .toBe(200);

    expect(
      Number(
        response.body.summary
          .bestWeight
      )
    ).toBe(100);

    expect(
      response.body.summary
        .bestReps
    ).toBe(12);
  });

  it("should return history ordered by newest workout and set number", async () => {
    const olderWorkoutId =
      await createCompletedWorkout(
        "2026-10-01T10:00:00Z"
      );

    const newerWorkoutId =
      await createCompletedWorkout(
        "2026-10-05T10:00:00Z"
      );

    const olderWorkoutExerciseId =
      await addExerciseToWorkout(
        olderWorkoutId
      );

    const newerWorkoutExerciseId =
      await addExerciseToWorkout(
        newerWorkoutId
      );

    await addSet(
      olderWorkoutExerciseId,
      1,
      10,
      60
    );

    await addSet(
      newerWorkoutExerciseId,
      1,
      8,
      80
    );

    await addSet(
      newerWorkoutExerciseId,
      2,
      6,
      90
    );

    const response =
      await request(app)
        .get(
          `/api/progress/exercises/${exerciseId}`
        );

    expect(response.status)
      .toBe(200);

    expect(
      response.body.history
    ).toHaveLength(3);

    expect(
      response.body.history[0]
        .workoutId
    ).toBe(newerWorkoutId);

    expect(
      response.body.history[0]
        .setNumber
    ).toBe(1);

    expect(
      response.body.history[1]
        .workoutId
    ).toBe(newerWorkoutId);

    expect(
      response.body.history[1]
        .setNumber
    ).toBe(2);

    expect(
      response.body.history[2]
        .workoutId
    ).toBe(olderWorkoutId);
  });
});