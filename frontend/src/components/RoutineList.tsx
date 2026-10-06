import { useState } from "react";

import ConfirmModal from "./ConfirmModal";

import type { Routine } from "../types/Routine";

type RoutineListProps = {
  routines: Routine[];
  onDeleteRoutine: (id: number) => void;
  onEditRoutine: (routine: Routine) => void;
  onManageExercises: (routine: Routine) => void;
};

function RoutineList({
  routines,
  onDeleteRoutine,
  onEditRoutine,
  onManageExercises
}: RoutineListProps) {
  const [routineToDelete, setRoutineToDelete] =
    useState<Routine | null>(null);

  if (routines.length === 0) {
    return (
      <div className="empty-state">
        <p>Todavía no hay rutinas creadas.</p>
      </div>
    );
  }

  return (
    <>
      <div className="routine-grid">
        {routines.map((routine) => (
          <article
            className="routine-card"
            key={routine.id}
          >
            <div className="routine-card-header">
              <div>
                <span className="routine-card-label">
                  Rutina
                </span>

                <h3>{routine.name}</h3>
              </div>

              <span className="routine-count-badge">
                {routine.exercises?.length ?? 0} ejercicios
              </span>
            </div>

            <div className="routine-card-body">
              <p>
                {routine.description ??
                  "Sin descripción."}
              </p>

              <div className="routine-exercise-preview">
                <span className="routine-preview-title">
                  Ejercicios
                </span>

                {routine.exercises &&
                routine.exercises.length > 0 ? (
                  <div className="routine-tags">
                    {routine.exercises.map((exercise) => (
                      <span
                        className="routine-exercise-tag"
                        key={exercise.id}
                      >
                        {exercise.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="routine-empty-text">
                    Todavía no hay ejercicios añadidos.
                  </p>
                )}
              </div>
            </div>

            <div className="routine-card-actions">
              <button
                type="button"
                className="primary-button"
                onClick={() =>
                  onManageExercises(routine)
                }
              >
                Gestionar ejercicios
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={() =>
                  onEditRoutine(routine)
                }
              >
                Editar
              </button>

              <button
                type="button"
                className="danger-button"
                onClick={() =>
                  setRoutineToDelete(routine)
                }
              >
                Eliminar
              </button>
            </div>
          </article>
        ))}
      </div>

      {routineToDelete && (
        <ConfirmModal
          title="Eliminar rutina"
          message={`¿Seguro que quieres eliminar la rutina "${routineToDelete.name}"?`}
          confirmText="Eliminar"
          onCancel={() =>
            setRoutineToDelete(null)
          }
          onConfirm={() => {
            onDeleteRoutine(
              routineToDelete.id
            );

            setRoutineToDelete(null);
          }}
        />
      )}
    </>
  );
}

export default RoutineList;