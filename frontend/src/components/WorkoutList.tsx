import type { Workout } from "../types/Workout";

type WorkoutListProps = {
  workouts: Workout[];
};

function WorkoutList({ workouts }: WorkoutListProps) {
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
        </li>
      ))}
    </ul>
  );
}

export default WorkoutList;