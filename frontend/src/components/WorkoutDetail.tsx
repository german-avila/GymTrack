import { useState } from "react";

import ConfirmModal from "./ConfirmModal";

import type { Exercise } from "../types/Exercise";
import type { Routine } from "../types/Routine";
import type {
  Workout,
  WorkoutSet
} from "../types/Workout";

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
};

function WorkoutDetail({
  workout,
  exercises,
  routines,
  onAddExercise,
  onRemoveExercise,
  onAddSet,
  onUpdateSet,
  onDeleteSet
}: WorkoutDetailProps) {
  const [selectedExerciseId, setSelectedExerciseId] =
    useState<string>("");

  const [
    addingSetForExerciseId,
    setAddingSetForExerciseId
  ] = useState<number | null>(null);

  const [newSetNumber, setNewSetNumber] =
    useState<string>("1");

  const [newSetReps, setNewSetReps] =
    useState<string>("");

  const [newSetWeight, setNewSetWeight] =
    useState<string>("");

  const [editingSetId, setEditingSetId] =
    useState<number | null>(null);

  const [editingSetNumber, setEditingSetNumber] =
    useState<string>("");

  const [editingSetReps, setEditingSetReps] =
    useState<string>("");

  const [editingSetWeight, setEditingSetWeight] =
    useState<string>("");

  const [
    exerciseToDelete,
    setExerciseToDelete
  ] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const [setToDelete, setSetToDelete] =
    useState<WorkoutSet | null>(null);

  const routine = routines.find(
    (routine) =>
      routine.id === workout.routineId
  );

  const availableExercises =
    exercises.filter(
      (exercise) =>
        !workout.exercises?.some(
          (workoutExercise) =>
            workoutExercise.exerciseId ===
            exercise.id
        )
    );

  function handleAddExercise() {
    if (selectedExerciseId === "") {
      return;
    }

    onAddExercise(
      Number(selectedExerciseId)
    );

    setSelectedExerciseId("");
  }

  function startAddingSet(
    workoutExerciseId: number,
    currentSetCount: number
  ) {
    setAddingSetForExerciseId(
      workoutExerciseId
    );

    setNewSetNumber(
      String(currentSetCount + 1)
    );

    setNewSetReps("");
    setNewSetWeight("");
  }

  function cancelAddingSet() {
    setAddingSetForExerciseId(null);
    setNewSetNumber("1");
    setNewSetReps("");
    setNewSetWeight("");
  }

  function handleAddSet(
    workoutExerciseId: number
  ) {
    const setNumber =
      Number(newSetNumber);

    const reps =
      Number(newSetReps);

    const weight =
      newSetWeight.trim() === ""
        ? null
        : Number(newSetWeight);

    if (
      !Number.isInteger(setNumber) ||
      setNumber <= 0 ||
      !Number.isInteger(reps) ||
      reps <= 0 ||
      (
        weight !== null &&
        (
          !Number.isFinite(weight) ||
          weight < 0
        )
      )
    ) {
      return;
    }

    onAddSet(
      workoutExerciseId,
      setNumber,
      reps,
      weight
    );

    cancelAddingSet();
  }

  function startEditingSet(
    set: WorkoutSet
  ) {
    setEditingSetId(set.id);

    setEditingSetNumber(
      String(set.setNumber)
    );

    setEditingSetReps(
      String(set.reps)
    );

    setEditingSetWeight(
      set.weight ?? ""
    );
  }

  function cancelEditingSet() {
    setEditingSetId(null);
    setEditingSetNumber("");
    setEditingSetReps("");
    setEditingSetWeight("");
  }

  function handleUpdateSet(
    setId: number
  ) {
    const setNumber =
      Number(editingSetNumber);

    const reps =
      Number(editingSetReps);

    const weight =
      editingSetWeight.trim() === ""
        ? null
        : Number(editingSetWeight);

    if (
      !Number.isInteger(setNumber) ||
      setNumber <= 0 ||
      !Number.isInteger(reps) ||
      reps <= 0 ||
      (
        weight !== null &&
        (
          !Number.isFinite(weight) ||
          weight < 0
        )
      )
    ) {
      return;
    }

    onUpdateSet(
      setId,
      setNumber,
      reps,
      weight
    );

    cancelEditingSet();
  }

  return (
    <section className="workout-detail">
      <div className="dashboard-header">
        <div>
          <span className="workout-date-label">
            Entrenamiento
          </span>

          <h2>
            {new Date(
              workout.performedAt
            ).toLocaleDateString(
              "es-ES"
            )}
          </h2>

          <p>
            {workout.routineId === null
              ? "Entrenamiento libre"
              : routine?.name ??
                "Rutina desconocida"}
          </p>
        </div>
      </div>

      {workout.notes && (
        <div className="workout-notes">
          <strong>Notas</strong>

          <p>{workout.notes}</p>
        </div>
      )}

      <div className="dashboard-section">
        <h3>
          Ejercicios del entrenamiento
        </h3>

        {!workout.exercises ||
        workout.exercises.length === 0 ? (
          <div className="empty-state">
            <p>
              Este entrenamiento todavía
              no tiene ejercicios.
            </p>
          </div>
        ) : (
          <div className="workout-exercise-list">
            {workout.exercises.map(
              (workoutExercise) => (
                <article
                  className="workout-exercise-card"
                  key={workoutExercise.id}
                >
                  <div className="workout-exercise-header">
                    <div>
                      <h4>
                        {
                          workoutExercise.name
                        }
                      </h4>

                      <p>
                        {
                          workoutExercise
                            .muscleGroup
                        }
                      </p>
                    </div>

                    <button
                      className="danger-button"
                      type="button"
                      onClick={() =>
                        setExerciseToDelete(
                          {
                            id:
                              workoutExercise
                                .id,
                            name:
                              workoutExercise
                                .name
                          }
                        )
                      }
                    >
                      Eliminar ejercicio
                    </button>
                  </div>

                  <div className="workout-sets">
                    {workoutExercise.sets
                      .length === 0 ? (
                      <div className="empty-state">
                        <p>
                          Todavía no hay
                          series registradas.
                        </p>
                      </div>
                    ) : (
                      workoutExercise.sets.map(
                        (set) => (
                          <div
                            className="workout-set-row"
                            key={set.id}
                          >
                            {editingSetId ===
                            set.id ? (
                              <>
                                <div className="form-group">
                                  <label>
                                    Serie
                                  </label>

                                  <input
                                    type="number"
                                    min="1"
                                    value={
                                      editingSetNumber
                                    }
                                    onChange={(
                                      event
                                    ) =>
                                      setEditingSetNumber(
                                        event
                                          .target
                                          .value
                                      )
                                    }
                                  />
                                </div>

                                <div className="form-group">
                                  <label>
                                    Reps
                                  </label>

                                  <input
                                    type="number"
                                    min="1"
                                    value={
                                      editingSetReps
                                    }
                                    onChange={(
                                      event
                                    ) =>
                                      setEditingSetReps(
                                        event
                                          .target
                                          .value
                                      )
                                    }
                                  />
                                </div>

                                <div className="form-group">
                                  <label>
                                    Peso (kg)
                                  </label>

                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={
                                      editingSetWeight
                                    }
                                    onChange={(
                                      event
                                    ) =>
                                      setEditingSetWeight(
                                        event
                                          .target
                                          .value
                                      )
                                    }
                                  />
                                </div>

                                <div>
                                  <button
                                    className="primary-button"
                                    type="button"
                                    onClick={() =>
                                      handleUpdateSet(
                                        set.id
                                      )
                                    }
                                  >
                                    Guardar
                                  </button>

                                  <button
                                    className="secondary-button"
                                    type="button"
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
                                <div>
                                  <strong>
                                    Serie{" "}
                                    {
                                      set.setNumber
                                    }
                                  </strong>
                                </div>

                                <div>
                                  <strong>
                                    {set.reps} reps
                                  </strong>
                                </div>

                                <div>
                                  <strong>
                                    {set.weight !==
                                    null
                                      ? `${set.weight} kg`
                                      : "Sin peso"}
                                  </strong>
                                </div>

                                <div>
                                  <button
                                    className="secondary-button"
                                    type="button"
                                    onClick={() =>
                                      startEditingSet(
                                        set
                                      )
                                    }
                                  >
                                    Editar
                                  </button>

                                  <button
                                    className="danger-button"
                                    type="button"
                                    onClick={() =>
                                      setSetToDelete(
                                        set
                                      )
                                    }
                                  >
                                    Eliminar
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        )
                      )
                    )}
                  </div>

                  {addingSetForExerciseId ===
                  workoutExercise.id ? (
                    <div className="add-set-panel">
                      <div className="form-group">
                        <label>
                          Número de serie
                        </label>

                        <input
                          type="number"
                          min="1"
                          value={newSetNumber}
                          onChange={(
                            event
                          ) =>
                            setNewSetNumber(
                              event.target
                                .value
                            )
                          }
                        />
                      </div>

                      <div className="form-group">
                        <label>
                          Repeticiones
                        </label>

                        <input
                          type="number"
                          min="1"
                          value={newSetReps}
                          onChange={(
                            event
                          ) =>
                            setNewSetReps(
                              event.target
                                .value
                            )
                          }
                        />
                      </div>

                      <div className="form-group">
                        <label>
                          Peso (kg)
                        </label>

                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={newSetWeight}
                          onChange={(
                            event
                          ) =>
                            setNewSetWeight(
                              event.target
                                .value
                            )
                          }
                        />
                      </div>

                      <button
                        className="primary-button"
                        type="button"
                        onClick={() =>
                          handleAddSet(
                            workoutExercise.id
                          )
                        }
                      >
                        Guardar serie
                      </button>

                      <button
                        className="secondary-button"
                        type="button"
                        onClick={
                          cancelAddingSet
                        }
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      className="primary-button"
                      type="button"
                      onClick={() =>
                        startAddingSet(
                          workoutExercise.id,
                          workoutExercise.sets
                            .length
                        )
                      }
                    >
                      Añadir serie
                    </button>
                  )}
                </article>
              )
            )}
          </div>
        )}
      </div>

      <div className="dashboard-section">
        <h3>Añadir ejercicio</h3>

        {availableExercises.length ===
        0 ? (
          <div className="empty-state">
            <p>
              No hay más ejercicios
              disponibles para añadir.
            </p>
          </div>
        ) : (
          <div className="available-exercise">
            <select
              value={selectedExerciseId}
              onChange={(event) =>
                setSelectedExerciseId(
                  event.target.value
                )
              }
            >
              <option value="">
                Selecciona un ejercicio
              </option>

              {availableExercises.map(
                (exercise) => (
                  <option
                    key={exercise.id}
                    value={exercise.id}
                  >
                    {exercise.name} -{" "}
                    {exercise.muscleGroup}
                  </option>
                )
              )}
            </select>

            <button
              className="primary-button"
              type="button"
              onClick={
                handleAddExercise
              }
              disabled={
                selectedExerciseId ===
                ""
              }
            >
              Añadir ejercicio
            </button>
          </div>
        )}
      </div>

      {exerciseToDelete && (
        <ConfirmModal
          title="Eliminar ejercicio"
          message={`¿Seguro que quieres quitar "${exerciseToDelete.name}" del entrenamiento? También se eliminarán todas sus series.`}
          confirmText="Eliminar"
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

      {setToDelete && (
        <ConfirmModal
          title="Eliminar serie"
          message={`¿Seguro que quieres eliminar la serie ${setToDelete.setNumber}?`}
          confirmText="Eliminar"
          onCancel={() =>
            setSetToDelete(null)
          }
          onConfirm={() => {
            onDeleteSet(
              setToDelete.id
            );

            setSetToDelete(null);
          }}
        />
      )}
    </section>
  );
}

export default WorkoutDetail;