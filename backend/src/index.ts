import express from "express";
import type { Exercise } from "./models/Exercise.js";

const app = express();
app.use(express.json());
const port = 3000;

const exercises: Exercise[] = [
  {
    id: 1,
    name: "Bench Press",
    muscleGroup: "Chest",
    description: "Barbell chest exercise"
  },
  {
    id: 2,
    name: "Squat",
    muscleGroup: "Legs",
    description: "Barbell lower body exercise"
  }
];

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "GymTrack API is running correctly"
  });
});

app.get("/api/exercises", (req, res) => {
  res.status(200).json(exercises);
});

app.get("/api/exercises/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "Invalid exercise ID"
    });
  }

  const exercise = exercises.find((exercise) => exercise.id === id);

  if (!exercise) {
    return res.status(404).json({
      message: "Exercise not found"
    });
  }

  return res.status(200).json(exercise);
});

app.post("/api/exercises", (req, res) => {
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

  const newExercise: Exercise = {
    id: exercises.length + 1,
    name: name.trim(),
    muscleGroup: muscleGroup.trim(),
    ...(description !== undefined && {
      description: description.trim()
    })
  };

  exercises.push(newExercise);

  return res.status(201).json(newExercise);
});

app.listen(port, () => {
  console.log(`GymTrack backend running on port ${port}`);
});