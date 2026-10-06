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
    setEditSetNumber(String(currentSetNumber));
    setEditReps(String(currentReps));
    setEditWeight(currentWeight ?? "");
  }

  function cancelEditingSet() {
    setEditingSetId(null);
    setEditSetNumber("");
    setEditReps("");
    setEditWeight("");
  }

  return (
    <section className="workout-detail">
      <div className="workout-detail-header">
        <div>
          <span className="workout-date-label">
            Detalle del entrenamiento
          </span>

          <h2>
            {new Date(
              workout.performedAt
            ).toLocaleDateString("es-ES")}
          </h2>
        </div>

        <span className="workout-badge">
          {workout.routineId === null
            ? "Entrenamiento libre"
            : `Rutina ${workout.routineId}`}
        </span>
      </div>

      {workout.notes && (
        <p className="workout-detail-notes">
          {workout.notes}
        </p>
      )}

      <h3>Ejercicios</h3>

      {!workout.exercises ||
      workout.exercises.length === 0 ? (
        <div className="empty-state">
          <p>No hay ejercicios registrados.</p>
        </div>
      ) : (
        <div className="workout-exercise-list">
          {workout.exercises.map((exercise) => (
            <article
              className="workout-exercise-card"
              key={exercise.id}
            >
              <div className="workout-exercise-header">
                <div>
                  <h4>{exercise.name}</h4>
                  <p>{exercise.muscleGroup}</p>
                </div>

                <button
                  className="danger-button"
                  onClick={() =>
                    onRemoveExercise(exercise.id)
                  }
                >
                  Quitar ejercicio
                </button>
              </div>

              <div className="workout-sets">
                <h5>Series</h5>

                {exercise.sets.length === 0 ? (
                  <p className="muted-text">
                    No hay series registradas.
                  </p>
                ) : (
                  exercise.sets.map((set) => (
                    <div
                      className="workout-set-row"
                      key={set.id}
                    >
                      {editingSetId === set.id ? (
                        <div className="workout-set-edit">
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
                            placeholder="Reps"
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

                          <div className="workout-set-actions">
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
                        </div>
                      ) : (
                        <>
                          <div className="workout-set-info">
                            <span className="set-number">
                              Serie {set.setNumber}
                            </span>

                            <strong>
                              {set.reps} reps
                              {set.weight !== null
                                ? ` · ${set.weight} kg`
                                : ""}
                            </strong>
                          </div>

                          <div className="workout-set-actions">
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
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="add-set-panel">
                <h5>Añadir serie</h5>

                <div className="add-set-grid">
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
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="add-exercise-panel">
        <h3>Añadir ejercicio</h3>

        {exercises.filter(
          (exercise) =>
            !workout.exercises?.some(
              (workoutExercise) =>
                workoutExercise.exerciseId ===
                exercise.id
            )
        ).length === 0 ? (
          <p className="muted-text">
            No hay más ejercicios disponibles para añadir.
          </p>
        ) : (
          <div className="available-exercises">
            {exercises
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
                  className="available-exercise"
                  key={exercise.id}
                >
                  <div>
                    <strong>{exercise.name}</strong>
                    <p>{exercise.muscleGroup}</p>
                  </div>

                  <button
                    className="primary-button"
                    onClick={() =>
                      onAddExercise(exercise.id)
                    }
                  >
                    Añadir
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default WorkoutDetail;