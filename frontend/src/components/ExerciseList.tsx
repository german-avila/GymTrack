import { useState } from "react";

import ConfirmModal from "./ConfirmModal";

import type { Exercise } from "../types/Exercise";

import { MUSCLE_GROUPS } from "../constants/muscleGroups";

type ExerciseListProps = {
  exercises: Exercise[];
  onEditExercise: (
    exercise: Exercise
  ) => void;
  onDeleteExercise: (
    id: number
  ) => void;
};

function ExerciseList({
  exercises,
  onEditExercise,
  onDeleteExercise
}: ExerciseListProps) {
  const [searchTerm, setSearchTerm] =
    useState("");

  const [
    selectedMuscleGroup,
    setSelectedMuscleGroup
  ] = useState("");

  const [
    exerciseToDelete,
    setExerciseToDelete
  ] = useState<Exercise | null>(null);

  const normalizedSearchTerm =
    searchTerm
      .trim()
      .toLocaleLowerCase("es-ES");

  const filteredExercises =
    exercises.filter((exercise) => {
      const matchesSearch =
        exercise.name
          .toLocaleLowerCase("es-ES")
          .includes(
            normalizedSearchTerm
          );

      const matchesMuscleGroup =
        selectedMuscleGroup === "" ||
        exercise.muscleGroup ===
          selectedMuscleGroup;

      return (
        matchesSearch &&
        matchesMuscleGroup
      );
    });

  if (exercises.length === 0) {
    return (
      <div className="empty-state">
        <p>
          Todavía no hay ejercicios registrados.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="exercise-toolbar">
        <div className="exercise-search">
          <label htmlFor="exerciseSearch">
            Buscar ejercicio
          </label>

          <input
            id="exerciseSearch"
            type="search"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
            placeholder="Ej. press banca"
          />
        </div>

        <div className="exercise-filter">
          <label htmlFor="muscleGroupFilter">
            Grupo muscular
          </label>

          <select
            id="muscleGroupFilter"
            value={selectedMuscleGroup}
            onChange={(event) =>
              setSelectedMuscleGroup(
                event.target.value
              )
            }
          >
            <option value="">
              Todos los grupos
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

      <div className="exercise-results-info">
        <span>
          {filteredExercises.length}
          {" "}
          {filteredExercises.length === 1
            ? "ejercicio"
            : "ejercicios"}
        </span>

        {(searchTerm !== "" ||
          selectedMuscleGroup !== "") && (
          <button
            type="button"
            className="clear-filters-button"
            onClick={() => {
              setSearchTerm("");
              setSelectedMuscleGroup("");
            }}
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {filteredExercises.length === 0 ? (
        <div className="empty-state">
          <p>
            No hay ejercicios que coincidan
            con los filtros seleccionados.
          </p>
        </div>
      ) : (
        <div className="exercise-grid">
          {filteredExercises.map(
            (exercise) => (
              <article
                className="exercise-card"
                key={exercise.id}
              >
                <div className="exercise-card-header">
                  <span className="exercise-card-label">
                    Ejercicio
                  </span>

                  <h3>
                    {exercise.name}
                  </h3>

                  <div className="exercise-badges">
                    <span className="exercise-muscle-badge">
                      {
                        exercise.muscleGroup
                      }
                    </span>

                    {exercise.isSystem && (
                      <span className="exercise-origin-badge">
                        GymTrack
                      </span>
                    )}
                  </div>
                </div>

                <div className="exercise-card-body">
                  <p>
                    {exercise.description ??
                      "Sin descripción."}
                  </p>
                </div>

                <div className="exercise-card-actions">
                  {exercise.isSystem ? (
                    <span className="system-exercise-info">
                      Incluido en el catálogo
                      de GymTrack
                    </span>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() =>
                          onEditExercise(
                            exercise
                          )
                        }
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        className="danger-button"
                        onClick={() =>
                          setExerciseToDelete(
                            exercise
                          )
                        }
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </div>
              </article>
            )
          )}
        </div>
      )}

      {exerciseToDelete && (
        <ConfirmModal
          title="Eliminar ejercicio"
          message={`¿Seguro que quieres eliminar "${exerciseToDelete.name}"?`}
          confirmText="Eliminar"
          onCancel={() =>
            setExerciseToDelete(null)
          }
          onConfirm={() => {
            onDeleteExercise(
              exerciseToDelete.id
            );

            setExerciseToDelete(null);
          }}
        />
      )}
    </>
  );
}

export default ExerciseList;