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

describe("Routine API", () => {
  let exerciseIds: number[] = [];

  const createdRoutineIds: number[] = [];

  beforeEach(async () => {
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

  it("should create a routine with exercises", async () => {
    const response = await request(app)
      .post("/api/routines")
      .send({
        name: "Test Push",
        description:
          "Routine created by automated test",
        exerciseIds
      });

    expect(response.status)
      .toBe(201);

    createdRoutineIds.push(
      response.body.id
    );

    expect(response.body.name)
      .toBe("Test Push");

    expect(response.body.description)
      .toBe(
        "Routine created by automated test"
      );

    expect(response.body.exercises)
      .toEqual(exerciseIds);

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
        [response.body.id]
      );

    expect(
      routineResult.rows.length
    ).toBe(1);

    const relationResult =
      await pool.query(
        `
          SELECT exercise_id
          FROM routine_exercises
          WHERE routine_id = $1
          ORDER BY exercise_id
        `,
        [response.body.id]
      );

    const savedExerciseIds =
      relationResult.rows.map(
        (row) =>
          row.exercise_id
      );

    expect(
      savedExerciseIds
    ).toEqual(
      [...exerciseIds].sort(
        (a, b) => a - b
      )
    );
  });

  it("should rollback when an exercise does not exist", async () => {
    const invalidExerciseId =
      999999;

    const response = await request(app)
      .post("/api/routines")
      .send({
        name: "Invalid Test Routine",
        description:
          "This routine should not be created",
        exerciseIds: [
          exerciseIds[0],
          invalidExerciseId
        ]
      });

    expect(response.status)
      .toBe(400);

    const routineResult =
      await pool.query(
        `
          SELECT id
          FROM routines
          WHERE name = $1
        `,
        [
          "Invalid Test Routine"
        ]
      );

    expect(
      routineResult.rows.length
    ).toBe(0);
  });

  it("should update a routine and its exercises", async () => {
    const createResponse =
      await request(app)
        .post("/api/routines")
        .send({
          name: "Original Routine",
          description:
            "Original description",
          exerciseIds: [
            exerciseIds[0]
          ]
        });

    expect(createResponse.status)
      .toBe(201);

    const routineId =
      createResponse.body.id;

    createdRoutineIds.push(
      routineId
    );

    const updateResponse =
      await request(app)
        .patch(
          `/api/routines/${routineId}`
        )
        .send({
          name: "Updated Routine",
          description:
            "Updated description",
          exerciseIds: [
            exerciseIds[1]
          ]
        });

    expect(updateResponse.status)
      .toBe(200);

    expect(
      updateResponse.body.name
    ).toBe("Updated Routine");

    expect(
      updateResponse.body.description
    ).toBe(
      "Updated description"
    );

    const routineResult =
      await pool.query(
        `
          SELECT
            name,
            description
          FROM routines
          WHERE id = $1
        `,
        [routineId]
      );

    expect(
      routineResult.rows[0].name
    ).toBe("Updated Routine");

    expect(
      routineResult.rows[0]
        .description
    ).toBe(
      "Updated description"
    );

    const relationResult =
      await pool.query(
        `
          SELECT exercise_id
          FROM routine_exercises
          WHERE routine_id = $1
        `,
        [routineId]
      );

    expect(
      relationResult.rows
    ).toHaveLength(1);

    expect(
      relationResult.rows[0]
        .exercise_id
    ).toBe(exerciseIds[1]);
  });

  it("should delete a routine and its exercise relations", async () => {
    const createResponse =
      await request(app)
        .post("/api/routines")
        .send({
          name: "Routine To Delete",
          description:
            "This routine will be deleted",
          exerciseIds
        });

    expect(createResponse.status)
      .toBe(201);

    const routineId =
      createResponse.body.id;

    createdRoutineIds.push(
      routineId
    );

    const deleteResponse =
      await request(app)
        .delete(
          `/api/routines/${routineId}`
        );

    expect(deleteResponse.status)
      .toBe(204);

    const routineResult =
      await pool.query(
        `
          SELECT id
          FROM routines
          WHERE id = $1
        `,
        [routineId]
      );

    expect(
      routineResult.rows.length
    ).toBe(0);

    const relationResult =
      await pool.query(
        `
          SELECT *
          FROM routine_exercises
          WHERE routine_id = $1
        `,
        [routineId]
      );

    expect(
      relationResult.rows.length
    ).toBe(0);
  });
});