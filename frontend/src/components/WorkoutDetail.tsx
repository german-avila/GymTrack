import { useState } from "react";

import type { Exercise } from "../types/Exercise";
import type { Workout } from "../types/Workout";

type WorkoutDetailProps = {
  workout: Workout;
  exercises: Exercise[];

  onAddExercise: (exerciseId: number) => void;

  onRemoveExercise: (
    workoutExerciseId: number
  ) => void;

  onAddSet: (
    workoutExerciseId: number,
    setNumber: number,
    reps: number,
    weight: number | null
  ) => void;

  onUpdateSet: (
    setId: number,
    setNumber: number,
    reps: number,
    weight: number | null
  ) => void;

  onDeleteSet: (setId: number) => void;
};

function WorkoutDetail({
  workout,
  exercises,
  onAddExercise,
  onRemoveExercise,
  onAddSet,
  onUpdateSet,
  onDeleteSet
}: WorkoutDetailProps) {
  const [setNumber, setSetNumber] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");

  const [editingSetId, setEditingSetId] =
    useState<number | null>(null);

  const [editSetNumber, setEditSetNumber] = useState("");
  const [editReps, setEditReps] = useState("");
  const [editWeight, setEditWeight] = useState("");

  function startEditingSet(
    id: number,
    currentSetNumber: number,
    currentReps: number,
    currentWeight: string | null
  ) {
    setEditingSetId(id);

    setEditSetNumber(
      String(currentSetNumber)
    );

    setEditReps(
      String(currentReps)
    );

    setEditWeight(
      currentWeight ?? ""
    );
  }

  function cancelEditingSet() {
    setEditingSetId(null);
    setEditSetNumber("");
    setEditReps("");
    setEditWeight("");
  }

  return (
    <section className="exercise-form">
      <h2>Detalle del entrenamiento</h2>

      <p>
        <strong>Fecha:</strong>{" "}
        {new Date(
          workout.performedAt
        ).toLocaleString("es-ES")}
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
                    {editingSetId === set.id ? (
                      <div>
                        <input
                          type="number"
                          value={editSetNumber}
                          onChange={(event) =>
                            setEditSetNumber(
                              event.target.value
                            )
                          }
                          placeholder="Serie"
                        />

                        <input
                          type="number"
                          value={editReps}
                          onChange={(event) =>
                            setEditReps(
                              event.target.value
                            )
                          }
                          placeholder="Repeticiones"
                        />

                        <input
                          type="number"
                          step="0.01"
                          value={editWeight}
                          onChange={(event) =>
                            setEditWeight(
                              event.target.value
                            )
                          }
                          placeholder="Peso"
                        />

                        <button
                          className="primary-button"
                          onClick={() => {
                            if (
                              editSetNumber === "" ||
                              editReps === ""
                            ) {
                              return;
                            }

                            onUpdateSet(
                              set.id,
                              Number(editSetNumber),
                              Number(editReps),
                              editWeight === ""
                                ? null
                                : Number(editWeight)
                            );

                            cancelEditingSet();
                          }}
                        >
                          Guardar
                        </button>

                        <button
                          className="secondary-button"
                          onClick={cancelEditingSet}
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <>
                        Serie {set.setNumber}:{" "}
                        {set.reps} repeticiones
                        {set.weight !== null
                          ? ` × ${set.weight} kg`
                          : ""}

                        {" "}

                        <button
                          className="secondary-button"
                          onClick={() =>
                            startEditingSet(
                              set.id,
                              set.setNumber,
                              set.reps,
                              set.weight
                            )
                          }
                        >
                          Editar
                        </button>

                        <button
                          className="danger-button"
                          onClick={() =>
                            onDeleteSet(set.id)
                          }
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}

            <h4>Añadir serie</h4>

            <div className="form-group">
              <label>Número de serie</label>

              <input
                type="number"
                value={setNumber}
                onChange={(event) =>
                  setSetNumber(event.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Repeticiones</label>

              <input
                type="number"
                value={reps}
                onChange={(event) =>
                  setReps(event.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Peso</label>

              <input
                type="number"
                step="0.01"
                value={weight}
                onChange={(event) =>
                  setWeight(event.target.value)
                }
              />
            </div>

            <button
              className="primary-button"
              onClick={() => {
                if (
                  setNumber === "" ||
                  reps === ""
                ) {
                  return;
                }

                onAddSet(
                  exercise.id,
                  Number(setNumber),
                  Number(reps),
                  weight === ""
                    ? null
                    : Number(weight)
                );

                setSetNumber("");
                setReps("");
                setWeight("");
              }}
            >
              Añadir serie
            </button>

            <button
              className="danger-button"
              onClick={() =>
                onRemoveExercise(exercise.id)
              }
            >
              Quitar ejercicio
            </button>
          </div>
        ))
      )}

      <h3>Añadir ejercicio</h3>

      {exercises.filter(
        (exercise) =>
          !workout.exercises?.some(
            (workoutExercise) =>
              workoutExercise.exerciseId ===
              exercise.id
          )
      ).length === 0 ? (
        <p>
          No hay más ejercicios disponibles para añadir.
        </p>
      ) : (
        exercises
          .filter(
            (exercise) =>
              !workout.exercises?.some(
                (workoutExercise) =>
                  workoutExercise.exerciseId ===
                  exercise.id
              )
          )
          .map((exercise) => (
            <div
              className="exercise-item"
              key={exercise.id}
            >
              <strong>{exercise.name}</strong>

              <p>{exercise.muscleGroup}</p>

              <button
                className="primary-button"
                onClick={() =>
                  onAddExercise(exercise.id)
                }
              >
                Añadir
              </button>
            </div>
          ))
      )}
    </section>
  );
}

export default WorkoutDetail;