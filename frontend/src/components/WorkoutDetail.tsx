import {
  useEffect,
  useState
} from "react";

import ConfirmModal from "./ConfirmModal";
import ExercisePicker from "./ExercisePicker";
import PreviousExercisePerformance
  from "./PreviousExercisePerformance";
import ExercisePRStatus
  from "./ExercisePRStatus";

import type { Exercise } from "../types/Exercise";
import type {
  Workout,
  WorkoutExercise
} from "../types/Workout";
import type { Routine } from "../types/Routine";

type WorkoutDetailProps = {
  workout: Workout;
  exercises: Exercise[];
  routines: Routine[];

  onAddExercise: (
    exerciseId: number
  ) => void;

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

  onDeleteSet: (
    setId: number
  ) => void;

  onCompleteWorkout: () => void;
};

type NewSetForm = {
  reps: string;
  weight: string;
};

type EditingSetForm = {
  setId: number;
  setNumber: number;
  reps: string;
  weight: string;
};

function WorkoutDetail({
  workout,
  exercises,
  routines,
  onAddExercise,
  onRemoveExercise,
  onAddSet,
  onUpdateSet,
  onDeleteSet,
  onCompleteWorkout
}: WorkoutDetailProps) {
  const [
    newSetForms,
    setNewSetForms
  ] = useState<
    Record<number, NewSetForm>
  >({});

  const [
    editingSet,
    setEditingSet
  ] = useState<EditingSetForm | null>(
    null
  );

  const [
    exerciseToDelete,
    setExerciseToDelete
  ] = useState<WorkoutExercise | null>(
    null
  );

  const [
    setToDelete,
    setSetToDelete
  ] = useState<number | null>(null);

  const [
    showCompleteConfirmation,
    setShowCompleteConfirmation
  ] = useState(false);

  const [
    elapsedSeconds,
    setElapsedSeconds
  ] = useState(0);

  const routine = routines.find(
    (routine) =>
      routine.id === workout.routineId
  );

  const workoutExercises =
    workout.exercises ?? [];

  const isActive =
    workout.status === "active";

  const performedAt =
    new Date(
      workout.performedAt
    ).toLocaleString(
      "es-ES",
      {
        dateStyle: "medium",
        timeStyle: "short"
      }
    );

  useEffect(() => {
    if (
      !isActive ||
      !workout.startedAt
    ) {
      return;
    }

    function updateElapsedTime() {
      if (!workout.startedAt) {
        return;
      }

      const startedAt =
        new Date(
          workout.startedAt
        ).getTime();

      const now =
        Date.now();

      const difference =
        Math.max(
          0,
          Math.floor(
            (now - startedAt) /
              1000
          )
        );

      setElapsedSeconds(
        difference
      );
    }

    updateElapsedTime();

    const interval =
      window.setInterval(
        updateElapsedTime,
        1000
      );

    return () => {
      window.clearInterval(
        interval
      );
    };
  }, [
    isActive,
    workout.startedAt
  ]);

  function formatDuration(
    totalSeconds: number
  ) {
    const hours =
      Math.floor(
        totalSeconds / 3600
      );

    const minutes =
      Math.floor(
        (totalSeconds % 3600) /
          60
      );

    const seconds =
      totalSeconds % 60;

    const formattedMinutes =
      String(minutes).padStart(
        2,
        "0"
      );

    const formattedSeconds =
      String(seconds).padStart(
        2,
        "0"
      );

    if (hours > 0) {
      return `${String(hours).padStart(
        2,
        "0"
      )}:${formattedMinutes}:${formattedSeconds}`;
    }

    return `${formattedMinutes}:${formattedSeconds}`;
  }

  function getWorkoutDurationSeconds() {
    if (isActive) {
      return elapsedSeconds;
    }

    if (
      !workout.startedAt ||
      !workout.endedAt
    ) {
      return null;
    }

    const startedAt =
      new Date(
        workout.startedAt
      ).getTime();

    const endedAt =
      new Date(
        workout.endedAt
      ).getTime();

    return Math.max(
      0,
      Math.floor(
        (endedAt - startedAt) /
          1000
      )
    );
  }

  function calculateExerciseVolume(
    workoutExercise: WorkoutExercise
  ) {
    return workoutExercise.sets.reduce(
      (total, set) => {
        if (set.weight === null) {
          return total;
        }

        const weight =
          Number(set.weight);

        if (Number.isNaN(weight)) {
          return total;
        }

        return (
          total +
          weight * set.reps
        );
      },
      0
    );
  }

  const totalVolume =
    workoutExercises.reduce(
      (total, workoutExercise) =>
        total +
        calculateExerciseVolume(
          workoutExercise
        ),
      0
    );

  const totalSets =
    workoutExercises.reduce(
      (total, workoutExercise) =>
        total +
        workoutExercise.sets.length,
      0
    );

  const workoutDuration =
    getWorkoutDurationSeconds();

  function formatVolume(
    volume: number
  ) {
    return new Intl.NumberFormat(
      "es-ES",
      {
        maximumFractionDigits: 1
      }
    ).format(volume);
  }

  function getNewSetForm(
    workoutExerciseId: number
  ): NewSetForm {
    return (
      newSetForms[
        workoutExerciseId
      ] ?? {
        reps: "",
        weight: ""
      }
    );
  }

  function updateNewSetForm(
    workoutExerciseId: number,
    field: keyof NewSetForm,
    value: string
  ) {
    setNewSetForms(
      (currentForms) => ({
        ...currentForms,

        [workoutExerciseId]: {
          ...getNewSetForm(
            workoutExerciseId
          ),
          [field]: value
        }
      })
    );
  }

  function handleAddSet(
    workoutExercise: WorkoutExercise
  ) {
    const form =
      getNewSetForm(
        workoutExercise.id
      );

    const reps =
      Number(form.reps);

    if (
      !Number.isInteger(reps) ||
      reps <= 0
    ) {
      return;
    }

    const weight =
      form.weight.trim() === ""
        ? null
        : Number(form.weight);

    if (
      weight !== null &&
      (
        Number.isNaN(weight) ||
        weight < 0
      )
    ) {
      return;
    }

    const nextSetNumber =
      workoutExercise.sets.length > 0
        ? Math.max(
            ...workoutExercise.sets.map(
              (set) =>
                set.setNumber
            )
          ) + 1
        : 1;

    onAddSet(
      workoutExercise.id,
      nextSetNumber,
      reps,
      weight
    );

    setNewSetForms(
      (currentForms) => ({
        ...currentForms,

        [workoutExercise.id]: {
          reps: "",
          weight: ""
        }
      })
    );
  }

  function startEditingSet(
    setId: number,
    setNumber: number,
    reps: number,
    weight: string | null
  ) {
    setEditingSet({
      setId,
      setNumber,
      reps: String(reps),
      weight: weight ?? ""
    });
  }

  function cancelEditingSet() {
    setEditingSet(null);
  }

  function handleUpdateSet() {
    if (!editingSet) {
      return;
    }

    const reps =
      Number(editingSet.reps);

    if (
      !Number.isInteger(reps) ||
      reps <= 0
    ) {
      return;
    }

    const weight =
      editingSet.weight.trim() === ""
        ? null
        : Number(
            editingSet.weight
          );

    if (
      weight !== null &&
      (
        Number.isNaN(weight) ||
        weight < 0
      )
    ) {
      return;
    }

    onUpdateSet(
      editingSet.setId,
      editingSet.setNumber,
      reps,
      weight
    );

    setEditingSet(null);
  }

  return (
    <section className="workout-detail">
      <div className="workout-detail-header">
        <div>
          <span className="section-eyebrow">
            Detalle del entrenamiento
          </span>

          <h2>
            {routine?.name ??
              "Entrenamiento libre"}
          </h2>

          <p>
            {performedAt}
          </p>
        </div>

        <div className="live-workout-status">
          {isActive ? (
            <>
              <span className="live-status-badge">
                En curso
              </span>

              <button
                type="button"
                className="primary-button"
                onClick={() =>
                  setShowCompleteConfirmation(
                    true
                  )
                }
              >
                Finalizar entrenamiento
              </button>
            </>
          ) : (
            <span className="completed-status-badge">
              Completado
            </span>
          )}
        </div>
      </div>

      <div className="workout-summary">
        <div className="workout-summary-card">
          <span>
            Duración
          </span>

          <strong>
            {workoutDuration !== null
              ? formatDuration(
                  workoutDuration
                )
              : "—"}
          </strong>
        </div>

        <div className="workout-summary-card">
          <span>
            Volumen total
          </span>

          <strong>
            {formatVolume(
              totalVolume
            )}
            {" kg"}
          </strong>
        </div>

        <div className="workout-summary-card">
          <span>
            Series
          </span>

          <strong>
            {totalSets}
          </strong>
        </div>

        <div className="workout-summary-card">
          <span>
            Ejercicios
          </span>

          <strong>
            {
              workoutExercises.length
            }
          </strong>
        </div>
      </div>

      {workout.notes && (
        <div className="workout-detail-notes">
          <strong>
            Notas
          </strong>

          <p>
            {workout.notes}
          </p>
        </div>
      )}

      {isActive && (
        <div className="workout-detail-section">
          <div className="workout-detail-section-header">
            <div>
              <span className="section-eyebrow">
                Ejercicios
              </span>

              <h3>
                Añadir ejercicio
              </h3>
            </div>
          </div>

          <ExercisePicker
            exercises={exercises}
            excludedExerciseIds={
              workoutExercises.map(
                (exercise) =>
                  exercise.exerciseId
              )
            }
            onSelectExercise={
              onAddExercise
            }
            buttonText="Añadir al entrenamiento"
          />
        </div>
      )}

      <div className="workout-detail-section">
        <div className="workout-detail-section-header">
          <div>
            <span className="section-eyebrow">
              Registro
            </span>

            <h3>
              Ejercicios realizados
            </h3>
          </div>

          <span className="workout-exercise-count">
            {workoutExercises.length}
            {" "}
            {workoutExercises.length === 1
              ? "ejercicio"
              : "ejercicios"}
          </span>
        </div>

        {workoutExercises.length === 0 ? (
          <div className="empty-state">
            <p>
              Este entrenamiento todavía
              no tiene ejercicios.
            </p>
          </div>
        ) : (
          <div className="workout-exercise-list">
            {workoutExercises.map(
              (workoutExercise) => {
                const newSetForm =
                  getNewSetForm(
                    workoutExercise.id
                  );

                const exerciseVolume =
                  calculateExerciseVolume(
                    workoutExercise
                  );

                return (
                  <article
                    className="workout-exercise-card"
                    key={
                      workoutExercise.id
                    }
                  >
                    <div className="workout-exercise-header">
                      <div>
                        <span className="exercise-card-label">
                          {
                            workoutExercise.muscleGroup
                          }
                        </span>

                        <h4>
                          {
                            workoutExercise.name
                          }
                        </h4>
                      </div>

                      <div className="workout-exercise-header-actions">
                        <div className="exercise-volume">
                          <span>
                            Volumen
                          </span>

                          <strong>
                            {formatVolume(
                              exerciseVolume
                            )}
                            {" kg"}
                          </strong>
                        </div>

                        {isActive && (
                          <button
                            type="button"
                            className="danger-button"
                            onClick={() =>
                              setExerciseToDelete(
                                workoutExercise
                              )
                            }
                          >
                            Quitar ejercicio
                          </button>
                        )}
                      </div>
                    </div>

                    {isActive && (
                      <PreviousExercisePerformance
                        exerciseId={
                          workoutExercise.exerciseId
                        }
                        currentWorkoutId={
                          workout.id
                        }
                      />
                    )}

                    {isActive && (
                      <ExercisePRStatus
                        exerciseId={
                          workoutExercise.exerciseId
                        }
                        currentWorkoutId={
                          workout.id
                        }
                        currentSets={
                          workoutExercise.sets
                        }
                      />
                    )}

                    {workoutExercise.sets
                      .length === 0 ? (
                      <div className="empty-state compact">
                        <p>
                          Todavía no hay
                          series registradas.
                        </p>
                      </div>
                    ) : (
                      <div className="workout-set-list">
                        <div className="workout-set-row workout-set-header-row">
                          <span>
                            Serie
                          </span>

                          <span>
                            Peso
                          </span>

                          <span>
                            Reps
                          </span>

                          <span>
                            Acciones
                          </span>
                        </div>

                        {workoutExercise.sets.map(
                          (set) => {
                            const isEditing =
                              editingSet?.setId ===
                              set.id;

                            return (
                              <div
                                className="workout-set-row"
                                key={
                                  set.id
                                }
                              >
                                <span>
                                  {
                                    set.setNumber
                                  }
                                </span>

                                {isEditing &&
                                editingSet ? (
                                  <>
                                    <input
                                      type="number"
                                      min="0"
                                      step="0.5"
                                      value={
                                        editingSet.weight
                                      }
                                      onChange={(
                                        event
                                      ) =>
                                        setEditingSet(
                                          {
                                            ...editingSet,
                                            weight:
                                              event
                                                .target
                                                .value
                                          }
                                        )
                                      }
                                      placeholder="kg"
                                    />

                                    <input
                                      type="number"
                                      min="1"
                                      value={
                                        editingSet.reps
                                      }
                                      onChange={(
                                        event
                                      ) =>
                                        setEditingSet(
                                          {
                                            ...editingSet,
                                            reps:
                                              event
                                                .target
                                                .value
                                          }
                                        )
                                      }
                                    />

                                    <div className="workout-set-actions">
                                      <button
                                        type="button"
                                        className="primary-button"
                                        onClick={
                                          handleUpdateSet
                                        }
                                      >
                                        Guardar
                                      </button>

                                      <button
                                        type="button"
                                        className="secondary-button"
                                        onClick={
                                          cancelEditingSet
                                        }
                                      >
                                        Cancelar
                                      </button>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <span>
                                      {set.weight !==
                                      null
                                        ? `${set.weight} kg`
                                        : "—"}
                                    </span>

                                    <span>
                                      {set.reps}
                                    </span>

                                    <div className="workout-set-actions">
                                      {isActive ? (
                                        <>
                                          <button
                                            type="button"
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
                                            type="button"
                                            className="danger-button"
                                            onClick={() =>
                                              setSetToDelete(
                                                set.id
                                              )
                                            }
                                          >
                                            Eliminar
                                          </button>
                                        </>
                                      ) : (
                                        <span>
                                          —
                                        </span>
                                      )}
                                    </div>
                                  </>
                                )}
                              </div>
                            );
                          }
                        )}
                      </div>
                    )}

                    {isActive && (
                      <div className="workout-add-set">
                        <div>
                          <label>
                            Peso (kg)
                          </label>

                          <input
                            type="number"
                            min="0"
                            step="0.5"
                            value={
                              newSetForm.weight
                            }
                            onChange={(
                              event
                            ) =>
                              updateNewSetForm(
                                workoutExercise.id,
                                "weight",
                                event.target.value
                              )
                            }
                            placeholder="Ej. 70"
                          />
                        </div>

                        <div>
                          <label>
                            Repeticiones
                          </label>

                          <input
                            type="number"
                            min="1"
                            value={
                              newSetForm.reps
                            }
                            onChange={(
                              event
                            ) =>
                              updateNewSetForm(
                                workoutExercise.id,
                                "reps",
                                event.target.value
                              )
                            }
                            placeholder="Ej. 10"
                          />
                        </div>

                        <button
                          type="button"
                          className="primary-button"
                          onClick={() =>
                            handleAddSet(
                              workoutExercise
                            )
                          }
                        >
                          Añadir serie
                        </button>
                      </div>
                    )}
                  </article>
                );
              }
            )}
          </div>
        )}
      </div>

      {exerciseToDelete && (
        <ConfirmModal
          title="Quitar ejercicio"
          message={`¿Seguro que quieres quitar "${exerciseToDelete.name}" de este entrenamiento? También se eliminarán sus series.`}
          confirmText="Quitar"
          onCancel={() =>
            setExerciseToDelete(null)
          }
          onConfirm={() => {
            onRemoveExercise(
              exerciseToDelete.id
            );

            setExerciseToDelete(null);
          }}
        />
      )}

      {setToDelete !== null && (
        <ConfirmModal
          title="Eliminar serie"
          message="¿Seguro que quieres eliminar esta serie?"
          confirmText="Eliminar"
          onCancel={() =>
            setSetToDelete(null)
          }
          onConfirm={() => {
            onDeleteSet(
              setToDelete
            );

            setSetToDelete(null);
          }}
        />
      )}

      {showCompleteConfirmation && (
        <ConfirmModal
          title="Finalizar entrenamiento"
          message="¿Seguro que quieres finalizar este entrenamiento? Después quedará guardado como completado."
          confirmText="Finalizar"
          cancelText="Continuar entrenando"
          onCancel={() =>
            setShowCompleteConfirmation(
              false
            )
          }
          onConfirm={() => {
            onCompleteWorkout();

            setShowCompleteConfirmation(
              false
            );
          }}
        />
      )}
    </section>
  );
}

export default WorkoutDetail;