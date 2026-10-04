import type { Exercise } from "../types/Exercise";
import type { Routine } from "../types/Routine";

type RoutineExerciseManagerProps = {
  routine: Routine;
  exercises: Exercise[];
  onAddExercise: (exerciseId: number) => void;
  onRemoveExercise: (exerciseId: number) => void;
};

function RoutineExerciseManager({
  routine,
  exercises,
  onAddExercise,
  onRemoveExercise
}: RoutineExerciseManagerProps) {
  return (
    <section>
      <h3>Ejercicios de {routine.name}</h3>

      <h4>En la rutina</h4>

      {routine.exercises && routine.exercises.length > 0 ? (
        <ul>
          {routine.exercises.map((exercise) => (
            <li key={exercise.id}>
              <strong>{exercise.name}</strong> - {exercise.muscleGroup}

              <button
                className="danger-button"
                onClick={() => onRemoveExercise(exercise.id)}
              >
                Quitar
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Esta rutina todavía no tiene ejercicios.</p>
      )}

      <h4>Añadir ejercicios</h4>

      <ul>
        {exercises.map((exercise) => {
          const isInRoutine = routine.exercises?.some(
            (routineExercise) => routineExercise.id === exercise.id
          );

          if (isInRoutine) {
            return null;
          }

          return (
            <li key={exercise.id}>
              <strong>{exercise.name}</strong> - {exercise.muscleGroup}

              <button
                className="primary-button"
                onClick={() => onAddExercise(exercise.id)}
              >
                Añadir
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default RoutineExerciseManager;