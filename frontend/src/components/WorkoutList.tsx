import { useState } from "react";

import ConfirmModal from "./ConfirmModal";

import type { Routine } from "../types/Routine";
import type { Workout } from "../types/Workout";

type WorkoutListProps = {
  workouts: Workout[];
  routines: Routine[];
  onViewWorkout: (id: number) => void;
  onEditWorkout: (workout: Workout) => void;
  onDeleteWorkout: (id: number) => void;
};

function WorkoutList({
  workouts,
  routines,
  onViewWorkout,
  onEditWorkout,
  onDeleteWorkout
}: WorkoutListProps) {
  const [workoutToDelete, setWorkoutToDelete] =
    useState<Workout | null>(null);

  if (workouts.length === 0) {
    return (
      <div className="empty-state">
        <p>Todavía no hay entrenamientos registrados.</p>
      </div>
    );
  }

  return (
    <>
      <div className="workout-grid">
        {workouts.map((workout) => {
          const routine = routines.find(
            (routine) =>
              routine.id === workout.routineId
          );

          return (
            <article
              className="workout-card"
              key={workout.id}
            >
              <div className="workout-card-header">
                <div>
                  <span className="workout-date-label">
                    Entrenamiento
                  </span>

                  <h3>
                    {new Date(
                      workout.performedAt
                    ).toLocaleDateString("es-ES")}
                  </h3>
                </div>

                <span className="workout-badge">
                  {workout.routineId === null
                    ? "Entrenamiento libre"
                    : routine?.name ??
                      "Rutina desconocida"}
                </span>
              </div>

              <div className="workout-card-body">
                {workout.notes ? (
                  <p>{workout.notes}</p>
                ) : (
                  <p>Sin notas.</p>
                )}
              </div>

              <div className="workout-card-actions">
                <button
                  type="button"
                  className="primary-button"
                  onClick={() =>
                    onViewWorkout(workout.id)
                  }
                >
                  Ver detalle
                </button>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    onEditWorkout(workout)
                  }
                >
                  Editar
                </button>

                <button
                  type="button"
                  className="danger-button"
                  onClick={() =>
                    setWorkoutToDelete(workout)
                  }
                >
                  Eliminar
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {workoutToDelete && (
        <ConfirmModal
          title="Eliminar entrenamiento"
          message={`¿Seguro que quieres eliminar el entrenamiento del ${new Date(
            workoutToDelete.performedAt
          ).toLocaleDateString("es-ES")}? Se eliminarán también sus ejercicios y series registradas.`}
          confirmText="Eliminar"
          onCancel={() =>
            setWorkoutToDelete(null)
          }
          onConfirm={() => {
            onDeleteWorkout(
              workoutToDelete.id
            );

            setWorkoutToDelete(null);
          }}
        />
      )}
    </>
  );
}

export default WorkoutList;