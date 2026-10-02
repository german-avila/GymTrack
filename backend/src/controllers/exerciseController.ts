import type { Request, Response } from "express";
import { pool } from "../database/db.js";

export async function getExercises(req: Request, res: Response) {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        muscle_group AS "muscleGroup",
        description
      FROM exercises
      ORDER BY id
    `);

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Failed to get exercises:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
}

export async function getExerciseById(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "Invalid exercise ID"
    });
  }

  try {
    const result = await pool.query(
      `
        SELECT
          id,
          name,
          muscle_group AS "muscleGroup",
          description
        FROM exercises
        WHERE id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Exercise not found"
      });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Failed to get exercise:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
}

export async function createExercise(req: Request, res: Response) {
  const { name, muscleGroup, description } = req.body;

  if (
    typeof name !== "string" ||
    typeof muscleGroup !== "string" ||
    name.trim() === "" ||
    muscleGroup.trim() === ""
  ) {
    return res.status(400).json({
      message: "Name and muscle group must be non-empty strings"
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
        INSERT INTO exercises (name, muscle_group, description)
        VALUES ($1, $2, $3)
        RETURNING
          id,
          name,
          muscle_group AS "muscleGroup",
          description
      `,
      [
        name.trim(),
        muscleGroup.trim(),
        description?.trim() ?? null
      ]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Failed to create exercise:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
}