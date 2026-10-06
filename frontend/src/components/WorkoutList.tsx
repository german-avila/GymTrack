import type { Workout } from "../types/Workout";

type WorkoutListProps = {
  workouts: Workout[];
  onViewWorkout: (id: number) => void;
  onEditWorkout: (workout: Workout) => void;
  onDeleteWorkout: (id: number) => void;
};

function WorkoutList({
  workouts,
  onViewWorkout,
  onEditWorkout,
  onDeleteWorkout
}: WorkoutListProps) {
  if (workouts.length === 0) {
    return (
      <div className="empty-state">
        <p>No hay entrenamientos registrados todavía.</p>
      </div>
    );
  }

  return (
    <div className="workout-grid">
      {workouts.map((workout) => (
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
                {new Date(workout.performedAt).toLocaleDateString(
                  "es-ES",
                  {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                  }
                )}
              </h3>
            </div>

            <span className="workout-time">
              {new Date(workout.performedAt).toLocaleTimeString(
                "es-ES",
                {
                  hour: "2-digit",
                  minute: "2-digit"
                }
              )}
            </span>
          </div>

          <div className="workout-meta">
            <span className="workout-badge">
              {workout.routineId === null
                ? "Entrenamiento libre"
                : `Rutina ${workout.routineId}`}
            </span>
          </div>

          {workout.notes ? (
            <p className="workout-notes">
              {workout.notes}
            </p>
          ) : (
            <p className="workout-notes workout-notes-empty">
              Sin notas
            </p>
          )}

          <div className="workout-actions">
            <button
              className="primary-button"
              onClick={() => onViewWorkout(workout.id)}
            >
              Ver detalle
            </button>

            <button
              className="secondary-button"
              onClick={() => onEditWorkout(workout)}
            >
              Editar
            </button>

            <button
              className="danger-button"
              onClick={() => onDeleteWorkout(workout.id)}
            >
              Eliminar
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

export default WorkoutList;