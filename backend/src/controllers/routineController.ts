import type { Request, Response } from "express";
import { pool } from "../database/db.js";

export async function getRoutines(req: Request, res: Response) {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        description
      FROM routines
      ORDER BY id
    `);

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Failed to get routines:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
}

export async function deleteRoutine(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "Invalid routine ID"
    });
  }

  try {
    const result = await pool.query(
      `
        DELETE FROM routines
        WHERE id = $1
        RETURNING id
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Routine not found"
      });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("Failed to delete routine:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
}

export async function updateRoutine(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { name, description } = req.body;

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "Invalid routine ID"
    });
  }

  if (typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({
      message: "Name must be a non-empty string"
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
        description?.trim() ?? null,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Routine not found"
      });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Failed to update routine:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
}

export async function getRoutineById(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "Invalid routine ID"
    });
  }

  try {
    const result = await pool.query(
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

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Routine not found"
      });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Failed to get routine:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
}

export async function createRoutine(req: Request, res: Response) {
  const { name, description } = req.body;

  if (typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({
      message: "Name must be a non-empty string"
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
        INSERT INTO routines (name, description)
        VALUES ($1, $2)
        RETURNING
          id,
          name,
          description
      `,
      [
        name.trim(),
        description?.trim() ?? null
      ]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Failed to create routine:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
}