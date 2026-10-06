import { useState } from "react";

import ConfirmModal from "./ConfirmModal";

import type { Exercise } from "../types/Exercise";

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
  const [
    exerciseToDelete,
    setExerciseToDelete
  ] = useState<Exercise | null>(null);

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
      <div className="exercise-grid">
        {exercises.map((exercise) => (
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
                  {exercise.muscleGroup}
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
                  Incluido en el catálogo de GymTrack
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
        ))}
      </div>

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