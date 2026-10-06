import type { Request, Response } from "express";

import { pool } from "../database/db.js";
import { isValidMuscleGroup } from "../constants/muscleGroups.js";

export async function getExercises(
  req: Request,
  res: Response
) {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        muscle_group AS "muscleGroup",
        description,
        is_system AS "isSystem"
      FROM exercises
      ORDER BY
        is_system DESC,
        name ASC
    `);

    return res.status(200).json(
      result.rows
    );
  } catch (error) {
    console.error(
      "Failed to get exercises:",
      error
    );

    return res.status(500).json({
      message: "Internal server error"
    });
  }
}

export async function getExerciseById(
  req: Request,
  res: Response
) {
  const id = Number(req.params.id);

  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {
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
          description,
          is_system AS "isSystem"
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

    return res.status(200).json(
      result.rows[0]
    );
  } catch (error) {
    console.error(
      "Failed to get exercise:",
      error
    );

    return res.status(500).json({
      message: "Internal server error"
    });
  }
}

export async function createExercise(
  req: Request,
  res: Response
) {
  const {
    name,
    muscleGroup,
    description
  } = req.body;

  if (
    typeof name !== "string" ||
    typeof muscleGroup !== "string" ||
    name.trim() === "" ||
    muscleGroup.trim() === ""
  ) {
    return res.status(400).json({
      message:
        "Name and muscle group must be non-empty strings"
    });
  }

  const normalizedMuscleGroup =
    muscleGroup.trim();

  if (
    !isValidMuscleGroup(
      normalizedMuscleGroup
    )
  ) {
    return res.status(400).json({
      message: "Invalid muscle group"
    });
  }

  if (
    description !== undefined &&
    description !== null &&
    typeof description !== "string"
  ) {
    return res.status(400).json({
      message:
        "Description must be a string"
    });
  }

  try {
    const result = await pool.query(
      `
        INSERT INTO exercises (
          name,
          muscle_group,
          description
        )
        VALUES ($1, $2, $3)
        RETURNING
          id,
          name,
          muscle_group AS "muscleGroup",
          description,
          is_system AS "isSystem"
      `,
      [
        name.trim(),
        normalizedMuscleGroup,
        typeof description === "string" &&
        description.trim() !== ""
          ? description.trim()
          : null
      ]
    );

    return res.status(201).json(
      result.rows[0]
    );
  } catch (error) {
    console.error(
      "Failed to create exercise:",
      error
    );

    return res.status(500).json({
      message: "Internal server error"
    });
  }
}

export async function updateExercise(
  req: Request,
  res: Response
) {
  const id = Number(req.params.id);

  const {
    name,
    muscleGroup,
    description
  } = req.body;

  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {
    return res.status(400).json({
      message: "Invalid exercise ID"
    });
  }

  if (
    typeof name !== "string" ||
    typeof muscleGroup !== "string" ||
    name.trim() === "" ||
    muscleGroup.trim() === ""
  ) {
    return res.status(400).json({
      message:
        "Name and muscle group must be non-empty strings"
    });
  }

  const normalizedMuscleGroup =
    muscleGroup.trim();

  if (
    !isValidMuscleGroup(
      normalizedMuscleGroup
    )
  ) {
    return res.status(400).json({
      message: "Invalid muscle group"
    });
  }

  if (
    description !== undefined &&
    description !== null &&
    typeof description !== "string"
  ) {
    return res.status(400).json({
      message:
        "Description must be a string"
    });
  }

  try {
    const exerciseResult =
      await pool.query(
        `
          SELECT is_system
          FROM exercises
          WHERE id = $1
        `,
        [id]
      );

    if (
      exerciseResult.rows.length === 0
    ) {
      return res.status(404).json({
        message: "Exercise not found"
      });
    }

    if (
      exerciseResult.rows[0].is_system
    ) {
      return res.status(403).json({
        message:
          "System exercises cannot be edited"
      });
    }

    const result = await pool.query(
      `
        UPDATE exercises
        SET
          name = $1,
          muscle_group = $2,
          description = $3
        WHERE id = $4
        RETURNING
          id,
          name,
          muscle_group AS "muscleGroup",
          description,
          is_system AS "isSystem"
      `,
      [
        name.trim(),
        normalizedMuscleGroup,
        typeof description === "string" &&
        description.trim() !== ""
          ? description.trim()
          : null,
        id
      ]
    );

    return res.status(200).json(
      result.rows[0]
    );
  } catch (error) {
    console.error(
      "Failed to update exercise:",
      error
    );

    return res.status(500).json({
      message: "Internal server error"
    });
  }
}

export async function deleteExercise(
  req: Request,
  res: Response
) {
  const id = Number(req.params.id);

  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {
    return res.status(400).json({
      message: "Invalid exercise ID"
    });
  }

  try {
    const exerciseResult =
      await pool.query(
        `
          SELECT is_system
          FROM exercises
          WHERE id = $1
        `,
        [id]
      );

    if (
      exerciseResult.rows.length === 0
    ) {
      return res.status(404).json({
        message: "Exercise not found"
      });
    }

    if (
      exerciseResult.rows[0].is_system
    ) {
      return res.status(403).json({
        message:
          "System exercises cannot be deleted"
      });
    }

    await pool.query(
      `
        DELETE FROM exercises
        WHERE id = $1
      `,
      [id]
    );

    return res.status(204).send();
  } catch (error) {
    console.error(
      "Failed to delete exercise:",
      error
    );

    return res.status(500).json({
      message: "Internal server error"
    });
  }
}