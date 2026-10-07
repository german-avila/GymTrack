import {
  afterAll,
  describe,
  expect,
  it
} from "vitest";

import { pool } from "../src/database/db.js";

describe("Test database", () => {
  it("should use the test database", async () => {
    const result = await pool.query(
      "SELECT current_database() AS database"
    );

    expect(
      result.rows[0].database
    ).toBe("gymtrack_test");
  });

  afterAll(async () => {
    await pool.end();
  });
});