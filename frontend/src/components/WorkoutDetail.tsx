import type { Exercise } from "../types/Exercise";
import type { Workout } from "../types/Workout";
import { useState } from "react";

type WorkoutDetailProps = {
  workout: Workout;
  exercises: Exercise[];
  onAddExercise: (exerciseId: number) => void;
  onAddSet: (
    workoutExerciseId: number,
    setNumber: number,
    reps: number,
    weight: number | null
  ) => void;
};

function WorkoutDetail({
  workout,
  exercises,
  onAddExercise,
  onAddSet
}: WorkoutDetailProps) {

  const [setNumber, setSetNumber] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");

  return (
    <section className="exercise-form">
      <h2>Detalle del entrenamiento</h2>

      <p>
        <strong>Fecha:</strong>{" "}
        {new Date(workout.performedAt).toLocaleString("es-ES")}
      </p>

      <p>
        <strong>Rutina:</strong>{" "}
        {workout.routineId === null
          ? "Entrenamiento libre"
          : `Rutina ${workout.routineId}`}
      </p>

      {workout.notes && (
        <p>
          <strong>Notas:</strong>{" "}
          {workout.notes}
        </p>
      )}

      <h3>Ejercicios del entrenamiento</h3>

      {!workout.exercises ||
      workout.exercises.length === 0 ? (
        <p>No hay ejercicios registrados.</p>
      ) : (
        workout.exercises.map((exercise) => (
          <div
            className="exercise-item"
            key={exercise.id}
          >
            <h4>{exercise.name}</h4>

            <p>{exercise.muscleGroup}</p>

            {exercise.sets.length === 0 ? (
              <p>No hay series registradas.</p>
            ) : (
              <ul>
                {exercise.sets.map((set) => (
                  <li key={set.id}>
                    Serie {set.setNumber}:{" "}
                    {set.reps} repeticiones
                    {set.weight !== null
                      ? ` × ${set.weight} kg`
                      : ""}
                  </li>
                ))}
              </ul>
            )}
            <div className="form-group">
              <label>Número de serie</label>
              <input
                type="number"
                value={setNumber}
                onChange={(event) => setSetNumber(event.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Repeticiones</label>
              <input
                type="number"
                value={reps}
                onChange={(event) => setReps(event.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Peso</label>
              <input
                type="number"
                step="0.01"
                value={weight}
                onChange={(event) => setWeight(event.target.value)}
              />
            </div>

            <button
              className="primary-button"
              onClick={() => {
                if (setNumber === "" || reps === "") {
                  return;
                }

                onAddSet(
                  exercise.id,
                  Number(setNumber),
                  Number(reps),
                  weight === "" ? null : Number(weight)
                );

                setSetNumber("");
                setReps("");
                setWeight("");
              }}
            >
              Añadir serie
            </button>
          </div>
        ))
      )}

      <h3>Añadir ejercicio</h3>

      {exercises.map((exercise) => {
        const alreadyAdded = workout.exercises?.some(
          (workoutExercise) =>
            workoutExercise.exerciseId === exercise.id
        );

        if (alreadyAdded) {
          return null;
        }

        return (
          <div
            className="exercise-item"
            key={exercise.id}
          >
            <strong>{exercise.name}</strong>

            <p>{exercise.muscleGroup}</p>

            <button
              className="primary-button"
              onClick={() => onAddExercise(exercise.id)}
            >
              Añadir
            </button>
          </div>
        );
      })}
    </section>
  );
}

export default WorkoutDetail;