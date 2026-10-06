import {
  useState
} from "react";

import ConfirmModal
  from "./ConfirmModal";

import type {
  Routine
} from "../types/Routine";

type RoutineListProps = {
  routines: Routine[];

  onDeleteRoutine: (
    id: number
  ) => void;

  onEditRoutine: (
    routine: Routine
  ) => void;

  onStartWorkout: (
    routine: Routine
  ) => void;
};

function RoutineList({
  routines,
  onDeleteRoutine,
  onEditRoutine,
  onStartWorkout
}: RoutineListProps) {
  const [
    routineToDelete,
    setRoutineToDelete
  ] = useState<Routine | null>(null);

  if (routines.length === 0) {
    return (
      <div className="empty-state">
        <p>
          Todavía no hay rutinas creadas.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="routine-grid">
        {routines.map(
          (routine) => {
            const exerciseCount =
              routine.exercises?.length ??
              0;

            return (
              <article
                className="routine-card"
                key={routine.id}
              >
                <div className="routine-card-header">
                  <div>
                    <span className="section-eyebrow">
                      Rutina
                    </span>

                    <h3>
                      {routine.name}
                    </h3>
                  </div>

                  <span className="routine-exercise-count">
                    {exerciseCount}
                    {" "}
                    {exerciseCount === 1
                      ? "ejercicio"
                      : "ejercicios"}
                  </span>
                </div>

                <div className="routine-card-body">
                  <p>
                    {routine.description ??
                      "Sin descripción."}
                  </p>

                  {exerciseCount > 0 && (
                    <div className="routine-exercise-tags">
                      {routine.exercises?.map(
                        (exercise) => (
                          <span
                            key={
                              exercise.id
                            }
                            className="routine-exercise-tag"
                          >
                            {exercise.name}
                          </span>
                        )
                      )}
                    </div>
                  )}
                </div>

                <div className="routine-card-actions">
                  <button
                    type="button"
                    className="primary-button"
                    onClick={() =>
                      onStartWorkout(
                        routine
                      )
                    }
                  >
                    Empezar entrenamiento
                  </button>

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() =>
                      onEditRoutine(
                        routine
                      )
                    }
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    className="danger-button"
                    onClick={() =>
                      setRoutineToDelete(
                        routine
                      )
                    }
                  >
                    Eliminar
                  </button>
                </div>
              </article>
            );
          }
        )}
      </div>

      {routineToDelete && (
        <ConfirmModal
          title="Eliminar rutina"
          message={`¿Seguro que quieres eliminar "${routineToDelete.name}"?`}
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