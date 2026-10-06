import { useMemo, useState } from "react";

import type { Exercise } from "../types/Exercise";

import { MUSCLE_GROUPS } from "../constants/muscleGroups";

type ExercisePickerProps = {
  exercises: Exercise[];
  onSelectExercise: (exerciseId: number) => void;
  excludedExerciseIds?: number[];
  buttonText?: string;
};

function ExercisePicker({
  exercises,
  onSelectExercise,
  excludedExerciseIds = [],
  buttonText = "Añadir ejercicio"
}: ExercisePickerProps) {
  const [searchTerm, setSearchTerm] =
    useState("");

  const [
    selectedMuscleGroup,
    setSelectedMuscleGroup
  ] = useState("");

  const [
    selectedExerciseId,
    setSelectedExerciseId
  ] = useState<number | null>(null);

  const filteredExercises =
    useMemo(() => {
      const normalizedSearch =
        searchTerm
          .trim()
          .toLocaleLowerCase("es-ES");

      return exercises.filter(
        (exercise) => {
          const isExcluded =
            excludedExerciseIds.includes(
              exercise.id
            );

          if (isExcluded) {
            return false;
          }

          const matchesSearch =
            exercise.name
              .toLocaleLowerCase("es-ES")
              .includes(
                normalizedSearch
              );

          const matchesMuscleGroup =
            selectedMuscleGroup === "" ||
            exercise.muscleGroup ===
              selectedMuscleGroup;

          return (
            matchesSearch &&
            matchesMuscleGroup
          );
        }
      );
    }, [
      exercises,
      excludedExerciseIds,
      searchTerm,
      selectedMuscleGroup
    ]);

  function handleAddExercise() {
    if (selectedExerciseId === null) {
      return;
    }

    onSelectExercise(
      selectedExerciseId
    );

    setSelectedExerciseId(null);
    setSearchTerm("");
    setSelectedMuscleGroup("");
  }

  return (
    <div className="exercise-picker">
      <div className="exercise-picker-filters">
        <div>
          <label htmlFor="exercisePickerSearch">
            Buscar ejercicio
          </label>

          <input
            id="exercisePickerSearch"
            type="search"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
            placeholder="Ej. press, remo, curl..."
          />
        </div>

        <div>
          <label htmlFor="exercisePickerMuscle">
            Grupo muscular
          </label>

          <select
            id="exercisePickerMuscle"
            value={selectedMuscleGroup}
            onChange={(event) =>
              setSelectedMuscleGroup(
                event.target.value
              )
            }
          >
            <option value="">
              Todos
            </option>

            {MUSCLE_GROUPS.map(
              (group) => (
                <option
                  key={group}
                  value={group}
                >
                  {group}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      <div className="exercise-picker-results">
        {filteredExercises.length === 0 ? (
          <div className="exercise-picker-empty">
            No hay ejercicios disponibles.
          </div>
        ) : (
          filteredExercises.map(
            (exercise) => (
              <button
                key={exercise.id}
                type="button"
                className={
                  selectedExerciseId ===
                  exercise.id
                    ? "exercise-picker-option selected"
                    : "exercise-picker-option"
                }
                onClick={() =>
                  setSelectedExerciseId(
                    exercise.id
                  )
                }
              >
                <div>
                  <strong>
                    {exercise.name}
                  </strong>

                  <span>
                    {
                      exercise.muscleGroup
                    }
                  </span>
                </div>

                {exercise.isSystem && (
                  <small>
                    GymTrack
                  </small>
                )}
              </button>
            )
          )
        )}
      </div>

      <button
        type="button"
        className="primary-button"
        disabled={
          selectedExerciseId === null
        }
        onClick={handleAddExercise}
      >
        {buttonText}
      </button>
    </div>
  );
}

export default ExercisePicker;