import { useState } from "react";

import ConfirmModal from "./ConfirmModal";

import type { Routine } from "../types/Routine";
import type { Workout } from "../types/Workout";

type WorkoutListProps = {
  workouts: Workout[];
  routines: Routine[];

  onViewWorkout: (
    id: number
  ) => void;

  onDeleteWorkout: (
    id: number
  ) => void;
};

function WorkoutList({
  workouts,
  routines,
  onViewWorkout,
  onDeleteWorkout
}: WorkoutListProps) {
  const [
    workoutToDelete,
    setWorkoutToDelete
  ] = useState<Workout | null>(null);

  if (workouts.length === 0) {
    return (
      <div className="empty-state">
        <p>
          Todavía no hay entrenamientos
          registrados.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="workout-grid">
        {workouts.map((workout) => {
          const routine =
            routines.find(
              (routine) =>
                routine.id ===
                workout.routineId
            );

          const date =
            new Date(
              workout.performedAt
            ).toLocaleString(
              "es-ES",
              {
                dateStyle: "medium",
                timeStyle: "short"
              }
            );

          const isActive =
            workout.status === "active";

          return (
            <article
              className="workout-card"
              key={workout.id}
            >
              <div className="workout-card-header">
                <div>
                  <span className="section-eyebrow">
                    Entrenamiento
                  </span>

                  <h3>
                    {routine?.name ??
                      "Entrenamiento libre"}
                  </h3>
                </div>

                <span
                  className={
                    isActive
                      ? "live-status-badge"
                      : "completed-status-badge"
                  }
                >
                  {isActive
                    ? "En curso"
                    : "Completado"}
                </span>
              </div>

              <div className="workout-card-body">
                <p>
                  {date}
                </p>

                {workout.notes && (
                  <p>
                    {workout.notes}
                  </p>
                )}
              </div>

              <div className="workout-card-actions">
                <button
                  type="button"
                  className={
                    isActive
                      ? "primary-button"
                      : "secondary-button"
                  }
                  onClick={() =>
                    onViewWorkout(
                      workout.id
                    )
                  }
                >
                  {isActive
                    ? "Continuar entrenamiento"
                    : "Ver detalles"}
                </button>

                {!isActive && (
                  <button
                    type="button"
                    className="danger-button"
                    onClick={() =>
                      setWorkoutToDelete(
                        workout
                      )
                    }
                  >
                    Eliminar
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {workoutToDelete && (
        <ConfirmModal
          title="Eliminar entrenamiento"
          message="¿Seguro que quieres eliminar este entrenamiento y todos sus datos?"
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