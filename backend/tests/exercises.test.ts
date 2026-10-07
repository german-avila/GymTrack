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

describe("Exercise API", () => {
  const createdExerciseIds: number[] = [];

  let systemExerciseId: number;

  beforeEach(async () => {
    const result = await pool.query(`
      SELECT id
      FROM exercises
      WHERE is_system = true
      ORDER BY id
      LIMIT 1
    `);

    systemExerciseId =
      result.rows[0].id;
  });

  afterEach(async () => {
    for (
      const exerciseId of
      createdExerciseIds
    ) {
      await pool.query(
        `
          DELETE FROM exercises
          WHERE id = $1
        `,
        [exerciseId]
      );
    }

    createdExerciseIds.length = 0;
  });

  afterAll(async () => {
    await pool.end();
  });

  it("should create a custom exercise", async () => {
    const response = await request(app)
      .post("/api/exercises")
      .send({
        name: "Test Curl",
        muscleGroup: "Bíceps",
        description:
          "Exercise created by automated test"
      });

    expect(response.status)
      .toBe(201);

    createdExerciseIds.push(
      response.body.id
    );

    expect(response.body.name)
      .toBe("Test Curl");

    expect(
      response.body.muscleGroup
    ).toBe("Bíceps");

    expect(
      response.body.description
    ).toBe(
      "Exercise created by automated test"
    );

    expect(
      response.body.isSystem
    ).toBe(false);

    const databaseResult =
      await pool.query(
        `
          SELECT
            name,
            muscle_group,
            description,
            is_system
          FROM exercises
          WHERE id = $1
        `,
        [response.body.id]
      );

    expect(
      databaseResult.rows
    ).toHaveLength(1);

    expect(
      databaseResult.rows[0].name
    ).toBe("Test Curl");

    expect(
      databaseResult.rows[0]
        .muscle_group
    ).toBe("Bíceps");

    expect(
      databaseResult.rows[0]
        .is_system
    ).toBe(false);
  });

  it("should update a custom exercise", async () => {
    const createResponse =
      await request(app)
        .post("/api/exercises")
        .send({
          name: "Original Exercise",
          muscleGroup: "Pecho",
          description:
            "Original description"
        });

    expect(createResponse.status)
      .toBe(201);

    const exerciseId =
      createResponse.body.id;

    createdExerciseIds.push(
      exerciseId
    );

    const updateResponse =
      await request(app)
        .patch(
          `/api/exercises/${exerciseId}`
        )
        .send({
          name: "Updated Exercise",
          muscleGroup: "Hombros",
          description:
            "Updated description"
        });

    expect(updateResponse.status)
      .toBe(200);

    expect(
      updateResponse.body.name
    ).toBe("Updated Exercise");

    expect(
      updateResponse.body.muscleGroup
    ).toBe("Hombros");

    expect(
      updateResponse.body.description
    ).toBe(
      "Updated description"
    );

    const databaseResult =
      await pool.query(
        `
          SELECT
            name,
            muscle_group,
            description
          FROM exercises
          WHERE id = $1
        `,
        [exerciseId]
      );

    expect(
      databaseResult.rows[0].name
    ).toBe("Updated Exercise");

    expect(
      databaseResult.rows[0]
        .muscle_group
    ).toBe("Hombros");

    expect(
      databaseResult.rows[0]
        .description
    ).toBe(
      "Updated description"
    );
  });

  it("should delete a custom exercise", async () => {
    const createResponse =
      await request(app)
        .post("/api/exercises")
        .send({
          name: "Exercise To Delete",
          muscleGroup: "Tríceps",
          description:
            "This exercise will be deleted"
        });

    expect(createResponse.status)
      .toBe(201);

    const exerciseId =
      createResponse.body.id;

    createdExerciseIds.push(
      exerciseId
    );

    const deleteResponse =
      await request(app)
        .delete(
          `/api/exercises/${exerciseId}`
        );

    expect(deleteResponse.status)
      .toBe(204);

    const databaseResult =
      await pool.query(
        `
          SELECT id
          FROM exercises
          WHERE id = $1
        `,
        [exerciseId]
      );

    expect(
      databaseResult.rows.length
    ).toBe(0);
  });

  it("should not update a system exercise", async () => {
    const response = await request(app)
      .patch(
        `/api/exercises/${systemExerciseId}`
      )
      .send({
        name: "Modified System Exercise",
        muscleGroup: "Pecho",
        description:
          "This change should be rejected"
      });

    expect(response.status)
      .toBe(403);

    expect(response.body.message)
      .toBe(
        "System exercises cannot be edited"
      );
  });

  it("should not delete a system exercise", async () => {
    const response = await request(app)
      .delete(
        `/api/exercises/${systemExerciseId}`
      );

    expect(response.status)
      .toBe(403);

    expect(response.body.message)
      .toBe(
        "System exercises cannot be deleted"
      );

    const databaseResult =
      await pool.query(
        `
          SELECT id
          FROM exercises
          WHERE id = $1
        `,
        [systemExerciseId]
      );

    expect(
      databaseResult.rows.length
    ).toBe(1);
  });
});