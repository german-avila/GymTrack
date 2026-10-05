import type { Workout } from "../types/Workout";

type WorkoutListProps = {
  workouts: Workout[];
  onEditWorkout: (workout: Workout) => void;
  onDeleteWorkout: (id: number) => void;
  onViewWorkout: (id: number) => void;
};

function WorkoutList({
  workouts,
  onEditWorkout,
  onDeleteWorkout,
  onViewWorkout
}: WorkoutListProps) {
  if (workouts.length === 0) {
    return <p>No hay entrenamientos registrados.</p>;
  }

  return (
    <ul className="exercise-list">
      {workouts.map((workout) => (
        <li className="exercise-item" key={workout.id}>
          <strong>
            {new Date(workout.performedAt).toLocaleString("es-ES")}
          </strong>

          <p>
            {workout.routineId === null
              ? "Entrenamiento libre"
              : `Rutina ${workout.routineId}`}
          </p>

          {workout.notes && (
            <p>{workout.notes}</p>
          )}
          
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
        </li>
      ))}
    </ul>
  );
}

export default WorkoutList;